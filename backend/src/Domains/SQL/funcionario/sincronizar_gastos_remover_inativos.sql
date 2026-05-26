DELETE FROM gasto g
USING funcionario f
WHERE g.funcionario_id = f.idfuncionario
  AND TO_CHAR(g.data, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND g.categoria = 'Salarios'
  AND f.situacao = 0
