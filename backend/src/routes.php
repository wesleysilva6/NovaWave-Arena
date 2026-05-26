<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Controllers\ProcedimentoController;
use App\Controllers\LoginController;
use App\Controllers\DashboardController;
use App\Controllers\AlunoController;
use App\Controllers\ModalidadeController;
use App\Controllers\TurmaController;
use App\Controllers\MensalidadeController;
use App\Controllers\PresencaController;
use App\Controllers\MensagemController;
use App\Controllers\UsuarioController;
use App\Controllers\GastoController;
use App\Controllers\ConfiguracaoController;
use App\Controllers\FuncionarioController;
use App\Controllers\CargoFuncionarioController;
use App\Controllers\AnaliseController;
use App\Infrastructures\Middleware\JwtAuthMiddleware;

// Rotas Públicas (sem autenticação)
$app->post('/login', LoginController::class . ':login');

// Rotas Protegidas (com autenticação JWT)
$app->group('', function ($group) {
    // Dashboard
    $group->get('/dashboard', DashboardController::class . ':index');
    $group->get('/analises', AnaliseController::class . ':index');

    // Alunos
    $group->get('/alunos', AlunoController::class . ':listar');
    $group->get('/alunos/modalidades', AlunoController::class . ':modalidades');
    $group->get('/alunos/{id}', AlunoController::class . ':buscar');
    $group->post('/alunos', AlunoController::class . ':cadastrar');
    $group->put('/alunos/{id}', AlunoController::class . ':editar');
    $group->delete('/alunos/{id}', AlunoController::class . ':deletar');
    $group->patch('/alunos/{id}/cancelar', AlunoController::class . ':cancelar');
    $group->get('/alunos/{id}/turmas', AlunoController::class . ':listarTurmas');

    // Modalidades
    $group->get('/modalidades', ModalidadeController::class . ':listar');
    $group->post('/modalidades', ModalidadeController::class . ':cadastrar');
    $group->put('/modalidades/{id}', ModalidadeController::class . ':editar');
    $group->patch('/modalidades/{id}/status', ModalidadeController::class . ':toggleStatus');

    // Turmas
    $group->get('/turmas', TurmaController::class . ':listar');
    $group->post('/turmas', TurmaController::class . ':cadastrar');
    $group->put('/turmas/{id}', TurmaController::class . ':editar');
    $group->patch('/turmas/{id}/status', TurmaController::class . ':toggleStatus');
    $group->get('/turmas/{id}/alunos', TurmaController::class . ':listarAlunos');
    $group->get('/turmas/{id}/alunos-disponiveis', TurmaController::class . ':listarAlunosDisponiveis');
    $group->post('/turmas/{id}/alunos', TurmaController::class . ':adicionarAluno');
    $group->delete('/turmas/{id}/alunos/{aluno_id}', TurmaController::class . ':removerAluno');

    // Mensalidades
    $group->get('/mensalidades', MensalidadeController::class . ':listar');
    $group->patch('/mensalidades/{id}/confirmar', MensalidadeController::class . ':confirmarPagamento');
    $group->post('/mensalidades/gerar', MensalidadeController::class . ':gerarMesAtual');
    $group->get('/mensalidades/sem-mensalidade', MensalidadeController::class . ':contarSemMensalidade');

    // Presenças
    $group->get('/presencas/turmas', PresencaController::class . ':listar');
    $group->get('/presencas/aluno/{id}', PresencaController::class . ':listarPorAluno');
    $group->patch('/presencas/{id}/marcar', PresencaController::class . ':marcar');

    // Mensagens
    $group->get('/mensagens/historico', MensagemController::class . ':listarHistorico');
    $group->delete('/mensagens/historico', MensagemController::class . ':limparHistorico');
    $group->get('/mensagens/alunos-turma-map', MensagemController::class . ':alunosTurmaMap');
    $group->post('/mensagens', MensagemController::class . ':cadastrar');

    // Grupos WhatsApp
    $group->get('/grupos-whatsapp', MensagemController::class . ':listarGrupos');
    $group->post('/grupos-whatsapp', MensagemController::class . ':cadastrarGrupo');
    $group->put('/grupos-whatsapp/{id}', MensagemController::class . ':editarGrupo');
    $group->delete('/grupos-whatsapp/{id}', MensagemController::class . ':deletarGrupo');

    // Usuário / Configurações
    $group->get('/usuario/perfil', UsuarioController::class . ':perfil');
    $group->put('/usuario/dados', UsuarioController::class . ':atualizarDados');
    $group->post('/usuario/verificar-senha', UsuarioController::class . ':verificarSenha');
    $group->put('/usuario/senha', UsuarioController::class . ':alterarSenha');
    $group->get('/configuracoes/valores', ConfiguracaoController::class . ':buscar');
    $group->put('/configuracoes/valores', ConfiguracaoController::class . ':salvar');

    // Gastos
    $group->get('/gastos', GastoController::class . ':listar');
    $group->post('/gastos', GastoController::class . ':cadastrar');
    $group->put('/gastos/{id}', GastoController::class . ':editar');
    $group->delete('/gastos/{id}', GastoController::class . ':deletar');
    $group->get('/gastos/resumo', GastoController::class . ':resumoMes');

    // Funcionarios
    $group->get('/funcionarios', FuncionarioController::class . ':listar');
    $group->post('/funcionarios', FuncionarioController::class . ':cadastrar');
    $group->put('/funcionarios/{id}', FuncionarioController::class . ':editar');
    $group->delete('/funcionarios/{id}', FuncionarioController::class . ':deletar');
    $group->get('/cargos-funcionarios', CargoFuncionarioController::class . ':listar');
    $group->post('/cargos-funcionarios', CargoFuncionarioController::class . ':cadastrar');
    $group->put('/cargos-funcionarios/{id}', CargoFuncionarioController::class . ':editar');
    $group->delete('/cargos-funcionarios/{id}', CargoFuncionarioController::class . ':deletar');

    // Rotas Procedimento
    $group->get('/procedimento', ProcedimentoController::class . ':Listar');
    $group->post('/procedimento', ProcedimentoController::class . ':Cadastrar');
    $group->put('/procedimento', ProcedimentoController::class . ':Editar');
    $group->delete('/procedimento', ProcedimentoController::class . ':Deletar');
})->add(new JwtAuthMiddleware());

// Catch-all OPTIONS para qualquer rota (melhor compatibilidade com proxies)
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response->withHeader('Content-Type', 'application/json');
});
