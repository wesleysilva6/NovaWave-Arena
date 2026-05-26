SELECT
    COALESCE(m.nome, 'Sem modalidade') AS modalidade,
    COUNT(*) FILTER (WHERE p.situacao = 1) AS presencas,
    COUNT(*) AS aulas_geradas
FROM presenca p
JOIN aluno a ON a.idaluno = p.aluno_id
LEFT JOIN modalidade m ON m.idmodalidade = a.modalidade_id
WHERE p.data_treino BETWEEN :data_inicio AND :data_fim
  AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
  AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
GROUP BY COALESCE(m.nome, 'Sem modalidade')
ORDER BY presencas DESC
