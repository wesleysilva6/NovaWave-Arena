UPDATE gasto g
SET
    descricao = 'Salario - ' || f.nome,
    valor = f.salario,
    observacao = 'Gerado automaticamente pela gestao de funcionarios'
FROM funcionario f
WHERE g.funcionario_id = f.idfuncionario
  AND TO_CHAR(g.data, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND g.categoria = 'Salarios'
  AND f.situacao = 1
