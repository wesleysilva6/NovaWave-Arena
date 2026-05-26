import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FiPlus, FiRefreshCw, FiSearch, FiUsers } from 'react-icons/fi'
import {
  cadastrarFuncionario,
  deletarFuncionario,
  editarFuncionario,
  listarFuncionarios,
  type Funcionario,
  type FuncionarioForm,
} from '../../service/funcionarios'
import { listarCargosFuncionarios, type CargoFuncionario } from '../../service/cargosFuncionarios'
import { formatPhone } from '../../utils/formatters'
import ResumoCards from './components/ResumoCards'
import TabelaFuncionarios from './components/TabelaFuncionarios'
import FormFuncionario from './components/FormFuncionario'

const funcionarioVazio: FuncionarioForm = {
  nome: '',
  cargo_id: null,
  cargo: '',
  telefone: '',
  email: '',
  salario: 0,
  data_admissao: '',
  situacao: 1,
  observacao: '',
}

export default function FuncionariosPage() {
  const toast = useToast()
  const modalForm = useDisclosure()
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [cargos, setCargos] = useState<CargoFuncionario[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [search, setSearch] = useState('')
  const [filtroCargo, setFiltroCargo] = useState('')
  const [filtroSituacao, setFiltroSituacao] = useState('')
  const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario | null>(null)

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      const [funcionariosData, cargosData] = await Promise.all([
        listarFuncionarios(),
        listarCargosFuncionarios(),
      ])
      setFuncionarios(funcionariosData)
      setCargos(cargosData)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar funcionarios', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const cargosAtivos = useMemo(() => cargos.filter((c) => c.situacao === 1), [cargos])

  const funcionariosFiltrados = funcionarios.filter((f) => {
    const busca = search.toLowerCase()
    const matchSearch =
      !search ||
      f.nome.toLowerCase().includes(busca) ||
      f.cargo.toLowerCase().includes(busca) ||
      (f.telefone ? formatPhone(f.telefone).includes(search) || f.telefone.includes(search.replace(/\D/g, '')) : false) ||
      (f.email ?? '').toLowerCase().includes(busca)

    const matchCargo = !filtroCargo || String(f.cargo_id) === filtroCargo
    const matchSituacao = !filtroSituacao || String(f.situacao) === filtroSituacao

    return matchSearch && matchCargo && matchSituacao
  })

  const totalAtivos = funcionarios.filter((f) => f.situacao === 1).length
  const totalInativos = funcionarios.filter((f) => f.situacao !== 1).length
  const folhaMes = funcionarios.filter((f) => f.situacao === 1).reduce((s, f) => s + f.salario, 0)

  function handleNovo() {
    setFuncionarioEditando(null)
    modalForm.onOpen()
  }

  function handleEditar(funcionario: Funcionario) {
    setFuncionarioEditando(funcionario)
    modalForm.onOpen()
  }

  async function handleSalvar(dados: FuncionarioForm) {
    try {
      setSalvando(true)
      if (funcionarioEditando) {
        await editarFuncionario(funcionarioEditando.idfuncionario, dados)
        toast({ title: 'Funcionario atualizado!', status: 'success', duration: 3000, position: 'top-right' })
      } else {
        await cadastrarFuncionario(dados)
        toast({ title: 'Funcionario cadastrado!', status: 'success', duration: 3000, position: 'top-right' })
      }
      modalForm.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao salvar funcionario', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setSalvando(false)
    }
  }

  async function handleDeletar(funcionario: Funcionario) {
    try {
      await deletarFuncionario(funcionario.idfuncionario)
      toast({ title: 'Funcionario removido!', status: 'success', duration: 3000, position: 'top-right' })
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao remover funcionario', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    }
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">
      <Flex mb={6} align="center" gap={3}>
        <Flex w={10} h={10} rounded="xl" bg="brand.50" align="center" justify="center">
          <Icon as={FiUsers} boxSize={5} color="brand.500" />
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="700" color="gray.800">
            Funcionarios
          </Text>
          <Text fontSize="xs" color="gray.400">
            Controle de equipe e folha mensal da arena
          </Text>
        </Box>
      </Flex>

      <ResumoCards
        totalAtivos={totalAtivos}
        totalInativos={totalInativos}
        totalFuncionarios={funcionarios.length}
        folhaMes={folhaMes}
        loading={loading}
      />

      <Flex
        bg="white"
        rounded="2xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.100"
        p={4}
        mb={5}
        gap={3}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
      >
        <HStack spacing={3} flex={1}>
          <InputGroup maxW={{ md: '280px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar funcionarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              rounded="xl"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ bg: 'white', borderColor: 'brand.500' }}
              fontSize="sm"
            />
          </InputGroup>

          <Select
            placeholder="Todos os cargos"
            value={filtroCargo}
            onChange={(e) => setFiltroCargo(e.target.value)}
            maxW="200px"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            fontSize="sm"
            display={{ base: 'none', md: 'block' }}
          >
            {cargosAtivos.map((cargo) => (
              <option key={cargo.idcargo} value={cargo.idcargo}>{cargo.nome}</option>
            ))}
          </Select>

          <Select
            placeholder="Todos os status"
            value={filtroSituacao}
            onChange={(e) => setFiltroSituacao(e.target.value)}
            maxW="180px"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            fontSize="sm"
            display={{ base: 'none', md: 'block' }}
          >
            <option value="1">Ativos</option>
            <option value="0">Inativos</option>
          </Select>
        </HStack>

        <HStack spacing={2}>
          <Tooltip label="Atualizar">
            <IconButton
              aria-label="Atualizar"
              icon={<FiRefreshCw />}
              variant="ghost"
              rounded="xl"
              color="gray.500"
              onClick={carregarDados}
            />
          </Tooltip>
          <Button leftIcon={<FiPlus />} colorScheme="brand" rounded="xl" onClick={handleNovo} px={5}>
            Novo Funcionario
          </Button>
        </HStack>
      </Flex>

      <TabelaFuncionarios
        funcionarios={funcionariosFiltrados}
        loading={loading}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
      />

      {!loading && funcionariosFiltrados.length > 0 && (
        <Flex px={2} pt={3} justify="flex-start">
          <Text fontSize="xs" color="gray.400">
            Exibindo {funcionariosFiltrados.length} de {funcionarios.length} funcionario{funcionarios.length !== 1 ? 's' : ''}
          </Text>
        </Flex>
      )}

      <FormFuncionario
        isOpen={modalForm.isOpen}
        onClose={modalForm.onClose}
        funcionario={funcionarioEditando}
        cargos={cargosAtivos}
        saving={salvando}
        onSalvar={handleSalvar}
        initialValue={funcionarioVazio}
      />
    </Box>
  )
}
