import { Box, Flex, Icon, SimpleGrid, Text } from '@chakra-ui/react'
import { FiDollarSign, FiTrendingDown, FiTrendingUp, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi'
import { formatCurrency } from '../../../utils/formatters'
import type { AnaliseData } from '../../../service/analises'

interface Props {
  resumo: AnaliseData['resumo']
  loading: boolean
}

export default function KpiAnalises({ resumo, loading }: Props) {
  const cards = [
    { label: 'Receita', value: formatCurrency(resumo.receita), sub: 'pagamentos recebidos', icon: FiDollarSign, bg: 'green.50', color: 'green.500' },
    { label: 'Despesas', value: formatCurrency(resumo.gastos), sub: 'custos no periodo', icon: FiTrendingDown, bg: 'red.50', color: 'red.500' },
    { label: 'Resultado', value: formatCurrency(resumo.resultado), sub: resumo.resultado >= 0 ? 'saldo positivo' : 'saldo negativo', icon: FiTrendingUp, bg: resumo.resultado >= 0 ? 'cyan.50' : 'red.50', color: resumo.resultado >= 0 ? 'cyan.500' : 'red.500' },
    { label: 'Em aberto', value: formatCurrency(resumo.em_aberto), sub: 'mensalidades pendentes', icon: FiClock, bg: 'orange.50', color: 'orange.500' },
    { label: 'Alunos', value: resumo.alunos, sub: `+${resumo.novos_alunos} no periodo`, icon: FiUsers, bg: 'brand.50', color: 'brand.500' },
    { label: 'Presenca', value: `${resumo.taxa_presenca}%`, sub: `${resumo.presencas_confirmadas}/${resumo.aulas_geradas} aulas`, icon: FiCheckCircle, bg: 'purple.50', color: 'purple.500' },
  ]

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 6 }} spacing={4} mb={5}>
      {cards.map((card) => (
        <Flex key={card.label} bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={4} gap={3} align="center" opacity={loading ? 0.55 : 1}>
          <Flex w={10} h={10} rounded="xl" bg={card.bg} align="center" justify="center">
            <Icon as={card.icon} boxSize={5} color={card.color} />
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
