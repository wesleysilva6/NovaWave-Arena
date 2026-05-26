<?php

namespace App\Domains\Services;

use App\Domains\Repositories\ConfiguracaoRepository;

class ConfiguracaoService
{
    public static function buscar(): array
    {
        return self::normalizar(ConfiguracaoRepository::buscar());
    }

    public static function salvar(array $dados): array
    {
        $payload = [
            'valor_mensalidade' => max(0, (float) ($dados['valor_mensalidade'] ?? 0)),
            'valor_aula_avulsa' => max(0, (float) ($dados['valor_aula_avulsa'] ?? 0)),
            'dias_lembrete' => max(0, (int) ($dados['dias_lembrete'] ?? 0)),
        ];

        return self::normalizar(ConfiguracaoRepository::salvar($payload));
    }

    private static function normalizar(array $dados): array
    {
        return [
            'idconfiguracao' => (int) ($dados['idconfiguracao'] ?? 0),
            'nome_arena' => $dados['nome_arena'] ?? null,
            'telefone_arena' => $dados['telefone_arena'] ?? null,
            'valor_mensalidade' => (float) ($dados['valor_mensalidade'] ?? 0),
            'valor_aula_avulsa' => (float) ($dados['valor_aula_avulsa'] ?? 0),
            'dias_lembrete' => (int) ($dados['dias_lembrete'] ?? 0),
        ];
    }
}
