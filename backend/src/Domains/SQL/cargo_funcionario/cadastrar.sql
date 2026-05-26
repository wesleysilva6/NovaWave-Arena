INSERT INTO cargo_funcionario (nome, situacao)
VALUES (:nome, :situacao)
RETURNING idcargo, nome, situacao, criado_em
