<?php

namespace App\Domains\Services;

use App\Domains\Repositories\CargoFuncionarioRepository;
use Exception;

class CargoFuncionarioService
{
    public static function listar(): array
    {
        return CargoFuncionarioRepository::listar();
    }

    public static function cadastrar(array $body): array
    {
        return CargoFuncionarioRepository::cadastrar(self::normalizar($body));
    }

    public static function editar(int $id, array $body): array
    {
        return CargoFuncionarioRepository::editar(array_merge(['idcargo' => $id], self::normalizar($body)));
    }

    public static function deletar(int $id): void
    {
        CargoFuncionarioRepository::deletar($id);
    }

    private static function normalizar(array $body): array
    {
        $nome = trim($body['nome'] ?? '');
        if ($nome === '') {
            throw new Exception('Nome do cargo e obrigatorio');
        }

        return [
            'nome' => $nome,
            'situacao' => (int) ($body['situacao'] ?? 1),
        ];
    }
}
