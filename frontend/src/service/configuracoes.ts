import http from './http'

export interface ValoresConfiguracao {
  idconfiguracao: number
  valor_mensalidade: number
  valor_aula_avulsa: number
  dias_lembrete: number
}

export async function buscarValoresConfiguracao(): Promise<ValoresConfiguracao> {
  const res = await http.get('/configuracoes/valores')
  const data = res.data?.data
  return {
    ...data,
    valor_mensalidade: Number(data?.valor_mensalidade ?? 0),
    valor_aula_avulsa: Number(data?.valor_aula_avulsa ?? 0),
    dias_lembrete: Number(data?.dias_lembrete ?? 0),
  }
}

export async function salvarValoresConfiguracao(
  dados: Pick<ValoresConfiguracao, 'valor_mensalidade' | 'valor_aula_avulsa' | 'dias_lembrete'>,
): Promise<ValoresConfiguracao> {
  const res = await http.put('/configuracoes/valores', dados)
  return res.data?.data
}
