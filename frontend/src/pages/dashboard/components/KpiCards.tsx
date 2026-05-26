import { Flex, Icon, SimpleGrid, Text, Box } from '@chakra-ui/react'
import { FiAlertTriangle, FiCalendar, FiDollarSign, FiTrendingDown, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { formatCurrency } from '../../../utils/formatters'

interface Stats {
  total_alunos: number
  treinos_hoje: number
  receita_mes: number
  gastos_mes: number
  vencimentos_proximos: number
  novos_alunos_mes: number
}

interface Props {
  stats: Stats
  loading: boolean
}

export default function KpiCards({ stats, loading }: Props) {
  const resultado = stats.receita_mes - stats.gastos_mes
  const cards = [
    { label: 'Alunos ativos', value: stats.total_alunos, sub: `+${stats.novos_alunos_mes} no mes`, icon: FiUsers, color: 'brand.500', bg: 'brand.50' },
    { label: 'Aulas hoje', value: stats.treinos_hoje, sub: 'agenda do dia', icon: FiCalendar, color: 'green.500', bg: 'green.50' },
    { label: 'Receita', value: formatCurrency(stats.receita_mes), sub: 'pagamentos no mes', icon: FiDollarSign, color: 'teal.500', bg: 'teal.50' },
    { label: 'Despesas', value: formatCurrency(stats.gastos_mes), sub: 'gastos no mes', icon: FiTrendingDown, color: 'red.500', bg: 'red.50' },
    { label: 'Resultado', value: formatCurrency(resultado), sub: resultado >= 0 ? 'saldo positivo' : 'saldo negativo', icon: FiTrendingUp, color: resultado >= 0 ? 'cyan.500' : 'red.500', bg: resultado >= 0 ? 'cyan.50' : 'red.50' },
    { label: 'A vencer', value: stats.vencimentos_proximos, sub: 'proximos 7 dias', icon: FiAlertTriangle, color: 'orange.500', bg: 'orange.50' },
  ]

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 6 }} spacing={4} mb={5}>
      {cards.map((card) => (
        <Flex key={card.label} bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={4} gap={3} align="center" opacity={loading ? 0.55 : 1}>
          <Flex w={10} h={10} rounded="xl" bg={card.bg} align="center" justify="center" flexShrink={0}>
            <Icon as={card.icon} color={card.color} boxSize={5} />
          </Flex>
          <Box minW={0}>
            <Text fontSize="xs" color="gray.400" fontWeight="700" textTransform="uppercase" noOfLines={1}>{card.label}</Text>
            <Text fontSize="lg" color="gray.800" fontWeight="800" noOfLines={1}>{card.value}</Text>
            <Text fontSize="xs" color="gray.400" noOfLines={1}>{card.sub}</Text>
          </Box>
        </Flex>
      ))}
    </SimpleGrid>
  )
}
