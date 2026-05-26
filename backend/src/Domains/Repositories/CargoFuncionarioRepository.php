<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;
use RuntimeException;

class CargoFuncionarioRepository
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
        return self::rows(Database::switchParams([], 'cargo_funcionario/listar', true));
    }

    public static function cadastrar(array $dados): array
    {
        return self::rows(Database::switchParams($dados, 'cargo_funcionario/cadastrar', true));
    }

    public static function editar(array $dados): array
    {
        return self::rows(Database::switchParams($dados, 'cargo_funcionario/editar', true));
    }

    public static function deletar(int $idcargo): void
    {
        self::rows(Database::switchParams(['idcargo' => $idcargo], 'cargo_funcionario/deletar', true));
    }
}
