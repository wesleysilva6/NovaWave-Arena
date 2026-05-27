<?php

namespace App\Domains\Services;

use App\Domains\Repositories\AlunoRepository;
use App\Domains\Repositories\TurmaRepository;

class AlunoService
{
    public static function listar(): array
    {
        return AlunoRepository::listar();
    }

    public static function buscar(int $idaluno): ?object
    {
        return AlunoRepository::buscar($idaluno);
    }

    public static function cadastrar(array $dados): array
    {
        $turmasIds = self::normalizarTurmasIds($dados['turmas_ids'] ?? []);
        $turmas = TurmaRepository::buscarPorIds($turmasIds);
        $valorMensalidade = self::calcularValorMensalidadePorTurmas($turmas);
        $modalidadeId = self::resolverModalidadeId($dados, $turmas);

        $result = AlunoRepository::cadastrar([
            'nome' => $dados['nome'],
            'telefone' => $dados['telefone'],
            'cpf' => $dados['cpf'] ?? null,
            'data_nascimento' => $dados['data_nascimento'] ?? null,
            'modalidade_id' => $modalidadeId,
            'data_inicio' => $dados['data_inicio'] ?? null,
            'dia_vencimento' => (int) $dados['dia_vencimento'],
            'notificacao_whatsapp' => (int) ($dados['notificacao_whatsapp'] ?? 1),
            'situacao' => (int) ($dados['situacao'] ?? 1),
            'observacao' => $dados['observacao'] ?? null,
            'valor_mensalidade' => $valorMensalidade,
            'plano' => $dados['plano'] ?? 'mensal',
            'data_inicio_contrato' => $dados['data_inicio_contrato'] ?? null,
            'data_vencimento_contrato' => $dados['data_vencimento_contrato'] ?? null,
        ]);

        if (!empty($result) && isset($result[0]['idaluno'])) {
            $alunoId = (int) $result[0]['idaluno'];
            self::sincronizarTurmas($alunoId, $turmasIds);
            self::gerarMensalidades(
                $alunoId,
                $dados['plano'] ?? 'mensal',
                $valorMensalidade,
                (int) $dados['dia_vencimento'],
                $dados['data_inicio_contrato'] ?? $dados['data_inicio'] ?? date('Y-m-d')
            );
        }

        return $result;
    }

    public static function editar(int $idaluno, array $dados): array
    {
        $turmasIds = self::normalizarTurmasIds($dados['turmas_ids'] ?? []);
        $turmas = TurmaRepository::buscarPorIds($turmasIds);
        $valorMensalidade = self::calcularValorMensalidadePorTurmas($turmas);
        $modalidadeId = self::resolverModalidadeId($dados, $turmas);

        $result = AlunoRepository::editar([
            'idaluno' => $idaluno,
            'nome' => $dados['nome'],
            'telefone' => $dados['telefone'],
            'cpf' => $dados['cpf'] ?? null,
            'data_nascimento' => $dados['data_nascimento'] ?? null,
            'modalidade_id' => $modalidadeId,
            'data_inicio' => $dados['data_inicio'] ?? null,
            'dia_vencimento' => (int) $dados['dia_vencimento'],
            'notificacao_whatsapp' => (int) ($dados['notificacao_whatsapp'] ?? 1),
            'situacao' => (int) ($dados['situacao'] ?? 1),
            'observacao' => $dados['observacao'] ?? null,
            'valor_mensalidade' => $valorMensalidade,
            'plano' => $dados['plano'] ?? 'mensal',
            'data_inicio_contrato' => $dados['data_inicio_contrato'] ?? null,
            'data_vencimento_contrato' => $dados['data_vencimento_contrato'] ?? null,
        ]);

        self::sincronizarTurmas($idaluno, $turmasIds);
        AlunoRepository::limparMensalidadesPendentes($idaluno);
        self::gerarMensalidades(
            $idaluno,
            $dados['plano'] ?? 'mensal',
            $valorMensalidade,
            (int) $dados['dia_vencimento'],
            $dados['data_inicio_contrato'] ?? $dados['data_inicio'] ?? date('Y-m-d')
        );

        return $result;
    }

    public static function deletar(int $idaluno): array
    {
        return AlunoRepository::deletar($idaluno);
    }

    public static function listarModalidades(): array
    {
        return AlunoRepository::listarModalidades();
    }

    public static function cancelar(int $idaluno): array
    {
        AlunoRepository::cancelarMensalidades($idaluno);
        return AlunoRepository::cancelar($idaluno);
    }

    private static function gerarMensalidades(int $alunoId, string $plano, float $valor, int $diaVencimento, ?string $dataInicioContrato): void
    {
        $mesesPorPlano = [
            'mensal' => 1,
            'trimestral' => 3,
            'semestral' => 6,
            'anual' => 12,
        ];

        $totalMeses = $mesesPorPlano[$plano] ?? 1;

        $inicio = $dataInicioContrato ? new \DateTime($dataInicioContrato) : new \DateTime();

        $geradas = 0;
        $offset = 0;
        $limiteBusca = $totalMeses + 12;

        while ($geradas < $totalMeses && $offset < $limiteBusca) {
            $mesReferencia = clone $inicio;
            $mesReferencia->modify("+{$offset} months");

            $ano = (int) $mesReferencia->format('Y');
            $mes = (int) $mesReferencia->format('m');

            $ultimoDiaMes = (int) (new \DateTime("{$ano}-{$mes}-01"))->format('t');
            $dia = min($diaVencimento, $ultimoDiaMes);

            $dataVencimento = sprintf('%04d-%02d-%02d', $ano, $mes, $dia);
            $mesRef = sprintf('%04d-%02d', $ano, $mes);
            $valorCompetencia = MensalidadeService::calcularValorDaCompetencia(
                $alunoId,
                $valor,
                $mesRef,
                $dataInicioContrato
            );

            if ($valorCompetencia <= 0) {
                $offset++;
                continue;
            }

            AlunoRepository::gerarMensalidade([
                'aluno_id' => $alunoId,
                'valor' => $valorCompetencia,
                'mes_referencia' => $mesRef,
                'data_vencimento' => $dataVencimento,
            ]);

            $geradas++;
            $offset++;
        }
    }

    private static function calcularValorMensalidadePorTurmas(array $turmas): float
    {
        $config = ConfiguracaoService::buscar();
        $valorPadrao = (float) ($config['valor_mensalidade'] ?? 0);

        if (empty($turmas)) {
            return $valorPadrao;
        }

        $total = 0;
        foreach ($turmas as $turma) {
            $valorTurma = (float) ($turma['valor_mensalidade'] ?? 0);
            $total += $valorTurma > 0 ? $valorTurma : $valorPadrao;
        }

        return round($total, 2);
    }

    private static function normalizarTurmasIds(mixed $turmasIds): array
    {
        if (!is_array($turmasIds)) {
            return [];
        }

        return array_values(array_filter(array_unique(array_map('intval', $turmasIds))));
    }

    private static function resolverModalidadeId(array $dados, array $turmas): int
    {
        if (!empty($turmas)) {
            return (int) $turmas[0]['modalidade_id'];
        }

        $modalidadeId = (int) ($dados['modalidade_id'] ?? 0);
        if ($modalidadeId <= 0) {
            throw new \InvalidArgumentException('Selecione pelo menos uma turma para o aluno.');
        }

        return $modalidadeId;
    }

    private static function sincronizarTurmas(int $alunoId, array $turmasIds): void
    {
        TurmaRepository::removerAlunoDeTodas($alunoId);
        foreach ($turmasIds as $turmaId) {
            TurmaRepository::adicionarAluno($turmaId, $alunoId);
        }
    }

    public static function listarTurmas(int $idaluno): array
    {
        return AlunoRepository::listarTurmas($idaluno);
    }
}
