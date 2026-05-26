SELECT
    mn.situacao,
    COUNT(*) AS quantidade,
    SUM(valor) AS total
FROM mensalidade mn
JOIN aluno a ON a.idaluno = mn.aluno_id
WHERE mn.data_vencimento BETWEEN :data_inicio AND :data_fim
  AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
  AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
GROUP BY mn.situacao
ORDER BY mn.situacao ASC
