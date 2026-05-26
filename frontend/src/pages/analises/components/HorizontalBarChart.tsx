import { useMemo, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import ChartCard from './ChartCard'

interface Item {
  label: string
  value: number
  sub?: string
}

interface Props {
  title: string
  subtitle: string
  data: Item[]
  formatValue?: (value: number) => string
}

const colors = ['brand.500', 'green.400', 'purple.400', 'orange.400', 'cyan.400', 'red.400', 'pink.400']

export default function HorizontalBarChart({ title, subtitle, data, formatValue = (v) => String(v) }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.value)), [data])

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <Flex direction="column" gap={3}>
        {data.length === 0 ? (
          <Text fontSize="sm" color="gray.400">Sem dados para o filtro selecionado.</Text>
        ) : data.map((item, index) => {
          const active = hover === index
          return (
            <Box key={`${item.label}-${index}`} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
              <Flex justify="space-between" mb={1} gap={3}>
                <Box minW={0}>
                  <Text fontSize="sm" fontWeight="700" color={active ? 'gray.800' : 'gray.600'} noOfLines={1}>{item.label}</Text>
                  {item.sub && <Text fontSize="xs" color="gray.400" noOfLines={1}>{item.sub}</Text>}
                </Box>
                <Text fontSize="sm" fontWeight="800">{formatValue(item.value)}</Text>
              </Flex>
              <Box h="10px" bg="gray.100" rounded="full" overflow="hidden">
                <Box h="full" w={`${(item.value / max) * 100}%`} bg={colors[index % colors.length]} rounded="full" opacity={active ? 1 : 0.75} transition="all 0.2s" />
              </Box>
            </Box>
          )
        })}
      </Flex>
    </ChartCard>
  )
}
