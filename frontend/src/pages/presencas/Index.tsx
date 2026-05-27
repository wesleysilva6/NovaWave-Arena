import { useCallback, useEffect, useState } from 'react'
import {
  Accordion,
  Box,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { FiCheckSquare, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { useToast } from '@chakra-ui/react'

import {
  listarTurmasComPresencas,
  marcarPresenca,
  type TurmaPresenca,
  type Presenca,
} from '../../service/presencas'
import GrupoTurma from './components/GrupoTurma'

export default function PresencasPage() {
  const toast = useToast()
  const [turmas, setTurmas] = useState<TurmaPresenca[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listarTurmasComPresencas()
      setTurmas(data)
    } catch (err: any) {
      toast({
        title: 'Erro ao carregar presencas',
        description: err.message,
        status: 'error',
        duration: 4000,
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  async function handleMarcar(idpresenca: number, situacao: number) {
    let situacaoAnterior = 0

    setTurmas((prev) =>
      prev.map((t) => ({
        ...t,
        presencas: t.presencas.map((p: Presenca) => {
          if (p.idpresenca !== idpresenca) return p
          situacaoAnterior = p.situacao
          return { ...p, situacao }
        }),
      }))
    )

    try {
      await marcarPresenca(idpresenca, situacao)
    } catch (err: any) {
      setTurmas((prev) =>
        prev.map((t) => ({
          ...t,
          presencas: t.presencas.map((p: Presenca) =>
            p.idpresenca === idpresenca ? { ...p, situacao: situacaoAnterior } : p
          ),
        }))
      )
      toast({
        title: 'Erro ao marcar presenca',
        description: err.message,
        status: 'error',
        duration: 3000,
        position: 'top-right',
      })
    }
  }

  const filtered = turmas.filter(
    (t) =>
      !search ||
      t.nome.toLowerCase().includes(search.toLowerCase()) ||
      t.modalidade_nome.toLowerCase().includes(search.toLowerCase()) ||
      (t.professor ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1200px" w="full" mx="auto">
      <Flex align="center" gap={3} mb={6}>
        <Flex
          w={10}
          h={10}
          rounded="xl"
          bg="brand.50"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Icon as={FiCheckSquare} boxSize={5} color="brand.500" />
        </Flex>
        <Box>
          <Text fontSize="xl" fontWeight="800" color="gray.800" lineHeight="1.2">
            Gestao de Presencas
          </Text>
          <Text fontSize="sm" color="gray.400">
            Resolva presencas pendentes, confirme alunos presentes e registre faltas para reposicao.
          </Text>
        </Box>
      </Flex>

      <Flex
        bg="white"
        rounded="2xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.100"
        p={4}
        mb={5}
        gap={3}
        align="center"
      >
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" boxSize={4} />
          </InputLeftElement>
          <Input
            placeholder="Buscar turma, modalidade ou professor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            rounded="xl"
            fontSize="sm"
            _focus={{ bg: 'white', borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
          />
        </InputGroup>

        <Tooltip label="Atualizar">
          <IconButton
            aria-label="Atualizar"
            icon={<FiRefreshCw />}
            variant="ghost"
            rounded="xl"
            onClick={carregarDados}
            isLoading={loading}
          />
        </Tooltip>
      </Flex>

      {loading ? (
        <VStack spacing={3} align="stretch">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} h="72px" rounded="2xl" />
          ))}
        </VStack>
      ) : filtered.length === 0 ? (
        <Flex
          bg="white"
          rounded="2xl"
          shadow="sm"
          border="1px solid"
          borderColor="gray.100"
          p={12}
          justify="center"
          align="center"
          direction="column"
          gap={2}
        >
          <Icon as={FiCheckSquare} boxSize={12} color="gray.300" />
          <Text color="gray.400" fontSize="md" fontWeight="500">
            {search ? 'Nenhuma turma encontrada para esta busca.' : 'Nenhuma turma ativa cadastrada.'}
          </Text>
        </Flex>
      ) : (
        <Accordion allowMultiple>
          <VStack spacing={3} align="stretch">
            {filtered.map((turma) => (
              <GrupoTurma key={turma.idturma} turma={turma} onMarcar={handleMarcar} />
            ))}
          </VStack>
        </Accordion>
      )}

      {!loading && filtered.length > 0 && (
        <Text fontSize="xs" color="gray.400" textAlign="center" mt={4}>
          {filtered.length} turma{filtered.length !== 1 ? 's' : ''} - pendencias dos ultimos 30 dias e proximas aulas
        </Text>
      )}
    </Box>
  )
}
