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
    COUNT(p.idpresenca) AS aulas_geradas,
    COUNT(p.idpresenca) FILTER (WHERE p.situacao = 1) AS presencas
FROM dias d
LEFT JOIN presenca p ON EXTRACT(ISODOW FROM p.data_treino)::int = d.dia_iso
  AND p.data_treino BETWEEN :data_inicio AND :data_fim
LEFT JOIN aluno a ON a.idaluno = p.aluno_id
WHERE p.idpresenca IS NULL
   OR (
        (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
        AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
   )
GROUP BY d.dia_iso, d.dia_semana
ORDER BY d.dia_iso ASC
