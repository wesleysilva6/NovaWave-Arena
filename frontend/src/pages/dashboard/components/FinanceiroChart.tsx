import { useMemo, useState } from 'react'
import { Box, Flex, HStack, Text, Badge } from '@chakra-ui/react'
import { formatCurrency } from '../../../utils/formatters'

export interface FinanceiroMes {
  mes_referencia: string
  label: string
  receita: number
  gastos: number
}

interface Props {
  data: FinanceiroMes[]
}

export default function FinanceiroChart({ data }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const max = useMemo(() => Math.max(1, ...data.flatMap((d) => [d.receita, d.gastos])), [data])
  const selecionado = hover !== null ? data[hover] : data[data.length - 1]

  return (
    <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={5} minH="360px">
      <Flex justify="space-between" align="start" mb={5} gap={4}>
        <Box>
          <Text fontSize="md" fontWeight="800" color="gray.800">Fluxo financeiro</Text>
          <Text fontSize="xs" color="gray.400">Receita, despesas e saldo dos ultimos 6 meses</Text>
        </Box>
        {selecionado && (
          <Box textAlign="right">
            <Text fontSize="xs" color="gray.400">{selecionado.label}</Text>
            <Text fontSize="lg" fontWeight="800" color={(selecionado.receita - selecionado.gastos) >= 0 ? 'green.500' : 'red.500'}>
              {formatCurrency(selecionado.receita - selecionado.gastos)}
            </Text>
          </Box>
        )}
      </Flex>

      <HStack spacing={4} mb={4}>
        <Badge colorScheme="green" rounded="full">Receita</Badge>
        <Badge colorScheme="red" rounded="full">Despesas</Badge>
      </HStack>

      <Flex h="220px" align="end" gap={3} px={1}>
        {data.map((item, index) => {
          const active = hover === index || (hover === null && index === data.length - 1)
          return (
            <Flex key={item.mes_referencia} direction="column" align="center" flex={1} h="full" justify="end" gap={2} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} cursor="pointer">
              <Flex align="end" gap={1} h="170px" w="full" justify="center">
                <Box w="36%" roundedTop="lg" bg={active ? 'green.400' : 'green.200'} h={`${Math.max(6, (item.receita / max) * 100)}%`} transition="all 0.2s" />
                <Box w="36%" roundedTop="lg" bg={active ? 'red.400' : 'red.200'} h={`${Math.max(6, (item.gastos / max) * 100)}%`} transition="all 0.2s" />
              </Flex>
              <Text fontSize="xs" color={active ? 'gray.800' : 'gray.400'} fontWeight={active ? '800' : '600'}>
                {item.label.slice(0, 2)}
              </Text>
            </Flex>
          )
        })}
      </Flex>

      {selecionado && (
        <Flex mt={4} gap={3} wrap="wrap">
          <Box bg="green.50" rounded="xl" px={4} py={3} flex={1} minW="150px">
            <Text fontSize="xs" color="green.600" fontWeight="700">Receita</Text>
            <Text fontSize="md" fontWeight="800">{formatCurrency(selecionado.receita)}</Text>
          </Box>
          <Box bg="red.50" rounded="xl" px={4} py={3} flex={1} minW="150px">
            <Text fontSize="xs" color="red.600" fontWeight="700">Despesas</Text>
            <Text fontSize="md" fontWeight="800">{formatCurrency(selecionado.gastos)}</Text>
          </Box>
        </Flex>
      )}
    </Box>
  )
}
