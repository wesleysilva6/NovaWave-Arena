import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiCalendar, FiClock } from 'react-icons/fi'
import type { Treino } from '../../../utils/types'
import { formatDate } from '../../../utils/formatters'

interface Props {
  treinos: Treino[]
  agendaSemana: Treino[]
  loading: boolean
}

export default function ListaTreinos({ treinos, agendaSemana, loading }: Props) {
  const porData = agendaSemana.reduce<Record<string, Treino[]>>((acc, treino) => {
    const data = treino.data ?? ''
    if (!acc[data]) acc[data] = []
    acc[data].push(treino)
    return acc
  }, {})
  const hoje = new Date().toISOString().slice(0, 10)

  return (
    <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
      <Flex px={6} py={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between">
        <HStack spacing={2}>
          <Icon as={FiCalendar} color="brand.500" />
          <Heading size="sm" color="gray.700">
            Aulas da Semana
          </Heading>
        </HStack>
        <Badge colorScheme="green" rounded="full" px={2} fontSize="xs">
          Hoje: {treinos.length}
        </Badge>
      </Flex>

      {loading ? (
        <VStack p={6} spacing={3}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} h="60px" w="full" rounded="lg" />
          ))}
        </VStack>
      ) : agendaSemana.length === 0 ? (
        <Flex p={8} justify="center" align="center" direction="column">
          <Icon as={FiCalendar} boxSize={10} color="gray.300" mb={3} />
          <Text color="gray.400" fontSize="sm">
            Nenhuma aula agendada nos proximos dias
          </Text>
        </Flex>
      ) : (
        <VStack spacing={0} align="stretch" maxH="520px" overflowY="auto">
          {Object.entries(porData).map(([data, items]) => (
            <Box key={data} borderBottom="1px solid" borderColor="gray.50">
              <Flex px={6} py={3} bg={data === hoje ? 'green.50' : 'gray.50'} align="center" justify="space-between">
                <Text fontSize="sm" fontWeight="800" color="gray.700">
                  {items[0]?.dia_semana} - {formatDate(data)}
                </Text>
                <Badge colorScheme={data === hoje ? 'green' : 'gray'} rounded="full">
                  {items.length} aula{items.length !== 1 ? 's' : ''}
                </Badge>
              </Flex>
              {items.map((t, i) => (
                <Flex key={`${data}-${i}`} w="full" px={6} py={3} align="center" justify="space-between" _hover={{ bg: 'gray.50' }}>
                  <HStack spacing={3}>
                    <Flex w={9} h={9} rounded="xl" bg="brand.50" align="center" justify="center">
                      <Icon as={FiClock} color="brand.500" />
                    </Flex>
                    <Box>
                      <Text fontSize="sm" fontWeight="700" color="gray.700">{t.turma}</Text>
                      <Text fontSize="xs" color="gray.400">{t.modalidade}</Text>
                    </Box>
                  </HStack>
                  <VStack spacing={0} align="end">
                    <Text fontSize="sm" fontWeight="700" color="brand.600">{t.horario}</Text>
                    <Text fontSize="xs" color="gray.400">{t.alunos} aluno{t.alunos !== 1 ? 's' : ''}</Text>
                  </VStack>
                </Flex>
              ))}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  )
}
