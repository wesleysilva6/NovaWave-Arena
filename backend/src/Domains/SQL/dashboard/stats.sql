SELECT
    (SELECT COUNT(*) FROM aluno WHERE situacao = 1) AS total_alunos,
    (SELECT COUNT(DISTINCT t.idturma)
       FROM turma t
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
    ) AS treinos_hoje,
    (SELECT COALESCE(SUM(m.valor), 0)
       FROM mensalidade m
       WHERE m.situacao = 1
         AND TO_CHAR(m.data_pagamento, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
    ) AS receita_mes,
    (SELECT COUNT(*)
       FROM mensalidade m
       WHERE m.situacao IN (0, 2)
         AND m.data_vencimento <= CURRENT_DATE + INTERVAL '7 days'
    ) AS vencimentos_proximos,
    (SELECT COUNT(*) FROM modalidade WHERE situacao = 1) AS modalidades_ativas,
    (SELECT COUNT(*)
       FROM aluno
       WHERE situacao = 1
         AND criado_em >= DATE_TRUNC('month', CURRENT_DATE)
    ) AS novos_alunos_mes,
    (SELECT COALESCE(SUM(valor), 0)
       FROM gasto
       WHERE TO_CHAR(data, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
    ) AS gastos_mes
