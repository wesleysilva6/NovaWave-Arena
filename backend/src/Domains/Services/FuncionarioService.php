<?php

namespace App\Domains\Services;

use App\Domains\Repositories\FuncionarioRepository;
use Exception;

class FuncionarioService
{
    public static function listar(): array
    {
        FuncionarioRepository::sincronizarGastosMesAtual();
        return FuncionarioRepository::listar();
    }

    public static function cadastrar(array $body): array
    {
        $dados = self::normalizar($body);
        $result = FuncionarioRepository::cadastrar($dados);
        FuncionarioRepository::sincronizarGastosMesAtual();
        return $result;
    }

    public static function editar(int $id, array $body): array
    {
        $dados = array_merge(['idfuncionario' => $id], self::normalizar($body));
        $result = FuncionarioRepository::editar($dados);
        FuncionarioRepository::sincronizarGastosMesAtual();
        return $result;
    }

    public static function deletar(int $id): void
    {
        FuncionarioRepository::deletar($id);
        FuncionarioRepository::sincronizarGastosMesAtual();
    }

    private static function normalizar(array $body): array
    {
        $dados = [
            'nome' => trim($body['nome'] ?? ''),
            'cargo' => trim($body['cargo'] ?? ''),
            'cargo_id' => isset($body['cargo_id']) && $body['cargo_id'] !== '' ? (int) $body['cargo_id'] : null,
            'telefone' => trim($body['telefone'] ?? '') ?: null,
            'email' => trim($body['email'] ?? '') ?: null,
            'salario' => max(0, (float) ($body['salario'] ?? 0)),
            'data_admissao' => $body['data_admissao'] ?? null,
            'situacao' => (int) ($body['situacao'] ?? 1),
            'observacao' => trim($body['observacao'] ?? '') ?: null,
        ];

        if ($dados['nome'] === '') {
            throw new Exception('Nome e obrigatorio');
        }
        if ($dados['cargo'] === '' && empty($dados['cargo_id'])) {
            throw new Exception('Cargo e obrigatorio');
        }

        return $dados;
    }
}
