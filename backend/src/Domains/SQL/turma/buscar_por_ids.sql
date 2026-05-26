SELECT
    t.idturma,
    t.nome,
    t.modalidade_id,
    t.valor_mensalidade,
    t.situacao
FROM turma t
WHERE t.idturma = ANY(string_to_array(:ids, ',')::int[])
ORDER BY t.nome ASC
