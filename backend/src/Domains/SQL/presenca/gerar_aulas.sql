WITH params AS (
    SELECT
        :turma_id::integer              AS turma_id,
        :data_inicio::date              AS data_inicio,
        :data_fim::date                 AS data_fim,
        string_to_array(:dias_iso, ',') AS dias
)
INSERT INTO presenca (turma_id, aluno_id, data_treino, situacao)
SELECT p.turma_id, a.idaluno, gs.dt::date, 0
FROM params p
JOIN aluno_turma atu ON atu.turma_id = p.turma_id
JOIN aluno a ON a.idaluno = atu.aluno_id AND a.situacao = 1
CROSS JOIN generate_series(p.data_inicio::timestamp, p.data_fim::timestamp, '1 day'::interval) AS gs(dt)
WHERE EXTRACT(ISODOW FROM gs.dt)::text = ANY(p.dias)
  AND gs.dt::date >= COALESCE(a.data_inicio_contrato, a.data_inicio, a.criado_em::date)
ON CONFLICT (aluno_id, turma_id, data_treino) DO NOTHING
