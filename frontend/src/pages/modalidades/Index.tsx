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
  listarModalidades,
  cadastrarModalidade,
  editarModalidade,
  toggleStatusModalidade,
  type Modalidade,
  type ModalidadeForm,
} from '../../service/modalidades'

import ResumoCards from './components/ResumoCards'
import TabelaModalidades from './components/TabelaModalidades'
import ModalModalidade from './components/ModalModalidade'
import ConfirmarToggleStatus from './components/ConfirmarToggleStatus'

export default function Modalidades() {
  const toast = useToast()
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [search, setSearch] = useState('')
  const [filtroSituacao, setFiltroSituacao] = useState<string>('')

  const [editingItem, setEditingItem] = useState<ModalidadeForm | null>(null)
  const [togglingItem, setTogglingItem] = useState<Modalidade | null>(null)

  const modalForm = useDisclosure()
  const modalToggle = useDisclosure()

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listarModalidades()
      setModalidades(data)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar modalidades', description: err.message, status: 'error', duration: 4000 })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const filtered = modalidades.filter((m) => {
    const matchSearch = !search || m.nome.toLowerCase().includes(search.toLowerCase())
    const matchSituacao = !filtroSituacao || m.situacao === Number(filtroSituacao)
    return matchSearch && matchSituacao
  })

  const totalAtivas = modalidades.filter((m) => m.situacao === 1).length
  const totalInativas = modalidades.filter((m) => m.situacao === 0).length

  function handleNovo() {
    setEditingItem(null)
    modalForm.onOpen()
  }

  function handleEditar(m: Modalidade) {
    setEditingItem({
      idmodalidade: m.idmodalidade,
      nome: m.nome,
      situacao: m.situacao,
    })
    modalForm.onOpen()
  }

  function handleToggleStatus(m: Modalidade) {
    setTogglingItem(m)
    modalToggle.onOpen()
  }

  async function handleSalvar(dados: ModalidadeForm) {
    try {
      setSalvando(true)
      if (editingItem?.idmodalidade) {
        await editarModalidade(editingItem.idmodalidade, dados)
        toast({ title: 'Modalidade atualizada!', status: 'success', duration: 3000, position: 'top-right' })
      } else {
        await cadastrarModalidade(dados)
        toast({ title: 'Modalidade cadastrada!', status: 'success', duration: 3000, position: 'top-right' })
      }
      modalForm.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setSalvando(false)
    }
  }

  async function handleConfirmarToggle() {
    if (!togglingItem) return
    try {
      setProcessando(true)
      const newStatus = togglingItem.situacao === 1 ? 0 : 1
      await toggleStatusModalidade(togglingItem.idmodalidade, newStatus)
      toast({
        title: newStatus === 1 ? 'Modalidade reativada' : 'Modalidade desativada',
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
      <ResumoCards total={modalidades.length} ativas={totalAtivas} inativas={totalInativas} />

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
          <InputGroup maxW={{ md: '320px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar modalidade..."
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
            Nova Modalidade
          </Button>
        </HStack>
      </Flex>

      {/* Table */}
      <TabelaModalidades
        modalidades={filtered}
        loading={loading}
        search={search}
        filtroSituacao={filtroSituacao}
        onEditar={handleEditar}
        onToggleStatus={handleToggleStatus}
        onNovo={handleNovo}
      />

      {/* Modal Form */}
      <ModalModalidade
        isOpen={modalForm.isOpen}
        onClose={modalForm.onClose}
        onSalvar={handleSalvar}
        modalidade={editingItem}
        salvando={salvando}
      />

      {/* Toggle Status Dialog */}
      <ConfirmarToggleStatus
        isOpen={modalToggle.isOpen}
        onClose={modalToggle.onClose}
        onConfirmar={handleConfirmarToggle}
        modalidade={togglingItem}
        processando={processando}
      />
    </Box>
  )
}
