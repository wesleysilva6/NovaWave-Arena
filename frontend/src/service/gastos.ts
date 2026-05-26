import http from './http'

export interface Gasto {
  idgasto: number
  descricao: string
  valor: number
  categoria: string
  data: string
  observacao: string | null
  criado_em: string
}

export const CATEGORIAS = [
  'Manutenção',
  'Material esportivo',
  'Limpeza',
  'Energia',
  'Água',
  'Internet',
  'Aluguel',
  'Salarios',
  'Marketing',
  'Outros',
] as const

export type Categoria = (typeof CATEGORIAS)[number]

export async function listarGastos(): Promise<Gasto[]> {
  const res = await http.get('/gastos')
  const data: Gasto[] = res.data?.data ?? []
  return data.map((g) => ({ ...g, valor: Number(g.valor) }))
}

export async function cadastrarGasto(gasto: Omit<Gasto, 'idgasto' | 'criado_em'>): Promise<any> {
  const res = await http.post('/gastos', gasto)
  return res.data
}

export async function editarGasto(id: number, gasto: Omit<Gasto, 'idgasto' | 'criado_em'>): Promise<any> {
  const res = await http.put(`/gastos/${id}`, gasto)
  return res.data
}

export async function deletarGasto(id: number): Promise<any> {
  const res = await http.delete(`/gastos/${id}`)
  return res.data
}

export async function resumoMes(mesReferencia: string): Promise<{ categoria: string; total: number; quantidade: number }[]> {
  const res = await http.get('/gastos/resumo', { params: { mes_referencia: mesReferencia } })
  const data = res.data?.data ?? []
  return data.map((r: any) => ({ ...r, total: Number(r.total), quantidade: Number(r.quantidade) }))
}

export function getMesAtual(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function formatMes(mesRef: string): string {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]
  const [ano, mes] = mesRef.split('-')
  return `${meses[parseInt(mes) - 1]}/${ano}`
}
