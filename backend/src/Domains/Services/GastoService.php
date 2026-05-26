<?php

namespace App\Domains\Services;

use App\Domains\Repositories\GastoRepository;
use App\Domains\Repositories\FuncionarioRepository;
use Exception;

class GastoService
{
    public static function listar(): array
    {
        FuncionarioRepository::sincronizarGastosMesAtual();
        return GastoRepository::listar();
    }

    public static function cadastrar(array $body): array
    {
        $dados = [
            'descricao'  => trim($body['descricao'] ?? ''),
            'valor'      => (float) ($body['valor'] ?? 0),
            'categoria'  => trim($body['categoria'] ?? ''),
            'data'       => $body['data'] ?? date('Y-m-d'),
            'observacao' => trim($body['observacao'] ?? '') ?: null,
        ];

        if (empty($dados['descricao'])) {
            throw new Exception('Descrição é obrigatória');
        }
        if ($dados['valor'] <= 0) {
            throw new Exception('Valor deve ser maior que zero');
        }
        if (empty($dados['categoria'])) {
            throw new Exception('Categoria é obrigatória');
        }

        return GastoRepository::cadastrar($dados);
    }

    public static function editar(int $id, array $body): array
    {
        $dados = [
            'idgasto'    => $id,
            'descricao'  => trim($body['descricao'] ?? ''),
            'valor'      => (float) ($body['valor'] ?? 0),
            'categoria'  => trim($body['categoria'] ?? ''),
            'data'       => $body['data'] ?? date('Y-m-d'),
            'observacao' => trim($body['observacao'] ?? '') ?: null,
        ];

        if (empty($dados['descricao'])) {
            throw new Exception('Descrição é obrigatória');
        }
        if ($dados['valor'] <= 0) {
            throw new Exception('Valor deve ser maior que zero');
        }
        if (empty($dados['categoria'])) {
            throw new Exception('Categoria é obrigatória');
        }

        return GastoRepository::editar($dados);
    }

    public static function deletar(int $id): void
    {
        $ok = GastoRepository::deletar($id);
        if (!$ok) {
            throw new Exception('Erro ao excluir gasto');
        }
    }

    public static function resumoMes(string $mesReferencia): array
    {
        FuncionarioRepository::sincronizarGastosMesAtual();
        return GastoRepository::resumoMes($mesReferencia);
    }
}
