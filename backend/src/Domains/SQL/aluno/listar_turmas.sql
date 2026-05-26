SELECT
    t.idturma,
    t.nome,
    t.horario,
    t.dias_semana,
    COALESCE(f.nome, t.professor) AS professor,
    t.valor_mensalidade,
    m.nome AS modalidade_nome
FROM turma t
INNER JOIN modalidade m ON t.modalidade_id = m.idmodalidade
INNER JOIN aluno_turma atu ON atu.turma_id = t.idturma
LEFT JOIN funcionario f ON f.idfuncionario = t.professor_id
WHERE atu.aluno_id = :idaluno
ORDER BY m.nome, t.nome
