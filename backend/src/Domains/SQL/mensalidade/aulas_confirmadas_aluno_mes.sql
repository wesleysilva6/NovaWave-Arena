SELECT COUNT(DISTINCT data_treino) AS total
FROM presenca
WHERE aluno_id = :aluno_id
  AND situacao = 1
  AND data_treino BETWEEN :data_inicio AND :data_fim
