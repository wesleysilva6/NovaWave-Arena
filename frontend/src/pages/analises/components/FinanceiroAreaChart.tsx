import { useMemo, useState } from 'react'
import { Box, Flex, HStack, Text, Badge } from '@chakra-ui/react'
import { formatCurrency } from '../../../utils/formatters'
import ChartCard from './ChartCard'
import type { AnaliseData } from '../../../service/analises'

interface Props {
  data: AnaliseData['financeiro_mensal']
}

export default function FinanceiroAreaChart({ data }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const max = useMemo(() => Math.max(1, ...data.flatMap((d) => [d.receita, d.gastos, d.em_aberto])), [data])
  const selected = hover !== null ? data[hover] : data[data.length - 1]

  return (
    <ChartCard
      title="Evolucao financeira"
      subtitle="Receitas, despesas e valores em aberto por mes"
      action={selected && <Text fontSize="sm" fontWeight="800">{selected.label}</Text>}
    >
      <HStack spacing={3} mb={5}>
        <Badge colorScheme="green" rounded="full">Receita</Badge>
        <Badge colorScheme="red" rounded="full">Despesas</Badge>
        <Badge colorScheme="orange" rounded="full">Aberto</Badge>
      </HStack>

      <Flex h="230px" align="end" gap={3}>
        {data.map((item, index) => {
          const active = hover === index || (hover === null && index === data.length - 1)
          return (
            <Flex key={item.mes_referencia} direction="column" flex={1} h="full" justify="end" align="center" gap={2} cursor="pointer" onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
              <Flex align="end" justify="center" gap={1} h="180px" w="full">
                <Box w="28%" roundedTop="lg" bg={active ? 'green.400' : 'green.200'} h={`${Math.max(4, (item.receita / max) * 100)}%`} />
                <Box w="28%" roundedTop="lg" bg={active ? 'red.400' : 'red.200'} h={`${Math.max(4, (item.gastos / max) * 100)}%`} />
                <Box w="28%" roundedTop="lg" bg={active ? 'orange.400' : 'orange.200'} h={`${Math.max(4, (item.em_aberto / max) * 100)}%`} />
              </Flex>
              <Text fontSize="xs" color={active ? 'gray.800' : 'gray.400'} fontWeight="700">{item.label.slice(0, 2)}</Text>
            </Flex>
          )
        })}
      </Flex>

      {selected && (
        <Flex gap={3} mt={4} wrap="wrap">
          <Box bg="green.50" rounded="xl" p={3} flex={1} minW="130px"><Text fontSize="xs" color="green.600">Receita</Text><Text fontWeight="800">{formatCurrency(selected.receita)}</Text></Box>
          <Box bg="red.50" rounded="xl" p={3} flex={1} minW="130px"><Text fontSize="xs" color="red.600">Despesas</Text><Text fontWeight="800">{formatCurrency(selected.gastos)}</Text></Box>
          <Box bg="orange.50" rounded="xl" p={3} flex={1} minW="130px"><Text fontSize="xs" color="orange.600">Aberto</Text><Text fontWeight="800">{formatCurrency(selected.em_aberto)}</Text></Box>
        </Flex>
      )}
    </ChartCard>
  )
}
