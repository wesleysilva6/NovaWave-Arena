SELECT
    t.nome AS turma,
    m.nome AS modalidade,
    t.limite_alunos,
    COUNT(at.aluno_id) AS alunos,
    CASE
      WHEN t.limite_alunos IS NULL OR t.limite_alunos = 0 THEN NULL
      ELSE ROUND((COUNT(at.aluno_id)::numeric / t.limite_alunos) * 100, 2)
    END AS ocupacao
FROM turma t
LEFT JOIN modalidade m ON m.idmodalidade = t.modalidade_id
LEFT JOIN aluno_turma at ON at.turma_id = t.idturma
WHERE t.situacao = 1
  AND (:modalidade_id = 0 OR t.modalidade_id = :modalidade_id)
GROUP BY t.idturma, t.nome, m.nome, t.limite_alunos
ORDER BY ocupacao DESC NULLS LAST, alunos DESC
LIMIT 10
