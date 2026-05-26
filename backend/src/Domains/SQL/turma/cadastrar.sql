INSERT INTO turma (nome, modalidade_id, dias_semana, horario, professor, professor_id, limite_alunos, valor_mensalidade, situacao)
VALUES (:nome, :modalidade_id, :dias_semana, :horario, :professor, :professor_id, :limite_alunos, :valor_mensalidade, :situacao)
RETURNING idturma
