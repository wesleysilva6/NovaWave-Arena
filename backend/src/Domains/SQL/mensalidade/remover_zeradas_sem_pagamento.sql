DELETE FROM mensalidade
WHERE situacao IN (0, 2)
  AND valor <= 0
RETURNING idmensalidade
