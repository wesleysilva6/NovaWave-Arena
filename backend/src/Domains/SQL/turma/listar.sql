SELECT
    t.idturma,
    t.nome,
    t.modalidade_id,
    t.dias_semana,
    t.horario,
    t.professor_id,
    COALESCE(f.nome, t.professor) AS professor,
    t.limite_alunos,
    t.valor_mensalidade,
    t.situacao,
    t.criado_em,
    m.nome AS modalidade_nome,
    (SELECT COUNT(*) FROM aluno_turma at2 WHERE at2.turma_id = t.idturma) AS alunos_count
FROM turma t
LEFT JOIN modalidade m ON m.idmodalidade = t.modalidade_id
LEFT JOIN funcionario f ON f.idfuncionario = t.professor_id
ORDER BY t.nome ASC
