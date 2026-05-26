<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;
use RuntimeException;

class ConfiguracaoRepository
{
    private static function getFirst(array $res): array
    {
        if (!empty($res['error'])) {
            throw new RuntimeException($res['error']);
        }

        $rows = $res['retorno'] ?? [];
        return is_array($rows) && isset($rows[0]) ? $rows[0] : [];
    }

    public static function buscar(): array
    {
        Database::switchParams([], 'configuracao/garantir', true);
        $res = Database::switchParams([], 'configuracao/buscar', true);
        return self::getFirst($res);
    }

    public static function salvar(array $dados): array
    {
        Database::switchParams([], 'configuracao/garantir', true);
        $res = Database::switchParams($dados, 'configuracao/salvar', true);
        return self::getFirst($res);
    }
}
