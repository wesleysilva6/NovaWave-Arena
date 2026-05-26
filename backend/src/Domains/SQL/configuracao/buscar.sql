SELECT
    idconfiguracao,
    nome_arena,
    telefone_arena,
    COALESCE(valor_mensalidade, 0) AS valor_mensalidade,
    COALESCE(valor_aula_avulsa, 0) AS valor_aula_avulsa,
    COALESCE(dias_lembrete, 0) AS dias_lembrete
FROM configuracao
ORDER BY idconfiguracao ASC
LIMIT 1
