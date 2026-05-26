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
  listarTurmas,
  toggleStatusTurma,
  type Turma,
} from '../../service/turmas'
import { listarModalidades } from '../../service/modalidades'
import type { TurmaData } from './TurmaFormModal'
import TurmaFormModal from './TurmaFormModal'
import ResumoCards from './components/ResumoCards'
import TabelaTurmas from './components/TabelaTurmas'
import ModalAlunosTurma from './components/ModalAlunosTurma'
import ConfirmarToggleStatus from './components/ConfirmarToggleStatus'

export default function TurmasPage() {
  const toast = useToast()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState(false)
  const [search, setSearch] = useState('')
  const [filtroSituacao, setFiltroSituacao] = useState<string>('')
  const [filtroModalidade, setFiltroModalidade] = useState<string>('')
  const [modalidades, setModalidades] = useState<{ idmodalidade: number; nome: string }[]>([])

  const [editingTurma, setEditingTurma] = useState<TurmaData | null>(null)
  const [togglingTurma, setTogglingTurma] = useState<Turma | null>(null)
  const [viewingTurma, setViewingTurma] = useState<Turma | null>(null)

  const modalForm = useDisclosure()
  const modalToggle = useDisclosure()
  const modalAlunos = useDisclosure()

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listarTurmas()
      setTurmas(data)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar turmas', description: err.message, status: 'error', duration: 4000 })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    carregarDados()
    listarModalidades()
      .then((data) => setModalidades(data.map((m) => ({ idmodalidade: m.idmodalidade, nome: m.nome }))))
      .catch(() => {})
  }, [carregarDados])

  const filtered = turmas.filter((t) => {
    const matchSearch =
      !search ||
      t.nome.toLowerCase().includes(search.toLowerCase()) ||
      (t.professor ?? '').toLowerCase().includes(search.toLowerCase())
    const matchSituacao = !filtroSituacao || t.situacao === Number(filtroSituacao)
    const matchModalidade = !filtroModalidade || t.modalidade_id === Number(filtroModalidade)
    return matchSearch && matchSituacao && matchModalidade
  })

  const totalAtivas = turmas.filter((t) => t.situacao === 1).length
  const totalInativas = turmas.filter((t) => t.situacao === 0).length

  function handleNovo() {
    setEditingTurma(null)
    modalForm.onOpen()
  }

  function handleEditar(t: Turma) {
    setEditingTurma({
      idturma: t.idturma,
      nome: t.nome,
      modalidade_id: t.modalidade_id,
      dias_semana: t.dias_semana,
      horario: t.horario?.slice(0, 5) ?? '',
      professor_id: t.professor_id ?? '',
      professor: t.professor ?? '',
      limite_alunos: t.limite_alunos ?? '',
      valor_mensalidade: t.valor_mensalidade ?? '',
      situacao: t.situacao,
    })
    modalForm.onOpen()
  }

  function handleToggleStatus(t: Turma) {
    setTogglingTurma(t)
    modalToggle.onOpen()
  }

  function handleVerAlunos(t: Turma) {
    setViewingTurma(t)
    modalAlunos.onOpen()
  }

  async function handleConfirmarToggle() {
    if (!togglingTurma) return
    try {
      setProcessando(true)
      const newStatus = togglingTurma.situacao === 1 ? 0 : 1
      await toggleStatusTurma(togglingTurma.idturma, newStatus)
      toast({
        title: newStatus === 1 ? 'Turma reativada' : 'Turma desativada',
        status: 'success',
        duration: 3000,
        position: 'top-right',
      })
      modalToggle.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setProcessando(false)
    }
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">
      <ResumoCards total={turmas.length} ativas={totalAtivas} inativas={totalInativas} />

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
              placeholder="Buscar por nome ou professor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            <option value="1">Ativas</option>
            <option value="0">Inativas</option>
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
            Nova Turma
          </Button>
        </HStack>
      </Flex>

      <TabelaTurmas
        turmas={filtered}
        loading={loading}
        search={search}
        filtroSituacao={filtroSituacao}
        filtroModalidade={filtroModalidade}
        totalTurmas={turmas.length}
        onEditar={handleEditar}
        onToggleStatus={handleToggleStatus}
        onVerAlunos={handleVerAlunos}
        onNovo={handleNovo}
      />

      <TurmaFormModal
        isOpen={modalForm.isOpen}
        onClose={modalForm.onClose}
        turma={editingTurma}
        onSaved={carregarDados}
      />

      <ModalAlunosTurma
        isOpen={modalAlunos.isOpen}
        onClose={modalAlunos.onClose}
        turma={viewingTurma}
        onChanged={carregarDados}
      />

      <ConfirmarToggleStatus
        isOpen={modalToggle.isOpen}
        onClose={modalToggle.onClose}
        onConfirmar={handleConfirmarToggle}
        turma={togglingTurma}
        processando={processando}
      />
    </Box>
  )
}
