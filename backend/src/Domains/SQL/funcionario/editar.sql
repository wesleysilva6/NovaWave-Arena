UPDATE funcionario
SET
    nome = :nome,
    cargo = :cargo,
    cargo_id = :cargo_id,
    telefone = :telefone,
    email = :email,
    salario = :salario,
    data_admissao = :data_admissao,
    situacao = :situacao,
    observacao = :observacao
WHERE idfuncionario = :idfuncionario
RETURNING idfuncionario, nome, cargo, cargo_id, telefone, email, salario, data_admissao, situacao, observacao, criado_em
