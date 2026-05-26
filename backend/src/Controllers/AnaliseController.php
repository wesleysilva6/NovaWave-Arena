<?php

namespace App\Controllers;

use App\Domains\Services\AnaliseService;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AnaliseController extends ControllerBase
{
    public function index(Request $request, Response $response): Response
    {
        try {
            return $this->jsonResponse($response, [
                'success' => true,
                'data' => AnaliseService::obter($request->getQueryParams()),
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
