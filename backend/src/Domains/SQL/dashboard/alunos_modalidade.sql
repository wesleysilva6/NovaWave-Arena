SELECT
    COALESCE(m.nome, 'Sem modalidade') AS modalidade,
    COUNT(a.idaluno) AS total
FROM aluno a
LEFT JOIN modalidade m ON m.idmodalidade = a.modalidade_id
WHERE a.situacao = 1
GROUP BY COALESCE(m.nome, 'Sem modalidade')
ORDER BY total DESC, modalidade ASC
