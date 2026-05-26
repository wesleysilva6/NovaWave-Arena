<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class DashboardRepository
{
    public static function buscarStats(): array
    {
        $res = Database::switchParams([], 'dashboard/stats', true, false, '', 1);
        return $res['error'] ? [] : (array) $res['retorno'];
    }

    public static function buscarVencimentos(): array
    {
        $res = Database::switchParams([], 'dashboard/vencimentos', true);
        return $res['retorno'] ?: [];
    }

    public static function buscarTreinosHoje(): array
    {
        $res = Database::switchParams([], 'dashboard/treinos_hoje', true);
        return $res['retorno'] ?: [];
    }

    public static function buscarAgendaSemana(): array
    {
        $res = Database::switchParams([], 'dashboard/agenda_semana', true);
        return $res['retorno'] ?: [];
    }

    public static function buscarFinanceiro6Meses(): array
    {
        $res = Database::switchParams([], 'dashboard/financeiro_6_meses', true);
        return $res['retorno'] ?: [];
    }

    public static function buscarAlunosModalidade(): array
    {
        $res = Database::switchParams([], 'dashboard/alunos_modalidade', true);
        return $res['retorno'] ?: [];
    }

    public static function buscarAulasPorDia(): array
    {
        $res = Database::switchParams([], 'dashboard/aulas_por_dia', true);
        return $res['retorno'] ?: [];
    }
}
