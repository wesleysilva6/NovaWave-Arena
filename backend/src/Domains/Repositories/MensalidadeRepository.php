<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;
use RuntimeException;

class MensalidadeRepository
{
    private static function getArrayResult(array $res): array
    {
        if (!empty($res['error'])) {
            throw new RuntimeException($res['error']);
        }

        return is_array($res['retorno'] ?? null) ? $res['retorno'] : [];
    }

    public static function listar(): array
    {
        Database::switchParams([], 'mensalidade/atualizar_vencidas', true);
        $res = Database::switchParams([], 'mensalidade/listar', true);
        return self::getArrayResult($res);
    }

    public static function confirmarPagamento(int $idmensalidade): array
    {
        $params = ['idmensalidade' => $idmensalidade];
        $res = Database::switchParams($params, 'mensalidade/confirmar_pagamento', true);
        return self::getArrayResult($res);
    }

    public static function alunosSemMensalidade(string $mesReferencia): array
    {
        $params = ['mes_referencia' => $mesReferencia];
        $res = Database::switchParams($params, 'mensalidade/alunos_sem_mensalidade', true);
        return self::getArrayResult($res);
    }

    public static function gerarMensalidade(array $dados): array
    {
        $res = Database::switchParams($dados, 'aluno/gerar_mensalidade', true);
        return self::getArrayResult($res);
    }

    public static function pendentes(): array
    {
        $res = Database::switchParams([], 'mensalidade/pendentes', true);
        return self::getArrayResult($res);
    }

    public static function atualizarValor(int $idmensalidade, float $valor): array
    {
        $res = Database::switchParams([
            'idmensalidade' => $idmensalidade,
            'valor' => $valor,
        ], 'mensalidade/atualizar_valor', true);
        return self::getArrayResult($res);
    }

    public static function contarAulasConfirmadas(int $alunoId, string $dataInicio, string $dataFim): int
    {
        $res = Database::switchParams([
            'aluno_id' => $alunoId,
            'data_inicio' => $dataInicio,
            'data_fim' => $dataFim,
        ], 'mensalidade/aulas_confirmadas_aluno_mes', true);
        $rows = self::getArrayResult($res);
        return (int) ($rows[0]['total'] ?? 0);
    }
}
