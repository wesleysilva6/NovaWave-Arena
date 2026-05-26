UPDATE mensalidade
SET valor = :valor
WHERE idmensalidade = :idmensalidade
  AND situacao = 0
RETURNING idmensalidade, valor
