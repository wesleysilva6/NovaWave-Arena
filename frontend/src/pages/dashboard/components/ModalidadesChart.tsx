import { useMemo, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'

export interface ModalidadeData {
  modalidade: string
  total: number
}

interface Props {
  data: ModalidadeData[]
}

const colors = ['brand.500', 'green.400', 'purple.400', 'orange.400', 'cyan.400', 'red.400']

export default function ModalidadesChart({ data }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const total = useMemo(() => data.reduce((s, item) => s + item.total, 0), [data])

  return (
    <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={5} minH="260px">
      <Flex justify="space-between" mb={5}>
        <Box>
          <Text fontSize="md" fontWeight="800" color="gray.800">Alunos por modalidade</Text>
          <Text fontSize="xs" color="gray.400">Distribuicao da base ativa</Text>
        </Box>
        <Text fontSize="lg" fontWeight="800">{total}</Text>
      </Flex>

      <Flex direction="column" gap={3}>
        {data.length === 0 ? (
          <Text fontSize="sm" color="gray.400">Sem alunos ativos para exibir.</Text>
        ) : data.map((item, index) => {
          const pct = total > 0 ? (item.total / total) * 100 : 0
          const active = hover === index
          return (
            <Box key={item.modalidade} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} cursor="pointer">
              <Flex justify="space-between" mb={1}>
                <Text fontSize="sm" fontWeight="700" color={active ? 'gray.800' : 'gray.600'}>{item.modalidade}</Text>
                <Text fontSize="sm" fontWeight="800">{item.total}</Text>
              </Flex>
              <Box h="10px" bg="gray.100" rounded="full" overflow="hidden">
                <Box h="full" w={`${pct}%`} bg={colors[index % colors.length]} rounded="full" opacity={active ? 1 : 0.75} transition="all 0.2s" />
              </Box>
            </Box>
          )
        })}
      </Flex>
    </Box>
  )
}
