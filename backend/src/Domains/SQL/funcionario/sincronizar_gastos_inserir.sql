INSERT INTO gasto (descricao, valor, categoria, data, observacao, funcionario_id)
SELECT
    'Salario - ' || f.nome,
    f.salario,
    'Salarios',
    CURRENT_DATE,
    'Gerado automaticamente pela gestao de funcionarios',
    f.idfuncionario
FROM funcionario f
WHERE f.situacao = 1
  AND f.salario > 0
  AND NOT EXISTS (
    SELECT 1
    FROM gasto g
    WHERE g.funcionario_id = f.idfuncionario
      AND TO_CHAR(g.data, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
      AND g.categoria = 'Salarios'
  )
