DELETE FROM gasto
WHERE funcionario_id = :idfuncionario
  AND TO_CHAR(data, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND categoria = 'Salarios'
