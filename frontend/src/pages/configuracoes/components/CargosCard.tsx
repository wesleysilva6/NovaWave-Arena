import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react'
import { FiBriefcase, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import {
  cadastrarCargoFuncionario,
  deletarCargoFuncionario,
  editarCargoFuncionario,
  listarCargosFuncionarios,
  type CargoFuncionario,
} from '../../../service/cargosFuncionarios'

export default function CargosCard() {
  const toast = useToast()
  const [cargos, setCargos] = useState<CargoFuncionario[]>([])
  const [nome, setNome] = useState('')
  const [situacao, setSituacao] = useState(1)
  const [editando, setEditando] = useState<CargoFuncionario | null>(null)
  const [saving, setSaving] = useState(false)

  async function carregar() {
    setCargos(await listarCargosFuncionarios())
  }

  useEffect(() => {
    carregar().catch(() => setCargos([]))
  }, [])

  async function salvar() {
    if (!nome.trim()) return
    setSaving(true)
    try {
      if (editando) {
        await editarCargoFuncionario(editando.idcargo, { nome: nome.trim(), situacao })
      } else {
        await cadastrarCargoFuncionario({ nome: nome.trim(), situacao })
      }
      setNome('')
      setSituacao(1)
      setEditando(null)
      await carregar()
      toast({ title: 'Cargo salvo com sucesso', status: 'success', duration: 3000 })
    } catch (err: any) {
      toast({ title: 'Erro ao salvar cargo', description: err.message, status: 'error', duration: 4000 })
    } finally {
      setSaving(false)
    }
  }

  async function excluir(cargo: CargoFuncionario) {
    try {
      await deletarCargoFuncionario(cargo.idcargo)
      await carregar()
      toast({ title: 'Cargo removido', status: 'success', duration: 3000 })
    } catch (err: any) {
      toast({ title: 'Erro ao remover cargo', description: err.message, status: 'error', duration: 4000 })
    }
  }

  return (
    <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={{ base: 5, md: 6 }} mt={5}>
      <HStack spacing={3} mb={5}>
        <Flex w={9} h={9} rounded="xl" bg="purple.50" align="center" justify="center">
          <Icon as={FiBriefcase} boxSize={4} color="purple.500" />
        </Flex>
        <Box>
          <Text fontSize="md" fontWeight="700" color="gray.800">Cargos</Text>
          <Text fontSize="xs" color="gray.400">Cadastre cargos usados na gestao de funcionarios</Text>
        </Box>
      </HStack>

      <Flex gap={3} direction={{ base: 'column', md: 'row' }} mb={4}>
        <Input rounded="xl" bg="gray.50" placeholder="Ex: Professor, Recepcao, Limpeza" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Flex align="center" gap={2} minW="120px">
          <Switch isChecked={situacao === 1} onChange={(e) => setSituacao(e.target.checked ? 1 : 0)} />
          <Text fontSize="sm">Ativo</Text>
        </Flex>
        <Button leftIcon={<FiPlus />} colorScheme="brand" rounded="xl" isLoading={saving} onClick={salvar}>
          {editando ? 'Salvar' : 'Adicionar'}
        </Button>
      </Flex>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Cargo</Th>
            <Th>Status</Th>
            <Th isNumeric>Acoes</Th>
          </Tr>
        </Thead>
        <Tbody>
          {cargos.map((cargo) => (
            <Tr key={cargo.idcargo}>
              <Td fontWeight="600">{cargo.nome}</Td>
              <Td>
                <Badge colorScheme={cargo.situacao === 1 ? 'green' : 'gray'} rounded="full">
                  {cargo.situacao === 1 ? 'Ativo' : 'Inativo'}
                </Badge>
              </Td>
              <Td isNumeric>
                <IconButton aria-label="Editar cargo" icon={<FiEdit2 />} size="sm" variant="ghost" onClick={() => { setEditando(cargo); setNome(cargo.nome); setSituacao(cargo.situacao) }} />
                <IconButton aria-label="Excluir cargo" icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={() => excluir(cargo)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
