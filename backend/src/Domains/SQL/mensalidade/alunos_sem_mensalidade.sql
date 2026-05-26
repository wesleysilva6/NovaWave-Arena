SELECT
    a.idaluno,
    a.nome,
    a.dia_vencimento,
    a.valor_mensalidade,
    a.data_inicio_contrato
FROM aluno a
WHERE a.situacao = 1
  AND NOT EXISTS (
    SELECT 1 FROM mensalidade mn
    WHERE mn.aluno_id = a.idaluno
      AND mn.mes_referencia = :mes_referencia
  )
ORDER BY a.nome ASC
