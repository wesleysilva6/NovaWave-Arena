<?php

namespace App\Controllers;

use App\Domains\Services\ConfiguracaoService;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ConfiguracaoController extends ControllerBase
{
    public function buscar(Request $request, Response $response): Response
    {
        try {
            return $this->jsonResponse($response, [
                'success' => true,
                'data' => ConfiguracaoService::buscar(),
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function salvar(Request $request, Response $response): Response
    {
        try {
            $dados = ConfiguracaoService::salvar($this->getRequestBody($request));
            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Configuracoes salvas com sucesso',
                'data' => $dados,
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
