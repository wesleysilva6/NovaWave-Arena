WITH meses AS (
    SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
    )::date AS mes
)
SELECT
    TO_CHAR(m.mes, 'YYYY-MM') AS mes_referencia,
    TO_CHAR(m.mes, 'MM/YYYY') AS label,
    COALESCE((
        SELECT SUM(mn.valor)
        FROM mensalidade mn
        WHERE mn.situacao = 1
          AND mn.mes_referencia = TO_CHAR(m.mes, 'YYYY-MM')
    ), 0) AS receita,
    COALESCE((
        SELECT SUM(g.valor)
        FROM gasto g
        WHERE date_trunc('month', g.data) = m.mes
    ), 0) AS gastos
FROM meses m
ORDER BY m.mes ASC
