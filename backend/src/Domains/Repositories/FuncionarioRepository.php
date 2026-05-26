<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;
use RuntimeException;

class FuncionarioRepository
{
    private static function rows(array $res): array
    {
        if (!empty($res['error'])) {
            throw new RuntimeException($res['error']);
        }

        return $res['retorno'] ?: [];
    }

    public static function listar(): array
    {
        return self::rows(Database::switchParams([], 'funcionario/listar', true));
    }

    public static function cadastrar(array $dados): array
    {
        return self::rows(Database::switchParams($dados, 'funcionario/cadastrar', true));
    }

    public static function editar(array $dados): array
    {
        return self::rows(Database::switchParams($dados, 'funcionario/editar', true));
    }

    public static function deletar(int $idfuncionario): void
    {
        self::rows(Database::switchParams(['idfuncionario' => $idfuncionario], 'funcionario/remover_gastos', true));
        self::rows(Database::switchParams(['idfuncionario' => $idfuncionario], 'funcionario/deletar', true));
    }

    public static function sincronizarGastosMesAtual(): void
    {
        self::rows(Database::switchParams([], 'funcionario/sincronizar_gastos_inserir', true));
        self::rows(Database::switchParams([], 'funcionario/sincronizar_gastos_atualizar', true));
        self::rows(Database::switchParams([], 'funcionario/sincronizar_gastos_remover_inativos', true));
    }
}
