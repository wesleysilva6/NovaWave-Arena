SELECT
    p.idpresenca,
    p.data_treino,
    p.situacao,
    p.criado_em,
    t.idturma,
    t.nome AS turma_nome,
    t.dias_semana,
    t.horario,
    m.nome AS modalidade_nome
FROM presenca p
JOIN turma t ON t.idturma = p.turma_id
JOIN aluno a ON a.idaluno = p.aluno_id
LEFT JOIN modalidade m ON m.idmodalidade = t.modalidade_id
WHERE p.aluno_id = :aluno_id
  AND p.data_treino >= COALESCE(a.data_inicio_contrato, a.data_inicio, a.criado_em::date)
ORDER BY p.data_treino DESC
