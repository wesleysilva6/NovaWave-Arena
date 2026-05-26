<?php

namespace App\Domains\Services;

use App\Domains\Repositories\TurmaRepository;

class TurmaService
{
    public static function listar(): array
    {
        return TurmaRepository::listar();
    }

    public static function cadastrar(array $dados): array
    {
        return TurmaRepository::cadastrar([
            'nome'          => trim($dados['nome']),
            'modalidade_id' => (int) $dados['modalidade_id'],
            'dias_semana'   => trim($dados['dias_semana']),
            'horario'       => $dados['horario'],
            'professor'     => isset($dados['professor']) && $dados['professor'] !== '' ? trim($dados['professor']) : null,
            'professor_id'  => isset($dados['professor_id']) && $dados['professor_id'] !== '' ? (int) $dados['professor_id'] : null,
            'limite_alunos' => isset($dados['limite_alunos']) && $dados['limite_alunos'] !== '' ? (int) $dados['limite_alunos'] : null,
            'valor_mensalidade' => max(0, (float) ($dados['valor_mensalidade'] ?? 0)),
            'situacao'      => (int) ($dados['situacao'] ?? 1),
        ]);
    }

    public static function editar(int $idturma, array $dados): array
    {
        return TurmaRepository::editar([
            'idturma'       => $idturma,
            'nome'          => trim($dados['nome']),
            'modalidade_id' => (int) $dados['modalidade_id'],
            'dias_semana'   => trim($dados['dias_semana']),
            'horario'       => $dados['horario'],
            'professor'     => isset($dados['professor']) && $dados['professor'] !== '' ? trim($dados['professor']) : null,
            'professor_id'  => isset($dados['professor_id']) && $dados['professor_id'] !== '' ? (int) $dados['professor_id'] : null,
            'limite_alunos' => isset($dados['limite_alunos']) && $dados['limite_alunos'] !== '' ? (int) $dados['limite_alunos'] : null,
            'valor_mensalidade' => max(0, (float) ($dados['valor_mensalidade'] ?? 0)),
            'situacao'      => (int) ($dados['situacao'] ?? 1),
        ]);
    }

    public static function toggleStatus(int $idturma, int $situacao): array
    {
        return TurmaRepository::toggleStatus($idturma, $situacao);
    }

    public static function listarAlunos(int $turma_id): array
    {
        return TurmaRepository::listarAlunos($turma_id);
    }

    public static function listarAlunosDisponiveis(int $turma_id): array
    {
        return TurmaRepository::listarAlunosDisponiveis($turma_id);
    }

    public static function adicionarAluno(int $turma_id, int $aluno_id): void
    {
        TurmaRepository::adicionarAluno($turma_id, $aluno_id);
    }

    public static function removerAluno(int $turma_id, int $aluno_id): void
    {
        TurmaRepository::removerAluno($turma_id, $aluno_id);
    }
}
