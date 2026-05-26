SELECT
    f.idfuncionario,
    f.nome,
    f.cargo_id,
    COALESCE(c.nome, f.cargo) AS cargo,
    f.telefone,
    f.email,
    f.salario,
    f.data_admissao,
    f.situacao,
    f.observacao,
    f.criado_em
FROM funcionario f
LEFT JOIN cargo_funcionario c ON c.idcargo = f.cargo_id
ORDER BY f.situacao DESC, f.nome ASC
