INSERT INTO funcionario (
    nome,
    cargo,
    cargo_id,
    telefone,
    email,
    salario,
    data_admissao,
    situacao,
    observacao
)
VALUES (
    :nome,
    :cargo,
    :cargo_id,
    :telefone,
    :email,
    :salario,
    :data_admissao,
    :situacao,
    :observacao
)
RETURNING idfuncionario, nome, cargo, cargo_id, telefone, email, salario, data_admissao, situacao, observacao, criado_em
