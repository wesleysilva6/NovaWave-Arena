import http from './http'

export interface Funcionario {
  idfuncionario: number
  nome: string
  cargo_id: number | null
  cargo: string
  telefone: string | null
  email: string | null
  salario: number
  data_admissao: string | null
  situacao: number
  observacao: string | null
  criado_em: string
}

export type FuncionarioForm = Omit<Funcionario, 'idfuncionario' | 'criado_em'>

export async function listarFuncionarios(): Promise<Funcionario[]> {
  const res = await http.get('/funcionarios')
  const data = res.data?.data ?? []
  return data.map((f: Funcionario) => ({ ...f, salario: Number(f.salario ?? 0) }))
}

export async function cadastrarFuncionario(dados: FuncionarioForm): Promise<any> {
  const res = await http.post('/funcionarios', dados)
  return res.data
}

export async function editarFuncionario(id: number, dados: FuncionarioForm): Promise<any> {
  const res = await http.put(`/funcionarios/${id}`, dados)
  return res.data
}

export async function deletarFuncionario(id: number): Promise<any> {
  const res = await http.delete(`/funcionarios/${id}`)
  return res.data
}
