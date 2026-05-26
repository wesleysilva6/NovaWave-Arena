import http from './http'

export interface Turma {
  idturma: number
  nome: string
  modalidade_id: number
  dias_semana: string
  horario: string
  professor_id?: number | null
  professor: string | null
  limite_alunos: number | null
  valor_mensalidade: number
  situacao: number
  criado_em: string
  modalidade_nome: string
  alunos_count: number
}

export interface TurmaForm {
  idturma?: number
  nome: string
  modalidade_id: number
  dias_semana: string
  horario: string
  professor_id?: number | null
  professor?: string | null
  limite_alunos?: number | null
  valor_mensalidade: number
  situacao: number
}

export interface AlunoSimples {
  idaluno: number
  nome: string
  telefone: string
  situacao: number
}

export async function listarTurmas(): Promise<Turma[]> {
  const res = await http.get('/turmas')
  const data = res.data?.data ?? []
  return data.map((t: Turma) => ({ ...t, valor_mensalidade: Number(t.valor_mensalidade ?? 0) }))
}

export async function cadastrarTurma(dados: TurmaForm): Promise<any> {
  const res = await http.post('/turmas', dados)
  return res.data
}

export async function editarTurma(id: number, dados: TurmaForm): Promise<any> {
  const res = await http.put(`/turmas/${id}`, dados)
  return res.data
}

export async function toggleStatusTurma(id: number, situacao: number): Promise<any> {
  const res = await http.patch(`/turmas/${id}/status`, { situacao })
  return res.data
}

export async function listarAlunosDaTurma(id: number): Promise<AlunoSimples[]> {
  const res = await http.get(`/turmas/${id}/alunos`)
  return res.data?.data ?? []
}

export async function listarAlunosDisponiveisDaTurma(id: number): Promise<AlunoSimples[]> {
  const res = await http.get(`/turmas/${id}/alunos-disponiveis`)
  return res.data?.data ?? []
}

export async function adicionarAlunoTurma(turma_id: number, aluno_id: number): Promise<any> {
  const res = await http.post(`/turmas/${turma_id}/alunos`, { aluno_id })
  return res.data
}

export async function removerAlunoTurma(turma_id: number, aluno_id: number): Promise<any> {
  const res = await http.delete(`/turmas/${turma_id}/alunos/${aluno_id}`)
  return res.data
}
