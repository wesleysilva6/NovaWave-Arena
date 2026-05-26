import http from './http'

export interface CargoFuncionario {
  idcargo: number
  nome: string
  situacao: number
  criado_em: string
}

export async function listarCargosFuncionarios(): Promise<CargoFuncionario[]> {
  const res = await http.get('/cargos-funcionarios')
  return res.data?.data ?? []
}

export async function cadastrarCargoFuncionario(dados: { nome: string; situacao: number }): Promise<any> {
  const res = await http.post('/cargos-funcionarios', dados)
  return res.data
}

export async function editarCargoFuncionario(id: number, dados: { nome: string; situacao: number }): Promise<any> {
  const res = await http.put(`/cargos-funcionarios/${id}`, dados)
  return res.data
}

export async function deletarCargoFuncionario(id: number): Promise<any> {
  const res = await http.delete(`/cargos-funcionarios/${id}`)
  return res.data
}
