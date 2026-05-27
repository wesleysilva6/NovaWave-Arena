WITH params AS (
    SELECT CAST(:mes_referencia AS text) AS mes_referencia
),
competencia AS (
    SELECT
        p.mes_referencia,
        TO_DATE(p.mes_referencia || '-01', 'YYYY-MM-DD') AS inicio_mes,
        (TO_DATE(p.mes_referencia || '-01', 'YYYY-MM-DD') + INTERVAL '1 month' - INTERVAL '1 day')::date AS fim_mes
    FROM params p
)
SELECT
    a.idaluno,
    a.nome,
    a.dia_vencimento,
    a.valor_mensalidade,
    COALESCE(a.data_inicio_contrato, a.data_inicio, a.criado_em::date) AS data_inicio_contrato
FROM aluno a
CROSS JOIN competencia c
WHERE a.situacao = 1
  AND NOT EXISTS (
    SELECT 1 FROM mensalidade mn
    WHERE mn.aluno_id = a.idaluno
      AND mn.mes_referencia = c.mes_referencia
  )
  AND EXISTS (
    SELECT 1
    FROM aluno_turma atu
    JOIN turma t ON t.idturma = atu.turma_id AND t.situacao = 1
    CROSS JOIN generate_series(
        GREATEST(c.inicio_mes, COALESCE(a.data_inicio_contrato, a.data_inicio, a.criado_em::date))::timestamp,
        c.fim_mes::timestamp,
        INTERVAL '1 day'
    ) AS gs(dt)
    WHERE atu.aluno_id = a.idaluno
      AND (
        (EXTRACT(ISODOW FROM gs.dt)::int = 1 AND LOWER(t.dias_semana) LIKE '%seg%') OR
        (EXTRACT(ISODOW FROM gs.dt)::int = 2 AND LOWER(t.dias_semana) LIKE '%ter%') OR
        (EXTRACT(ISODOW FROM gs.dt)::int = 3 AND LOWER(t.dias_semana) LIKE '%qua%') OR
        (EXTRACT(ISODOW FROM gs.dt)::int = 4 AND LOWER(t.dias_semana) LIKE '%qui%') OR
        (EXTRACT(ISODOW FROM gs.dt)::int = 5 AND LOWER(t.dias_semana) LIKE '%sex%') OR
        (EXTRACT(ISODOW FROM gs.dt)::int = 6 AND (LOWER(t.dias_semana) LIKE '%sab%' OR LOWER(t.dias_semana) LIKE '%s%b%')) OR
        (EXTRACT(ISODOW FROM gs.dt)::int = 7 AND LOWER(t.dias_semana) LIKE '%dom%')
      )
  )
ORDER BY a.nome ASC
