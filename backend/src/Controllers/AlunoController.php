<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;
use App\Domains\Services\AlunoService;
use Exception;

class AlunoController extends ControllerBase
{
    public function listar(Request $request, Response $response): Response
    {
        try {
            $data = AlunoService::listar();
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function buscar(Request $request, Response $response, array $args): Response
    {
        try {
            $idaluno = (int) ($args['id'] ?? 0);
            $data = AlunoService::buscar($idaluno);

            if (!$data) {
                return $this->errorResponse($response, 'Aluno não encontrado', 404);
            }

            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function cadastrar(Request $request, Response $response): Response
    {
        try {
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['nome', 'telefone', 'dia_vencimento']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            $data = AlunoService::cadastrar($body);
            return $this->successResponse($response, 'Aluno cadastrado com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function editar(Request $request, Response $response, array $args): Response
    {
        try {
            $idaluno = (int) ($args['id'] ?? 0);
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['nome', 'telefone', 'dia_vencimento']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            $data = AlunoService::editar($idaluno, $body);
            return $this->successResponse($response, 'Aluno atualizado com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function deletar(Request $request, Response $response, array $args): Response
    {
        try {
            $idaluno = (int) ($args['id'] ?? 0);
            $data = AlunoService::deletar($idaluno);
            return $this->successResponse($response, 'Aluno removido com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function modalidades(Request $request, Response $response): Response
    {
        try {
            $data = AlunoService::listarModalidades();
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function cancelar(Request $request, Response $response, array $args): Response
    {
        try {
            $idaluno = (int) ($args['id'] ?? 0);
            $data = AlunoService::cancelar($idaluno);
            return $this->successResponse($response, 'Aluno cancelado com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function listarTurmas(Request $request, Response $response, array $args): Response
    {
        try {
            $idaluno = (int) ($args['id'] ?? 0);
            $data = AlunoService::listarTurmas($idaluno);
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
