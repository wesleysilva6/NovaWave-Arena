SELECT
    t.nome AS turma,
    mo.nome AS modalidade,
    t.horario::text AS horario,
    (SELECT COUNT(*) FROM aluno_turma at2 WHERE at2.turma_id = t.idturma) AS alunos
FROM turma t
JOIN modalidade mo ON mo.idmodalidade = t.modalidade_id
WHERE t.situacao = 1
  AND (
    (EXTRACT(ISODOW FROM CURRENT_DATE) = 1 AND LOWER(t.dias_semana) LIKE '%seg%') OR
    (EXTRACT(ISODOW FROM CURRENT_DATE) = 2 AND LOWER(t.dias_semana) LIKE '%ter%') OR
    (EXTRACT(ISODOW FROM CURRENT_DATE) = 3 AND LOWER(t.dias_semana) LIKE '%qua%') OR
    (EXTRACT(ISODOW FROM CURRENT_DATE) = 4 AND LOWER(t.dias_semana) LIKE '%qui%') OR
    (EXTRACT(ISODOW FROM CURRENT_DATE) = 5 AND LOWER(t.dias_semana) LIKE '%sex%') OR
    (EXTRACT(ISODOW FROM CURRENT_DATE) = 6 AND (LOWER(t.dias_semana) LIKE '%sab%' OR LOWER(t.dias_semana) LIKE '%sáb%' OR LOWER(t.dias_semana) LIKE '%sã%')) OR
    (EXTRACT(ISODOW FROM CURRENT_DATE) = 7 AND LOWER(t.dias_semana) LIKE '%dom%')
  )
ORDER BY t.horario ASC
0
