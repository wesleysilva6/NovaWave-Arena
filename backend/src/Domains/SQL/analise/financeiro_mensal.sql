WITH meses AS (
    SELECT generate_series(
        date_trunc('month', CAST(:data_inicio AS date)),
        date_trunc('month', CAST(:data_fim AS date)),
        INTERVAL '1 month'
    )::date AS mes
)
SELECT
    TO_CHAR(m.mes, 'YYYY-MM') AS mes_referencia,
    TO_CHAR(m.mes, 'MM/YYYY') AS label,
    COALESCE((
        SELECT SUM(mn.valor)
        FROM mensalidade mn
        JOIN aluno a ON a.idaluno = mn.aluno_id
        WHERE mn.situacao = 1
          AND mn.mes_referencia = TO_CHAR(m.mes, 'YYYY-MM')
          AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
          AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
    ), 0) AS receita,
    COALESCE((
        SELECT SUM(g.valor)
        FROM gasto g
        WHERE date_trunc('month', g.data) = m.mes
    ), 0) AS gastos,
    COALESCE((
        SELECT SUM(mn.valor)
        FROM mensalidade mn
        JOIN aluno a ON a.idaluno = mn.aluno_id
        WHERE mn.situacao IN (0, 2)
          AND date_trunc('month', mn.data_vencimento) = m.mes
          AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
          AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
    ), 0) AS em_aberto
FROM meses m
ORDER BY m.mes ASC
