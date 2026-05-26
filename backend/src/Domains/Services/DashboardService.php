<?php

namespace App\Domains\Services;

use App\Domains\Repositories\DashboardRepository;
use App\Domains\Repositories\FuncionarioRepository;

class DashboardService
{
    public static function obterDados(): array
    {
        FuncionarioRepository::sincronizarGastosMesAtual();
        $stats = DashboardRepository::buscarStats();
        $vencimentos = DashboardRepository::buscarVencimentos();
        $treinosHoje = DashboardRepository::buscarTreinosHoje();
        $agendaSemana = DashboardRepository::buscarAgendaSemana();
        $financeiro = DashboardRepository::buscarFinanceiro6Meses();
        $alunosModalidade = DashboardRepository::buscarAlunosModalidade();
        $aulasPorDia = DashboardRepository::buscarAulasPorDia();

        return [
            'stats' => [
                'total_alunos' => (int) ($stats['total_alunos'] ?? 0),
                'treinos_hoje' => (int) ($stats['treinos_hoje'] ?? 0),
                'receita_mes' => (float) ($stats['receita_mes'] ?? 0),
                'vencimentos_proximos' => (int) ($stats['vencimentos_proximos'] ?? 0),
                'modalidades_ativas' => (int) ($stats['modalidades_ativas'] ?? 0),
                'novos_alunos_mes' => (int) ($stats['novos_alunos_mes'] ?? 0),
                'gastos_mes' => (float) ($stats['gastos_mes'] ?? 0),
            ],
            'vencimentos' => $vencimentos,
            'treinos_hoje' => $treinosHoje,
            'agenda_semana' => $agendaSemana,
            'financeiro_6_meses' => array_map(fn($item) => [
                'mes_referencia' => $item['mes_referencia'],
                'label' => $item['label'],
                'receita' => (float) ($item['receita'] ?? 0),
                'gastos' => (float) ($item['gastos'] ?? 0),
            ], $financeiro),
            'alunos_modalidade' => array_map(fn($item) => [
                'modalidade' => $item['modalidade'],
                'total' => (int) ($item['total'] ?? 0),
            ], $alunosModalidade),
            'aulas_por_dia' => array_map(fn($item) => [
                'dia_iso' => (int) ($item['dia_iso'] ?? 0),
                'dia_semana' => $item['dia_semana'],
                'aulas' => (int) ($item['aulas'] ?? 0),
                'alunos_previstos' => (int) ($item['alunos_previstos'] ?? 0),
            ], $aulasPorDia),
        ];
    }
}
