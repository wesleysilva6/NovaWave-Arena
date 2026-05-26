UPDATE configuracao
SET
    valor_mensalidade = :valor_mensalidade,
    valor_aula_avulsa = :valor_aula_avulsa,
    dias_lembrete = :dias_lembrete
WHERE idconfiguracao = (
    SELECT idconfiguracao
    FROM configuracao
    ORDER BY idconfiguracao ASC
    LIMIT 1
)
RETURNING
    idconfiguracao,
    nome_arena,
    telefone_arena,
    COALESCE(valor_mensalidade, 0) AS valor_mensalidade,
    COALESCE(valor_aula_avulsa, 0) AS valor_aula_avulsa,
    COALESCE(dias_lembrete, 0) AS dias_lembrete
