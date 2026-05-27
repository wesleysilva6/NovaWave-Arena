<?php

namespace App\Domains\Services;

use App\Domains\Repositories\PresencaRepository;
use App\Infrastructures\Config\Database;

class PresencaService
{
    /**
     * Retorna todas as turmas ativas com suas presenças geradas automaticamente
     * para a janela de [hoje - 14 dias] até [hoje + 7 dias].
     * Presenças faltantes para dias de aula × alunos matriculados são criadas
     * automaticamente (ON CONFLICT DO NOTHING).
     */
    public static function listarTurmasComPresencas(): array
    {
        $hoje    = new \DateTime('now', new \DateTimeZone('America/Sao_Paulo'));
        $hojeStr = $hoje->format('Y-m-d');
        $inicio  = (clone $hoje)->modify('-30 days')->format('Y-m-d');
        $fim     = (clone $hoje)->modify('+7 days')->format('Y-m-d');

        // Busca turmas ativas reutilizando o SQL existente
        $turmas = Database::switchParams([], 'turma/listar', true)['retorno'] ?? [];

        $resultado = [];

        foreach ($turmas as $turma) {
            if ((int)($turma['situacao'] ?? 0) !== 1) {
                continue;
            }

            $turmaId = (int)$turma['idturma'];
            $diasISO = self::diasParaISO($turma['dias_semana'] ?? '');

            if ($diasISO === '') {
                $resultado[] = array_merge($turma, ['presencas' => []]);
                continue;
            }

            // Gera registros para (aluno × data de aula) que ainda não existem
            PresencaRepository::gerarAulas([
                'turma_id'    => $turmaId,
                'data_inicio' => $inicio,
                'data_fim'    => $fim,
                'dias_iso'    => $diasISO,
            ]);

            // Busca todas as presenças da janela
            $presencas = PresencaRepository::listar($turmaId, $inicio, $fim);
            $presencas = array_values(array_filter($presencas, function ($presenca) use ($hojeStr) {
                $dataTreino = (string)($presenca['data_treino'] ?? '');
                $situacao = (int)($presenca['situacao'] ?? 0);

                return $dataTreino >= $hojeStr || $situacao === 0;
            }));

            $resultado[] = array_merge($turma, ['presencas' => $presencas]);
        }

        return $resultado;
    }

    public static function marcar(int $idpresenca, int $situacao): array
    {
        if (!in_array($situacao, [0, 1, 2], true)) {
            throw new \InvalidArgumentException('Situacao de presenca invalida.');
        }

        return PresencaRepository::marcar($idpresenca, $situacao);
    }

    public static function listarPorAluno(int $alunoId): array
    {
        return PresencaRepository::listarPorAluno($alunoId);
    }

    /**
     * Converte "Segunda, Quarta, Sexta" → "1,3,5" (ISO weekday: 1=Seg … 7=Dom)
     */
    private static function diasParaISO(string $diasSemana): string
    {
        $map = [
            // Abreviações (formato do sistema)
            'seg' => '1',
            'ter' => '2',
            'qua' => '3',
            'qui' => '4',
            'sex' => '5',
            'sáb' => '6',
            'sab' => '6',
            'dom' => '7',
            // Nomes completos (fallback)
            'segunda'  => '1',
            'terça'    => '2',
            'terca'    => '2',
            'quarta'   => '3',
            'quinta'   => '4',
            'sexta'    => '5',
            'sábado'   => '6',
            'sabado'   => '6',
            'domingo'  => '7',
        ];

        $dias = array_map('trim', explode(',', $diasSemana));
        $isos = array_filter(
            array_map(fn($d) => $map[mb_strtolower($d)] ?? null, $dias)
        );

        return implode(',', $isos);
    }
}
