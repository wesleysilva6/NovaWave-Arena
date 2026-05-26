<?php

namespace App\Domains\Services;

use App\Domains\Repositories\AlunoRepository;
use App\Domains\Repositories\MensalidadeRepository;

class MensalidadeService
{
    public static function listar(): array
    {
        self::recalcularMensalidadesPendentes();
        return MensalidadeRepository::listar();
    }

    public static function confirmarPagamento(int $idmensalidade): array
    {
        return MensalidadeRepository::confirmarPagamento($idmensalidade);
    }

    public static function gerarMesAtual(string $mesReferencia, int $ano, int $mes): array
    {
        $alunos = MensalidadeRepository::alunosSemMensalidade($mesReferencia);

        if (empty($alunos)) {
            return ['geradas' => 0];
        }

        $geradas = 0;
        foreach ($alunos as $aluno) {
            $ultimoDia = (int) (new \DateTime(sprintf('%04d-%02d-01', $ano, $mes)))->format('t');
            $dia = min((int) $aluno['dia_vencimento'], $ultimoDia);
            $dataVencimento = sprintf('%04d-%02d-%02d', $ano, $mes, $dia);

            $valor = self::calcularValorDaCompetencia(
                (int) $aluno['idaluno'],
                (float) ($aluno['valor_mensalidade'] ?? 0),
                $mesReferencia,
                $aluno['data_inicio_contrato'] ?? null
            );

            MensalidadeRepository::gerarMensalidade([
                'aluno_id'       => (int) $aluno['idaluno'],
                'valor'          => $valor,
                'mes_referencia' => $mesReferencia,
                'data_vencimento' => $dataVencimento,
            ]);
            $geradas++;
        }

        return ['geradas' => $geradas];
    }

    public static function contarSemMensalidade(string $mesReferencia): int
    {
        $alunos = MensalidadeRepository::alunosSemMensalidade($mesReferencia);
        return count($alunos);
    }

    public static function calcularValorDaCompetencia(int $alunoId, float $valorMensal, string $mesReferencia, ?string $dataInicioContrato): float
    {
        $config = ConfiguracaoService::buscar();
        $valorMensal = self::calcularValorMensalAtual($alunoId, $valorMensal, $config);

        if (!$dataInicioContrato || substr($dataInicioContrato, 0, 7) !== $mesReferencia) {
            return round($valorMensal, 2);
        }

        $valorAula = (float) ($config['valor_aula_avulsa'] ?? 0);
        if ($valorAula <= 0) {
            $valorAula = $valorMensal > 0 ? $valorMensal / 4 : 0;
        }

        [$ano, $mes] = array_map('intval', explode('-', $mesReferencia));
        $inicioMes = sprintf('%04d-%02d-01', $ano, $mes);
        $ultimoDiaMes = (int) (new \DateTime(sprintf('%04d-%02d-01', $ano, $mes)))->format('t');
        $fimMes = sprintf('%04d-%02d-%02d', $ano, $mes, $ultimoDiaMes);
        $inicioCobranca = max($inicioMes, substr($dataInicioContrato, 0, 10));

        $aulas = MensalidadeRepository::contarAulasConfirmadas($alunoId, $inicioCobranca, $fimMes);
        if ($aulas === 0) {
            $aulas = self::contarAulasProgramadas($alunoId, $inicioCobranca, $fimMes);
        }

        $valor = $aulas * $valorAula;
        return round(min($valorMensal, $valor), 2);
    }

    private static function recalcularMensalidadesPendentes(): void
    {
        foreach (MensalidadeRepository::pendentes() as $mensalidade) {
            $valor = self::calcularValorDaCompetencia(
                (int) $mensalidade['aluno_id'],
                (float) ($mensalidade['valor_mensalidade'] ?? 0),
                $mensalidade['mes_referencia'],
                $mensalidade['data_inicio_contrato'] ?? null
            );

            MensalidadeRepository::atualizarValor((int) $mensalidade['idmensalidade'], $valor);
        }
    }

    private static function contarAulasProgramadas(int $alunoId, string $dataInicio, string $dataFim): int
    {
        $turmas = AlunoRepository::listarTurmas($alunoId);
        $diasComAula = [];

        foreach ($turmas as $turma) {
            $diasIso = self::diasParaIso($turma['dias_semana'] ?? '');
            if (empty($diasIso)) {
                continue;
            }

            $cursor = new \DateTime($dataInicio);
            $fim = new \DateTime($dataFim);
            while ($cursor <= $fim) {
                if (in_array((int) $cursor->format('N'), $diasIso, true)) {
                    $diasComAula[$cursor->format('Y-m-d')] = true;
                }
                $cursor->modify('+1 day');
            }
        }

        return count($diasComAula);
    }

    private static function calcularValorMensalAtual(int $alunoId, float $valorMensalSalvo, array $config): float
    {
        $valorPadrao = (float) ($config['valor_mensalidade'] ?? 0);
        $turmas = AlunoRepository::listarTurmas($alunoId);

        if (empty($turmas)) {
            return $valorMensalSalvo > 0 ? $valorMensalSalvo : $valorPadrao;
        }

        $total = 0;
        foreach ($turmas as $turma) {
            $valorTurma = (float) ($turma['valor_mensalidade'] ?? 0);
            $total += $valorTurma > 0 ? $valorTurma : $valorPadrao;
        }

        return round($total, 2);
    }

    private static function diasParaIso(string $diasSemana): array
    {
        $resultado = [];
        foreach (explode(',', $diasSemana) as $dia) {
            $dia = mb_strtolower(trim($dia));
            $dia = str_replace(['á', 'à', 'ã', 'â', 'Ã¡'], ['a', 'a', 'a', 'a', 'a'], $dia);

            $iso = null;
            if (str_starts_with($dia, 'seg')) {
                $iso = 1;
            } elseif (str_starts_with($dia, 'ter')) {
                $iso = 2;
            } elseif (str_starts_with($dia, 'qua')) {
                $iso = 3;
            } elseif (str_starts_with($dia, 'qui')) {
                $iso = 4;
            } elseif (str_starts_with($dia, 'sex')) {
                $iso = 5;
            } elseif (str_starts_with($dia, 'sab') || str_contains($dia, 'b')) {
                $iso = 6;
            } elseif (str_starts_with($dia, 'dom')) {
                $iso = 7;
            }

            if ($iso !== null) {
                $resultado[] = $iso;
            }
        }

        return array_values(array_unique($resultado));
    }
}
