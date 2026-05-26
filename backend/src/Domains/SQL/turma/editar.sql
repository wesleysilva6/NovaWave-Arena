UPDATE turma
SET
    nome          = :nome,
    modalidade_id = :modalidade_id,
    dias_semana   = :dias_semana,
    horario       = :horario,
    professor     = :professor,
    professor_id  = :professor_id,
    limite_alunos = :limite_alunos,
    valor_mensalidade = :valor_mensalidade,
    situacao      = :situacao
WHERE idturma = :idturma
RETURNING idturma
