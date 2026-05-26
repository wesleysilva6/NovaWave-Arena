WITH dias AS (
    SELECT 1 AS dia_iso, 'Seg' AS dia_semana
    UNION ALL SELECT 2, 'Ter'
    UNION ALL SELECT 3, 'Qua'
    UNION ALL SELECT 4, 'Qui'
    UNION ALL SELECT 5, 'Sex'
    UNION ALL SELECT 6, 'Sab'
    UNION ALL SELECT 7, 'Dom'
)
SELECT
    d.dia_iso,
    d.dia_semana,
    COUNT(t.idturma) AS aulas,
    COALESCE(SUM((SELECT COUNT(*) FROM aluno_turma at2 WHERE at2.turma_id = t.idturma)), 0) AS alunos_previstos
FROM dias d
LEFT JOIN turma t ON t.situacao = 1
  AND (
    (d.dia_iso = 1 AND LOWER(t.dias_semana) LIKE '%seg%') OR
    (d.dia_iso = 2 AND LOWER(t.dias_semana) LIKE '%ter%') OR
    (d.dia_iso = 3 AND LOWER(t.dias_semana) LIKE '%qua%') OR
    (d.dia_iso = 4 AND LOWER(t.dias_semana) LIKE '%qui%') OR
    (d.dia_iso = 5 AND LOWER(t.dias_semana) LIKE '%sex%') OR
    (d.dia_iso = 6 AND (LOWER(t.dias_semana) LIKE '%sab%' OR LOWER(t.dias_semana) LIKE '%sáb%' OR LOWER(t.dias_semana) LIKE '%sã%')) OR
    (d.dia_iso = 7 AND LOWER(t.dias_semana) LIKE '%dom%')
  )
GROUP BY d.dia_iso, d.dia_semana
ORDER BY d.dia_iso ASC
