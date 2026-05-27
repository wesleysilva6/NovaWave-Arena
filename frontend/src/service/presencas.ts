import http from './http'

export interface Presenca {
  idpresenca: number
  turma_id: number
  aluno_id: number
  data_treino: string   // YYYY-MM-DD
  situacao: number      // 0 = pendente | 1 = presente | 2 = faltou
  criado_em: string
  aluno_nome: string
}

export interface TurmaPresenca {
  idturma: number
  nome: string
  modalidade_nome: string
  dias_semana: string
  horario: string
  professor: string | null
  situacao: number
  alunos_count: number
  presencas: Presenca[]
}

export interface AulaAgrupada {
  data_treino: string
  presencas: Presenca[]
}

export interface PresencaAluno {
  idpresenca: number
  data_treino: string
  situacao: number
  criado_em: string
  idturma: number
  turma_nome: string
  dias_semana: string
  horario: string
  modalidade_nome: string
}

export async function listarTurmasComPresencas(): Promise<TurmaPresenca[]> {
  const { data } = await http.get('/presencas/turmas')
  return data
}

export async function marcarPresenca(idpresenca: number, situacao: number): Promise<void> {
  await http.patch(`/presencas/${idpresenca}/marcar`, { situacao })
}

export async function listarPresencasAluno(alunoId: number): Promise<PresencaAluno[]> {
  const { data } = await http.get(`/presencas/aluno/${alunoId}`)
  return data
}

/** Agrupa as presenças de uma turma por data, ordenadas da mais recente para a mais antiga. */
export function agruparPorData(presencas: Presenca[]): AulaAgrupada[] {
  const map = new Map<string, Presenca[]>()
  for (const p of presencas) {
    if (!map.has(p.data_treino)) map.set(p.data_treino, [])
    map.get(p.data_treino)!.push(p)
  }
  return [...map.entries()]
    .map(([data_treino, items]) => ({
      data_treino,
      presencas: [...items].sort((a, b) => a.aluno_nome.localeCompare(b.aluno_nome)),
    }))
    .sort((a, b) => a.data_treino.localeCompare(b.data_treino))
}

/** Formata "2026-04-10" → "Quinta-feira, 10/04/2026" */
export function formatDataAula(data: string): string {
  const d = new Date(data + 'T00:00:00')
  const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' })
  const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dateStr}`
}

/** Formata "18:00:00" → "18:00" */
export function formatHorario(horario: string): string {
  return horario.slice(0, 5)
}

export function hojeLocalISO(): string {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

export function isHoje(data: string): boolean {
  return data === hojeLocalISO()
}

export function isFutura(data: string): boolean {
  return data > hojeLocalISO()
}
