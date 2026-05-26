import { useCallback, useEffect, useState } from 'react'
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
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi'

import {
  listarAlunos,
  cadastrarAluno,
  editarAluno,
  deletarAluno,
  cancelarAluno,
  listarModalidades,
  type Aluno,
  type Modalidade,
} from '../../service/alunos'
import { listarTurmas, type Turma } from '../../service/turmas'

import TabelaAlunos from './components/TabelaAlunos'
import ModalAluno from './components/ModalAluno'
import ConfirmarExclusao from './components/ConfirmarExclusao'
import ConfirmarCancelamento from './components/ConfirmarCancelamento'
import ResumoCards from './components/ResumoCards'
import ModalTurmasAluno from './components/ModalTurmasAluno'
import ModalPresencasAluno from './components/ModalPresencasAluno'
import { formatPhone } from '../../utils/formatters'

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [deletando, setDeletando] = useState(false)
  const [cancelando, setCancelando] = useState(false)
  const [busca, setBusca] = useState('')
  const [filtroSituacao, setFiltroSituacao] = useState('')
  const [filtroModalidade, setFiltroModalidade] = useState('')
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null)

  const modalForm = useDisclosure()
  const modalExclusao = useDisclosure()
  const modalCancelamento = useDisclosure()
  const modalTurmas = useDisclosure()
  const modalPresencas = useDisclosure()
  const toast = useToast()

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      const [alunosData, modalidadesData, turmasData] = await Promise.all([
        listarAlunos(),
        listarModalidades(),
        listarTurmas(),
      ])
      setAlunos(alunosData)
      setModalidades(modalidadesData)
      setTurmas(turmasData)
    } catch (err) {
      console.error('Erro ao carregar alunos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const alunosFiltrados = alunos.filter((a) => {
    const matchBusca =
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.telefone.includes(busca.replace(/\D/g, '')) ||
      formatPhone(a.telefone).includes(busca) ||
      a.modalidade_nome.toLowerCase().includes(busca.toLowerCase())
    const matchSituacao = filtroSituacao === '' || String(a.situacao) === filtroSituacao
    const matchModalidade = filtroModalidade === '' || String(a.modalidade_id) === filtroModalidade
    return matchBusca && matchSituacao && matchModalidade
  })

  function handleNovo() {
    setAlunoSelecionado(null)
    modalForm.onOpen()
  }

  function handleEditar(aluno: Aluno) {
    setAlunoSelecionado(aluno)
    modalForm.onOpen()
  }

  function handleDeletar(aluno: Aluno) {
    setAlunoSelecionado(aluno)
    modalExclusao.onOpen()
  }

  function handleCancelar(aluno: Aluno) {
    setAlunoSelecionado(aluno)
    modalCancelamento.onOpen()
  }

  function handleVerTurmas(aluno: Aluno) {
    setAlunoSelecionado(aluno)
    modalTurmas.onOpen()
  }

  function handleVerPresencas(aluno: Aluno) {
    setAlunoSelecionado(aluno)
    modalPresencas.onOpen()
  }

  async function handleConfirmarCancelamento() {
    if (!alunoSelecionado) return
    try {
      setCancelando(true)
      await cancelarAluno(alunoSelecionado.idaluno)
      toast({ title: 'Aluno cancelado com sucesso!', status: 'success', duration: 3000, position: 'top-right' })
      modalCancelamento.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao cancelar', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setCancelando(false)
    }
  }

  async function handleSalvar(dados: Partial<Aluno>) {
    try {
      setSalvando(true)

      if (alunoSelecionado) {
        await editarAluno(alunoSelecionado.idaluno, dados)
        toast({ title: 'Aluno atualizado com sucesso!', status: 'success', duration: 3000, position: 'top-right' })
      } else {
        await cadastrarAluno(dados)
        toast({ title: 'Aluno cadastrado com sucesso!', status: 'success', duration: 3000, position: 'top-right' })
      }

      modalForm.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setSalvando(false)
    }
  }

  async function handleConfirmarExclusao() {
    if (!alunoSelecionado) return
    try {
      setDeletando(true)
      await deletarAluno(alunoSelecionado.idaluno)
      toast({ title: 'Aluno removido com sucesso!', status: 'success', duration: 3000, position: 'top-right' })
      modalExclusao.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao remover', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setDeletando(false)
    }
  }

  const totalAtivos = alunos.filter((a) => a.situacao === 1).length
  const totalInativos = alunos.filter((a) => a.situacao !== 1).length

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">
      <ResumoCards total={alunos.length} ativos={totalAtivos} inativos={totalInativos} />

      {/* Toolbar */}
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
          <InputGroup maxW={{ md: '300px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar aluno..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              rounded="xl"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ bg: 'white', borderColor: 'brand.500' }}
            />
          </InputGroup>

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
            display={{ base: 'none', md: 'block' }}
          >
            <option value="1">Ativos</option>
            <option value="0">Inativos</option>
          </Select>

          <Select
            placeholder="Todas modalidades"
            value={filtroModalidade}
            onChange={(e) => setFiltroModalidade(e.target.value)}
            maxW="200px"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            display={{ base: 'none', md: 'block' }}
          >
            {modalidades.map((m) => (
              <option key={m.idmodalidade} value={m.idmodalidade}>
                {m.nome}
              </option>
            ))}
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
              onClick={() => carregarDados()}
            />
          </Tooltip>
          <Button leftIcon={<FiPlus />} colorScheme="brand" rounded="xl" onClick={handleNovo} px={6}>
            Novo Aluno
          </Button>
        </HStack>
      </Flex>

      {/* Tabela */}
      <TabelaAlunos
        alunos={alunosFiltrados}
        loading={loading}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
        onCancelar={handleCancelar}
        onVerTurmas={handleVerTurmas}
        onVerPresencas={handleVerPresencas}
      />

      {/* Modal Formulário */}
      <ModalAluno
        isOpen={modalForm.isOpen}
        onClose={modalForm.onClose}
        onSalvar={handleSalvar}
        aluno={alunoSelecionado}
        modalidades={modalidades}
        turmas={turmas}
        salvando={salvando}
      />

      {/* Modal Exclusão */}
      <ConfirmarExclusao
        isOpen={modalExclusao.isOpen}
        onClose={modalExclusao.onClose}
        onConfirmar={handleConfirmarExclusao}
        aluno={alunoSelecionado}
        deletando={deletando}
      />

      {/* Modal Cancelamento */}
      <ConfirmarCancelamento
        isOpen={modalCancelamento.isOpen}
        onClose={modalCancelamento.onClose}
        onConfirmar={handleConfirmarCancelamento}
        aluno={alunoSelecionado}
        cancelando={cancelando}
      />

      {/* Modal Turmas do Aluno */}
      <ModalTurmasAluno
        isOpen={modalTurmas.isOpen}
        onClose={modalTurmas.onClose}
        aluno={alunoSelecionado}
      />

      {/* Modal Presenças do Aluno */}
      <ModalPresencasAluno
        isOpen={modalPresencas.isOpen}
        onClose={modalPresencas.onClose}
        aluno={alunoSelecionado}
      />
    </Box>
  )
}

