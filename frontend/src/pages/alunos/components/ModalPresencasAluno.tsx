import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from 'react-icons/fi'
import type { Aluno } from '../../../service/alunos'
import {
  listarPresencasAluno,
  formatHorario,
  type PresencaAluno,
} from '../../../service/presencas'

interface Props {
  isOpen: boolean
  onClose: () => void
  aluno: Aluno | null
}

function formatDataCurta(data: string) {
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function ModalPresencasAluno({ isOpen, onClose, aluno }: Props) {
  const [presencas, setPresencas] = useState<PresencaAluno[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !aluno) return
    setLoading(true)
    listarPresencasAluno(aluno.idaluno)
      .then(setPresencas)
      .catch(() => setPresencas([]))
      .finally(() => setLoading(false))
  }, [isOpen, aluno])

  // Agrupa por turma
  const porTurma = useMemo(() => {
    const map = new Map<number, { turma_nome: string; modalidade_nome: string; horario: string; itens: PresencaAluno[] }>()
    for (const p of presencas) {
      if (!map.has(p.idturma)) {
        map.set(p.idturma, {
          turma_nome: p.turma_nome,
          modalidade_nome: p.modalidade_nome,
          horario: p.horario,
          itens: [],
        })
      }
      map.get(p.idturma)!.itens.push(p)
    }
    return [...map.values()].sort((a, b) => a.turma_nome.localeCompare(b.turma_nome))
  }, [presencas])

  const totalResolvidas = presencas.filter((p) => p.situacao === 1 || p.situacao === 2).length
  const totalPresente = presencas.filter((p) => p.situacao === 1).length
  const totalFalta = presencas.filter((p) => p.situacao === 2).length
  const totalPendente = presencas.filter((p) => p.situacao === 0).length
  const pct = totalResolvidas > 0 ? Math.round((totalPresente / totalResolvidas) * 100) : 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalHeader pb={2}>
          <Text fontSize="md" fontWeight="700">Histórico de Presenças</Text>
          {aluno && (
            <Text fontSize="sm" color="gray.400" fontWeight="400">{aluno.nome}</Text>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading ? (
            <VStack spacing={3}>
              {[1, 2, 3].map((i) => <Skeleton key={i} h="60px" rounded="xl" />)}
            </VStack>
          ) : presencas.length === 0 ? (
            <Flex direction="column" align="center" py={10} gap={2}>
              <Icon as={FiCalendar} boxSize={10} color="gray.300" />
              <Text color="gray.400" fontSize="sm">Nenhuma aula registrada ainda.</Text>
            </Flex>
          ) : (
            <>
              {/* Resumo geral */}
              <Flex
                bg="gray.50"
                rounded="2xl"
                p={4}
                mb={5}
                align="center"
                gap={5}
                wrap="wrap"
              >
                <CircularProgress
                  value={pct}
                  color={pct >= 75 ? 'green.400' : pct >= 50 ? 'yellow.400' : 'red.400'}
                  trackColor="gray.200"
                  size="72px"
                  thickness="8px"
                  flexShrink={0}
                >
                  <CircularProgressLabel fontSize="sm" fontWeight="700">
                    {pct}%
                  </CircularProgressLabel>
                </CircularProgress>
                <VStack align="start" spacing={0} flex="1">
                  <Text fontSize="sm" fontWeight="700" color="gray.700">
                    Taxa de frequência
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {totalResolvidas} aula{totalResolvidas !== 1 ? 's' : ''} resolvida{totalResolvidas !== 1 ? 's' : ''}
                  </Text>
                </VStack>
                <HStack spacing={3}>
                  <Tooltip label="Presenças">
                    <HStack spacing={1}>
                      <Icon as={FiCheckCircle} color="green.400" boxSize={4} />
                      <Text fontSize="sm" fontWeight="700" color="green.600">{totalPresente}</Text>
                    </HStack>
                  </Tooltip>
                  <Tooltip label="Faltas">
                    <HStack spacing={1}>
                      <Icon as={FiXCircle} color="red.400" boxSize={4} />
                      <Text fontSize="sm" fontWeight="700" color="red.600">{totalFalta}</Text>
                    </HStack>
                  </Tooltip>
                  <Tooltip label="Pendentes">
                    <HStack spacing={1}>
                      <Icon as={FiAlertCircle} color="gray.400" boxSize={4} />
                      <Text fontSize="sm" fontWeight="700" color="gray.500">{totalPendente}</Text>
                    </HStack>
                  </Tooltip>
                </HStack>
              </Flex>

              {/* Por turma */}
              <VStack spacing={4} align="stretch">
                {porTurma.map((grupo) => {
                  const gPresente = grupo.itens.filter((p) => p.situacao === 1).length
                  const gFalta = grupo.itens.filter((p) => p.situacao === 2).length
                  const gPendente = grupo.itens.filter((p) => p.situacao === 0).length
                  const gResolvidas = gPresente + gFalta
                  const gPct = gResolvidas > 0 ? Math.round((gPresente / gResolvidas) * 100) : 0

                  return (
                    <Box key={grupo.turma_nome} border="1px solid" borderColor="gray.100" rounded="xl" overflow="hidden">
                      {/* Header turma */}
                      <Flex
                        bg="gray.50"
                        px={4}
                        py={3}
                        align="center"
                        justify="space-between"
                        gap={3}
                        wrap="wrap"
                      >
                        <Box>
                          <HStack spacing={2}>
                            <Text fontSize="sm" fontWeight="700" color="gray.700">{grupo.turma_nome}</Text>
                            <Badge colorScheme="purple" rounded="full" fontSize="xs" variant="subtle">
                              {grupo.modalidade_nome}
                            </Badge>
                          </HStack>
                          <HStack spacing={1} mt={0.5}>
                            <Icon as={FiClock} boxSize={3} color="gray.400" />
                            <Text fontSize="xs" color="gray.400">{formatHorario(grupo.horario)}</Text>
                          </HStack>
                        </Box>
                        <HStack spacing={3} flexShrink={0}>
                          <HStack spacing={1}>
                            <Icon as={FiCheckCircle} color="green.400" boxSize={3.5} />
                            <Text fontSize="xs" fontWeight="700" color="green.600">{gPresente}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FiXCircle} color="red.400" boxSize={3.5} />
                            <Text fontSize="xs" fontWeight="700" color="red.600">{gFalta}</Text>
                          </HStack>
                          {gPendente > 0 && (
                            <HStack spacing={1}>
                              <Icon as={FiAlertCircle} color="gray.400" boxSize={3.5} />
                              <Text fontSize="xs" fontWeight="700" color="gray.500">{gPendente}</Text>
                            </HStack>
                          )}
                          <Badge
                            colorScheme={gPct >= 75 ? 'green' : gPct >= 50 ? 'yellow' : 'red'}
                            rounded="full"
                            fontSize="xs"
                          >
                            {gPct}%
                          </Badge>
                        </HStack>
                      </Flex>

                      <Divider borderColor="gray.100" />

                      {/* Lista de aulas */}
                      <VStack spacing={0} px={4} py={2} align="stretch">
                        {grupo.itens.map((p, idx) => (
                          <Flex
                            key={p.idpresenca}
                            align="center"
                            py={2}
                            gap={3}
                            borderBottom={idx < grupo.itens.length - 1 ? '1px solid' : 'none'}
                            borderColor="gray.50"
                          >
                            <Icon
                              as={p.situacao === 1 ? FiCheckCircle : p.situacao === 2 ? FiXCircle : FiAlertCircle}
                              color={p.situacao === 1 ? 'green.400' : p.situacao === 2 ? 'red.400' : 'gray.400'}
                              boxSize={4}
                              flexShrink={0}
                            />
                            <Text fontSize="sm" color="gray.600" flex="1">
                              {formatDataCurta(p.data_treino)}
                            </Text>
                            <Badge
                              colorScheme={p.situacao === 1 ? 'green' : p.situacao === 2 ? 'red' : 'gray'}
                              rounded="full"
                              fontSize="xs"
                              variant="subtle"
                            >
                              {p.situacao === 1 ? 'Presente' : p.situacao === 2 ? 'Falta' : 'Pendente'}
                            </Badge>
                          </Flex>
                        ))}
                      </VStack>
                    </Box>
                  )
                })}
              </VStack>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
