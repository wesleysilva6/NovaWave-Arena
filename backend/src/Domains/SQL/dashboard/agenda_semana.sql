WITH dias AS (
    SELECT gs::date AS data
    FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '6 days', INTERVAL '1 day') gs
)
SELECT
    d.data::text AS data,
    EXTRACT(ISODOW FROM d.data)::int AS dia_iso,
    CASE EXTRACT(ISODOW FROM d.data)::int
      WHEN 1 THEN 'Seg'
      WHEN 2 THEN 'Ter'
      WHEN 3 THEN 'Qua'
      WHEN 4 THEN 'Qui'
      WHEN 5 THEN 'Sex'
      WHEN 6 THEN 'Sab'
      ELSE 'Dom'
    END AS dia_semana,
    t.nome AS turma,
    mo.nome AS modalidade,
    t.horario::text AS horario,
    (SELECT COUNT(*) FROM aluno_turma at2 WHERE at2.turma_id = t.idturma) AS alunos
FROM dias d
JOIN turma t ON t.situacao = 1
JOIN modalidade mo ON mo.idmodalidade = t.modalidade_id
WHERE (
    (EXTRACT(ISODOW FROM d.data) = 1 AND LOWER(t.dias_semana) LIKE '%seg%') OR
    (EXTRACT(ISODOW FROM d.data) = 2 AND LOWER(t.dias_semana) LIKE '%ter%') OR
    (EXTRACT(ISODOW FROM d.data) = 3 AND LOWER(t.dias_semana) LIKE '%qua%') OR
    (EXTRACT(ISODOW FROM d.data) = 4 AND LOWER(t.dias_semana) LIKE '%qui%') OR
    (EXTRACT(ISODOW FROM d.data) = 5 AND LOWER(t.dias_semana) LIKE '%sex%') OR
    (EXTRACT(ISODOW FROM d.data) = 6 AND (LOWER(t.dias_semana) LIKE '%sab%' OR LOWER(t.dias_semana) LIKE '%sáb%' OR LOWER(t.dias_semana) LIKE '%sã%')) OR
    (EXTRACT(ISODOW FROM d.data) = 7 AND LOWER(t.dias_semana) LIKE '%dom%')
)
ORDER BY d.data ASC, t.horario ASC
