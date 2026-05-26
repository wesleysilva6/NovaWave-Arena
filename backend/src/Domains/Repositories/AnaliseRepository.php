<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;
use RuntimeException;

class AnaliseRepository
{
    private static function pick(array $params, array $keys): array
    {
        return array_intersect_key($params, array_flip($keys));
    }

    private static function rows(array $res): array
    {
        if (!empty($res['error'])) {
            throw new RuntimeException($res['error']);
        }

        return $res['retorno'] ?: [];
    }

    private static function first(array $res): array
    {
        $rows = self::rows($res);
        return $rows[0] ?? [];
    }

    public static function resumo(array $params): array
    {
        return self::first(Database::switchParams($params, 'analise/resumo', true));
    }

    public static function financeiroMensal(array $params): array
    {
        return self::rows(Database::switchParams($params, 'analise/financeiro_mensal', true));
    }

    public static function gastosCategoria(array $params): array
    {
        return self::rows(Database::switchParams(self::pick($params, ['data_inicio', 'data_fim']), 'analise/gastos_categoria', true));
    }

    public static function mensalidadesStatus(array $params): array
    {
        return self::rows(Database::switchParams($params, 'analise/mensalidades_status', true));
    }

    public static function alunosModalidade(array $params): array
    {
        return self::rows(Database::switchParams(self::pick($params, ['modalidade_id', 'aluno_situacao']), 'analise/alunos_modalidade', true));
    }

    public static function presencasModalidade(array $params): array
    {
        return self::rows(Database::switchParams($params, 'analise/presencas_modalidade', true));
    }

    public static function aulasDiaSemana(array $params): array
    {
        return self::rows(Database::switchParams($params, 'analise/aulas_dia_semana', true));
    }

    public static function turmasOcupacao(array $params): array
    {
        return self::rows(Database::switchParams(self::pick($params, ['modalidade_id']), 'analise/turmas_ocupacao', true));
    }
}
