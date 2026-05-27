SELECT
    COALESCE((
        SELECT SUM(mn.valor)
        FROM mensalidade mn
        JOIN aluno a ON a.idaluno = mn.aluno_id
        WHERE mn.situacao = 1
          AND TO_DATE(mn.mes_referencia || '-01', 'YYYY-MM-DD')
              BETWEEN DATE_TRUNC('month', CAST(:data_inicio AS date))::date
                  AND DATE_TRUNC('month', CAST(:data_fim AS date))::date
          AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
          AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
    ), 0) AS receita,
    COALESCE((
        SELECT SUM(g.valor)
        FROM gasto g
        WHERE g.data BETWEEN :data_inicio AND :data_fim
    ), 0) AS gastos,
    COALESCE((
        SELECT SUM(mn.valor)
        FROM mensalidade mn
        JOIN aluno a ON a.idaluno = mn.aluno_id
        WHERE mn.situacao IN (0, 2)
          AND mn.data_vencimento BETWEEN :data_inicio AND :data_fim
          AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
          AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
    ), 0) AS em_aberto,
    (SELECT COUNT(*)
       FROM aluno a
       WHERE (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
         AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
    ) AS alunos,
    (SELECT COUNT(*)
       FROM aluno a
       WHERE a.criado_em::date BETWEEN :data_inicio AND :data_fim
         AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
         AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
    ) AS novos_alunos,
    (SELECT COUNT(*)
       FROM presenca p
       JOIN aluno a ON a.idaluno = p.aluno_id
       WHERE p.data_treino BETWEEN :data_inicio AND :data_fim
         AND p.situacao = 1
         AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
         AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
    ) AS presencas_confirmadas,
    (SELECT COUNT(*)
       FROM presenca p
       JOIN aluno a ON a.idaluno = p.aluno_id
       WHERE p.data_treino BETWEEN :data_inicio AND :data_fim
         AND (:modalidade_id = 0 OR a.modalidade_id = :modalidade_id)
         AND (:aluno_situacao = -1 OR a.situacao = :aluno_situacao)
    ) AS aulas_geradas
