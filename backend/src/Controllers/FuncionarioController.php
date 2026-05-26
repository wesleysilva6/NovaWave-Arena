<?php

namespace App\Controllers;

use App\Domains\Services\FuncionarioService;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class FuncionarioController extends ControllerBase
{
    public function listar(Request $request, Response $response): Response
    {
        try {
            return $this->jsonResponse($response, ['success' => true, 'data' => FuncionarioService::listar()]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function cadastrar(Request $request, Response $response): Response
    {
        try {
            return $this->successResponse($response, 'Funcionario cadastrado com sucesso!', FuncionarioService::cadastrar($this->getRequestBody($request)));
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function editar(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            return $this->successResponse($response, 'Funcionario atualizado com sucesso!', FuncionarioService::editar($id, $this->getRequestBody($request)));
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function deletar(Request $request, Response $response, array $args): Response
    {
        try {
            FuncionarioService::deletar((int) ($args['id'] ?? 0));
            return $this->successResponse($response, 'Funcionario removido com sucesso!');
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
