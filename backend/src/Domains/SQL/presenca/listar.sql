SELECT
    p.idpresenca,
    p.turma_id,
    p.aluno_id,
    p.data_treino,
    p.situacao,
    p.criado_em,
    a.nome AS aluno_nome
FROM presenca p
JOIN aluno a ON a.idaluno = p.aluno_id
WHERE p.turma_id = :turma_id
  AND p.data_treino BETWEEN :data_inicio AND :data_fim
  AND p.data_treino >= COALESCE(a.data_inicio_contrato, a.data_inicio, a.criado_em::date)
ORDER BY p.data_treino DESC, a.nome ASC
