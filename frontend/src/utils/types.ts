export type Vencimento = {
  aluno: string
  vencimento: string
  valor: number
  situacao: number
}

export type Treino = {
  data?: string
  dia_semana?: string
  dia_iso?: number
  turma: string
  modalidade: string
  horario: string
  alunos: number
}

export type StatCard = {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  bg: string
}
