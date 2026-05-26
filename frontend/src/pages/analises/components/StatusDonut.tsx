import { Box, Flex, Text, Badge, VStack } from '@chakra-ui/react'
import { formatCurrency } from '../../../utils/formatters'
import ChartCard from './ChartCard'
import type { AnaliseData } from '../../../service/analises'

interface Props {
  data: AnaliseData['mensalidades_status']
}

const labels: Record<number, { label: string; color: string; hex: string }> = {
  0: { label: 'Pendente', color: 'yellow', hex: '#ecc94b' },
  1: { label: 'Pago', color: 'green', hex: '#48bb78' },
  2: { label: 'Atrasado', color: 'red', hex: '#f56565' },
}

export default function StatusDonut({ data }: Props) {
  const total = data.reduce((s, item) => s + item.quantidade, 0)
  let cursor = 0
  const gradient = data.length === 0 ? '#edf2f7 0 100%' : data.map((item) => {
    const pct = total > 0 ? (item.quantidade / total) * 100 : 0
    const start = cursor
    cursor += pct
    return `${labels[item.situacao]?.hex ?? '#a0aec0'} ${start}% ${cursor}%`
  }).join(', ')

  return (
    <ChartCard title="Status das mensalidades" subtitle="Distribuicao por quantidade e valor">
      <Flex align="center" gap={6} direction={{ base: 'column', md: 'row' }}>
        <Flex
          w="170px"
          h="170px"
          rounded="full"
          bg={`conic-gradient(${gradient})`}
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Flex w="105px" h="105px" rounded="full" bg="white" align="center" justify="center" direction="column">
            <Text fontSize="2xl" fontWeight="900">{total}</Text>
            <Text fontSize="xs" color="gray.400">parcelas</Text>
          </Flex>
        </Flex>
        <VStack align="stretch" flex={1} spacing={3}>
          {data.map((item) => {
            const cfg = labels[item.situacao] ?? { label: 'Outro', color: 'gray' }
            return (
              <Flex key={item.situacao} justify="space-between" align="center" gap={3}>
                <Badge colorScheme={cfg.color} rounded="full">{cfg.label}</Badge>
                <Box textAlign="right">
                  <Text fontSize="sm" fontWeight="800">{formatCurrency(item.total)}</Text>
                  <Text fontSize="xs" color="gray.400">{item.quantidade} parcela{item.quantidade !== 1 ? 's' : ''}</Text>
                </Box>
              </Flex>
            )
          })}
        </VStack>
      </Flex>
    </ChartCard>
  )
}
