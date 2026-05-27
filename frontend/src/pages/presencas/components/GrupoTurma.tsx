import { useState } from 'react'
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiAlertCircle, FiCheckCircle, FiClock, FiMapPin, FiUser, FiXCircle } from 'react-icons/fi'
import type { TurmaPresenca, Presenca, AulaAgrupada } from '../../../service/presencas'
import {
  agruparPorData,
  formatDataAula,
  formatHorario,
  hojeLocalISO,
  isHoje,
  isFutura,
} from '../../../service/presencas'

interface Props {
  turma: TurmaPresenca
  onMarcar: (idpresenca: number, situacao: number) => Promise<void>
}

function statusInfo(situacao: number) {
  if (situacao === 1) return { label: 'Presente', color: 'green', icon: FiCheckCircle }
  if (situacao === 2) return { label: 'Faltou', color: 'red', icon: FiXCircle }
  return { label: 'Pendente', color: 'gray', icon: FiAlertCircle }
}

function ListaAula({
  aula,
  onMarcar,
}: {
  aula: AulaAgrupada
  onMarcar: (idpresenca: number, situacao: number) => Promise<void>
}) {
  const [marcando, setMarcando] = useState<Set<number>>(new Set())
  const hoje = isHoje(aula.data_treino)
  const futura = isFutura(aula.data_treino)
  const atrasada = aula.data_treino < hojeLocalISO()
  const presentes = aula.presencas.filter((p) => p.situacao === 1).length
  const faltas = aula.presencas.filter((p) => p.situacao === 2).length
  const pendentes = aula.presencas.filter((p) => p.situacao === 0).length

  async function handleMarcar(p: Presenca, novo: number) {
    if (p.situacao === novo) return

    setMarcando((prev) => new Set(prev).add(p.idpresenca))
    try {
      await onMarcar(p.idpresenca, novo)
    } finally {
      setMarcando((prev) => {
        const s = new Set(prev)
        s.delete(p.idpresenca)
        return s
      })
    }
  }

  const borderColor = hoje ? 'brand.200' : atrasada ? 'orange.200' : futura ? 'purple.200' : 'gray.100'
  const headerBg = hoje ? 'brand.50' : atrasada ? 'orange.50' : futura ? 'purple.50' : 'gray.50'

  return (
    <Box border="1px solid" borderColor={borderColor} rounded="xl" mb={3} overflow="hidden">
      <Flex px={4} py={3} bg={headerBg} align="center" justify="space-between" gap={3} wrap="wrap">
        <HStack spacing={2} flexWrap="wrap">
          {hoje && (
            <Badge colorScheme="brand" rounded="full" fontSize="xs">
              Hoje
            </Badge>
          )}
          {atrasada && pendentes > 0 && (
            <Badge colorScheme="orange" rounded="full" fontSize="xs">
              Pendente anterior
            </Badge>
          )}
          {futura && (
            <Badge colorScheme="purple" rounded="full" fontSize="xs">
              Proxima aula
            </Badge>
          )}
          <Text fontWeight="600" fontSize="sm" color="gray.700">
            {formatDataAula(aula.data_treino)}
          </Text>
        </HStack>
        <HStack spacing={2} flexShrink={0}>
          <Badge colorScheme="green" rounded="full" fontSize="xs">
            {presentes} presentes
          </Badge>
          {faltas > 0 && (
            <Badge colorScheme="red" rounded="full" fontSize="xs">
              {faltas} faltas
            </Badge>
          )}
          {pendentes > 0 && (
            <Badge colorScheme="gray" rounded="full" fontSize="xs">
              {pendentes} pendentes
            </Badge>
          )}
        </HStack>
      </Flex>

      <VStack spacing={0} align="stretch" px={4} py={2}>
        {aula.presencas.map((p, idx) => {
          const st = statusInfo(p.situacao)

          return (
            <Flex
              key={p.idpresenca}
              align="center"
              py={2.5}
              borderBottom={idx < aula.presencas.length - 1 ? '1px solid' : 'none'}
              borderColor="gray.50"
              gap={3}
              wrap={{ base: 'wrap', md: 'nowrap' }}
            >
              {marcando.has(p.idpresenca) ? (
                <Spinner size="sm" color="brand.400" flexShrink={0} />
              ) : (
                <Icon as={st.icon} color={`${st.color}.400`} boxSize={4} flexShrink={0} />
              )}
              <Avatar size="xs" name={p.aluno_nome} bg="brand.100" color="brand.700" flexShrink={0} />
              <Box flex="1" minW="160px">
                <Text
                  fontSize="sm"
                  fontWeight={p.situacao === 1 ? '600' : '500'}
                  color={p.situacao === 0 ? 'gray.500' : 'gray.800'}
                >
                  {p.aluno_nome}
                </Text>
                <Badge colorScheme={st.color} rounded="full" fontSize="xs" variant="subtle">
                  {st.label}
                </Badge>
              </Box>
              <ButtonGroup size="xs" isAttached variant="outline" flexShrink={0}>
                <Button
                  colorScheme="green"
                  variant={p.situacao === 1 ? 'solid' : 'outline'}
                  onClick={() => handleMarcar(p, 1)}
                  isDisabled={marcando.has(p.idpresenca)}
                >
                  Presente
                </Button>
                <Button
                  colorScheme="red"
                  variant={p.situacao === 2 ? 'solid' : 'outline'}
                  onClick={() => handleMarcar(p, 2)}
                  isDisabled={marcando.has(p.idpresenca)}
                >
                  Faltou
                </Button>
                <Button
                  colorScheme="gray"
                  variant={p.situacao === 0 ? 'solid' : 'outline'}
                  onClick={() => handleMarcar(p, 0)}
                  isDisabled={marcando.has(p.idpresenca)}
                >
                  Pendente
                </Button>
              </ButtonGroup>
            </Flex>
          )
        })}
      </VStack>
    </Box>
  )
}

export default function GrupoTurma({ turma, onMarcar }: Props) {
  const aulas = agruparPorData(turma.presencas)
  const hoje = hojeLocalISO()
  const aulaHoje = aulas.find((a) => a.data_treino === hoje)
  const presentesHoje = aulaHoje ? aulaHoje.presencas.filter((p) => p.situacao === 1).length : null
  const faltasHoje = aulaHoje ? aulaHoje.presencas.filter((p) => p.situacao === 2).length : null
  const pendentesAtrasadas = aulas
    .filter((a) => a.data_treino < hoje)
    .reduce((total, aula) => total + aula.presencas.filter((p) => p.situacao === 0).length, 0)

  return (
    <AccordionItem
      bg="white"
      rounded="2xl"
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
    >
      <AccordionButton px={5} py={4} _hover={{ bg: 'gray.50' }}>
        <HStack flex="1" spacing={4} minW={0}>
          <Box textAlign="left" flex="1" minW={0}>
            <HStack spacing={2} flexWrap="wrap">
              <Text fontWeight="700" fontSize="sm" color="gray.800">
                {turma.nome}
              </Text>
              <Badge colorScheme="brand" variant="subtle" rounded="full" fontSize="xs">
                {turma.modalidade_nome}
              </Badge>
            </HStack>
            <HStack spacing={3} mt={0.5} flexWrap="wrap">
              <HStack spacing={1}>
                <Icon as={FiClock} boxSize={3} color="gray.400" />
                <Text fontSize="xs" color="gray.400">
                  {formatHorario(turma.horario)}
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FiMapPin} boxSize={3} color="gray.400" />
                <Text fontSize="xs" color="gray.400">
                  {turma.dias_semana}
                </Text>
              </HStack>
              {turma.professor && (
                <HStack spacing={1}>
                  <Icon as={FiUser} boxSize={3} color="gray.400" />
                  <Text fontSize="xs" color="gray.400">
                    {turma.professor}
                  </Text>
                </HStack>
              )}
            </HStack>
          </Box>

          <HStack spacing={2} flexShrink={0} mr={2} flexWrap="wrap" justify="flex-end">
            {pendentesAtrasadas > 0 && (
              <Badge colorScheme="orange" rounded="full" fontSize="xs">
                {pendentesAtrasadas} atrasada{pendentesAtrasadas !== 1 ? 's' : ''}
              </Badge>
            )}
            {aulaHoje !== undefined && (
              <Badge colorScheme="green" rounded="full" fontSize="xs">
                Hoje: {presentesHoje} pres. / {faltasHoje} falt.
              </Badge>
            )}
            <Badge colorScheme="gray" rounded="full" fontSize="xs" variant="subtle">
              {turma.alunos_count} aluno{Number(turma.alunos_count) !== 1 ? 's' : ''}
            </Badge>
          </HStack>
        </HStack>
        <AccordionIcon color="gray.400" />
      </AccordionButton>

      <AccordionPanel px={5} pt={2} pb={4}>
        {aulas.length === 0 ? (
          <Text fontSize="sm" color="gray.400" textAlign="center" py={4}>
            Nenhuma aula registrada neste periodo.
          </Text>
        ) : (
          aulas.map((aula) => (
            <ListaAula key={aula.data_treino} aula={aula} onMarcar={onMarcar} />
          ))
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}
