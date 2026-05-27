UPDATE mensalidade
SET situacao = 2
WHERE situacao = 0
  AND valor > 0
  AND data_vencimento < CURRENT_DATE
