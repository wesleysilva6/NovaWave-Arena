<?php

namespace App\Controllers;

use App\Domains\Services\CargoFuncionarioService;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CargoFuncionarioController extends ControllerBase
{
    public function listar(Request $request, Response $response): Response
    {
        try {
            return $this->jsonResponse($response, ['success' => true, 'data' => CargoFuncionarioService::listar()]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function cadastrar(Request $request, Response $response): Response
    {
        try {
            return $this->successResponse($response, 'Cargo cadastrado com sucesso!', CargoFuncionarioService::cadastrar($this->getRequestBody($request)));
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function editar(Request $request, Response $response, array $args): Response
    {
        try {
            return $this->successResponse($response, 'Cargo atualizado com sucesso!', CargoFuncionarioService::editar((int) ($args['id'] ?? 0), $this->getRequestBody($request)));
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function deletar(Request $request, Response $response, array $args): Response
    {
        try {
            CargoFuncionarioService::deletar((int) ($args['id'] ?? 0));
            return $this->successResponse($response, 'Cargo removido com sucesso!');
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
