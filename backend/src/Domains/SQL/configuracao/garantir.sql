INSERT INTO configuracao (
    nome_arena,
    telefone_arena,
    valor_mensalidade,
    valor_aula_avulsa,
    dias_lembrete
)
SELECT NULL, NULL, 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM configuracao)
RETURNING idconfiguracao
