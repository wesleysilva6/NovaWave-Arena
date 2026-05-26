<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class TurmaRepository
{
    public static function listar(): array
    {
        $res = Database::switchParams([], 'turma/listar', true);
        return $res['retorno'] ?? [];
    }

    public static function cadastrar(array $dados): array
    {
        $res = Database::switchParams($dados, 'turma/cadastrar', true);
        return $res['retorno'] ?? [];
    }

    public static function editar(array $dados): array
    {
        $res = Database::switchParams($dados, 'turma/editar', true);
        return $res['retorno'] ?? [];
    }

    public static function toggleStatus(int $idturma, int $situacao): array
    {
        $params = ['idturma' => $idturma, 'situacao' => $situacao];
        $res = Database::switchParams($params, 'turma/toggle_status', true);
        return $res['retorno'] ?? [];
    }

    public static function listarAlunos(int $turma_id): array
    {
        $params = ['turma_id' => $turma_id];
        $res = Database::switchParams($params, 'turma/listar_alunos', true);
        return $res['retorno'] ?? [];
    }

    public static function listarAlunosDisponiveis(int $turma_id): array
    {
        $params = ['turma_id' => $turma_id];
        $res = Database::switchParams($params, 'turma/listar_alunos_disponiveis', true);
        return $res['retorno'] ?? [];
    }

    public static function adicionarAluno(int $turma_id, int $aluno_id): void
    {
        $params = ['turma_id' => $turma_id, 'aluno_id' => $aluno_id];
        Database::switchParams($params, 'turma/adicionar_aluno', true);
    }

    public static function removerAluno(int $turma_id, int $aluno_id): void
    {
        $params = ['turma_id' => $turma_id, 'aluno_id' => $aluno_id];
        Database::switchParams($params, 'turma/remover_aluno', true);
    }

    public static function removerAlunoDeTodas(int $aluno_id): void
    {
        Database::switchParams(['aluno_id' => $aluno_id], 'turma/remover_aluno_todas', true);
    }

    public static function buscarPorIds(array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        if (empty($ids)) {
            return [];
        }

        $res = Database::switchParams(['ids' => implode(',', $ids)], 'turma/buscar_por_ids', true);
        return $res['retorno'] ?? [];
    }
}
