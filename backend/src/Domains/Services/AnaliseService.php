<?php

namespace App\Domains\Services;

use App\Domains\Repositories\AnaliseRepository;
use App\Domains\Repositories\FuncionarioRepository;

class AnaliseService
{
    public static function obter(array $query): array
    {
        FuncionarioRepository::sincronizarGastosMesAtual();

        $params = self::normalizarFiltros($query);
        $resumo = AnaliseRepository::resumo($params);

        $receita = (float) ($resumo['receita'] ?? 0);
        $gastos = (float) ($resumo['gastos'] ?? 0);
        $aulasGeradas = (int) ($resumo['aulas_geradas'] ?? 0);
        $presencas = (int) ($resumo['presencas_confirmadas'] ?? 0);

        return [
            'filtros' => $params,
            'resumo' => [
                'receita' => $receita,
                'gastos' => $gastos,
                'resultado' => $receita - $gastos,
                'em_aberto' => (float) ($resumo['em_aberto'] ?? 0),
                'alunos' => (int) ($resumo['alunos'] ?? 0),
                'novos_alunos' => (int) ($resumo['novos_alunos'] ?? 0),
                'presencas_confirmadas' => $presencas,
                'aulas_geradas' => $aulasGeradas,
                'taxa_presenca' => $aulasGeradas > 0 ? round(($presencas / $aulasGeradas) * 100, 2) : 0,
            ],
            'financeiro_mensal' => array_map(fn($item) => [
                'mes_referencia' => $item['mes_referencia'],
                'label' => $item['label'],
                'receita' => (float) ($item['receita'] ?? 0),
                'gastos' => (float) ($item['gastos'] ?? 0),
                'em_aberto' => (float) ($item['em_aberto'] ?? 0),
            ], AnaliseRepository::financeiroMensal($params)),
            'gastos_categoria' => array_map(fn($item) => [
                'categoria' => $item['categoria'],
                'quantidade' => (int) ($item['quantidade'] ?? 0),
                'total' => (float) ($item['total'] ?? 0),
            ], AnaliseRepository::gastosCategoria($params)),
            'mensalidades_status' => array_map(fn($item) => [
                'situacao' => (int) ($item['situacao'] ?? 0),
                'quantidade' => (int) ($item['quantidade'] ?? 0),
                'total' => (float) ($item['total'] ?? 0),
            ], AnaliseRepository::mensalidadesStatus($params)),
            'alunos_modalidade' => array_map(fn($item) => [
                'modalidade' => $item['modalidade'],
                'total' => (int) ($item['total'] ?? 0),
            ], AnaliseRepository::alunosModalidade($params)),
            'presencas_modalidade' => array_map(fn($item) => [
                'modalidade' => $item['modalidade'],
                'presencas' => (int) ($item['presencas'] ?? 0),
                'aulas_geradas' => (int) ($item['aulas_geradas'] ?? 0),
            ], AnaliseRepository::presencasModalidade($params)),
            'aulas_dia_semana' => array_map(fn($item) => [
                'dia_iso' => (int) ($item['dia_iso'] ?? 0),
                'dia_semana' => $item['dia_semana'],
                'aulas_geradas' => (int) ($item['aulas_geradas'] ?? 0),
                'presencas' => (int) ($item['presencas'] ?? 0),
            ], AnaliseRepository::aulasDiaSemana($params)),
            'turmas_ocupacao' => array_map(fn($item) => [
                'turma' => $item['turma'],
                'modalidade' => $item['modalidade'],
                'limite_alunos' => $item['limite_alunos'] !== null ? (int) $item['limite_alunos'] : null,
                'alunos' => (int) ($item['alunos'] ?? 0),
                'ocupacao' => $item['ocupacao'] !== null ? (float) $item['ocupacao'] : null,
            ], AnaliseRepository::turmasOcupacao($params)),
        ];
    }

    private static function normalizarFiltros(array $query): array
    {
        $fim = $query['data_fim'] ?? date('Y-m-d');
        $inicio = $query['data_inicio'] ?? date('Y-m-d', strtotime('-5 months'));

        return [
            'data_inicio' => preg_match('/^\d{4}-\d{2}-\d{2}$/', $inicio) ? $inicio : date('Y-m-d', strtotime('-5 months')),
            'data_fim' => preg_match('/^\d{4}-\d{2}-\d{2}$/', $fim) ? $fim : date('Y-m-d'),
            'modalidade_id' => (int) ($query['modalidade_id'] ?? 0),
            'aluno_situacao' => (int) ($query['aluno_situacao'] ?? -1),
        ];
    }
}
