import http from './http'

export interface AnaliseFiltros {
  data_inicio: string
  data_fim: string
  modalidade_id: number
  aluno_situacao: number
}

export interface AnaliseData {
  filtros: AnaliseFiltros
  resumo: {
    receita: number
    gastos: number
    resultado: number
    em_aberto: number
    alunos: number
    novos_alunos: number
    presencas_confirmadas: number
    aulas_geradas: number
    taxa_presenca: number
  }
  financeiro_mensal: { mes_referencia: string; label: string; receita: number; gastos: number; em_aberto: number }[]
  gastos_categoria: { categoria: string; quantidade: number; total: number }[]
  mensalidades_status: { situacao: number; quantidade: number; total: number }[]
  alunos_modalidade: { modalidade: string; total: number }[]
  presencas_modalidade: { modalidade: string; presencas: number; aulas_geradas: number }[]
  aulas_dia_semana: { dia_iso: number; dia_semana: string; aulas_geradas: number; presencas: number }[]
  turmas_ocupacao: { turma: string; modalidade: string; limite_alunos: number | null; alunos: number; ocupacao: number | null }[]
}

export async function obterAnalises(filtros: AnaliseFiltros): Promise<AnaliseData> {
  const res = await http.get('/analises', { params: filtros })
  return res.data?.data
}
