UPDATE cargo_funcionario
SET nome = :nome,
    situacao = :situacao
WHERE idcargo = :idcargo
RETURNING idcargo, nome, situacao, criado_em
