SELECT
    mn.idmensalidade,
    mn.aluno_id,
    mn.mes_referencia,
    a.valor_mensalidade,
    a.data_inicio_contrato
FROM mensalidade mn
INNER JOIN aluno a ON a.idaluno = mn.aluno_id
WHERE mn.situacao = 0
