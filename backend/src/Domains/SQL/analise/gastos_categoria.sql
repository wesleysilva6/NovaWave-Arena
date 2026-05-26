SELECT
    categoria,
    COUNT(*) AS quantidade,
    SUM(valor) AS total
FROM gasto
WHERE data BETWEEN :data_inicio AND :data_fim
GROUP BY categoria
ORDER BY total DESC
