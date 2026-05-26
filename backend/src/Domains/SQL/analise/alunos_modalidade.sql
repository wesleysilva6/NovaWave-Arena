SELECT
    COALESCE(m.nome, 'Sem modalidade') AS modalidade,
    COUNT(a.idaluno) AS total
FROM aluno a
LEFT JOIN modalidade m ON m.idmodalidade = a.modalidade_id
WHERE (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
  AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
GROUP BY COALESCE(m.nome, 'Sem modalidade')
ORDER BY total DESC
