import { useMemo, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'

export interface AulasDia {
  dia_iso: number
  dia_semana: string
  aulas: number
  alunos_previstos: number
}

interface Props {
  data: AulasDia[]
}

export default function AulasDiaChart({ data }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.aulas)), [data])
  const ativo = hover !== null ? data[hover] : data.find((d) => d.dia_iso === new Date().getDay() || (new Date().getDay() === 0 && d.dia_iso === 7)) ?? data[0]

  return (
    <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={5} minH="260px">
      <Flex justify="space-between" align="start" mb={5}>
        <Box>
          <Text fontSize="md" fontWeight="800" color="gray.800">Carga semanal</Text>
          <Text fontSize="xs" color="gray.400">Dias com maior volume de aulas</Text>
        </Box>
        {ativo && (
          <Box textAlign="right">
            <Text fontSize="lg" fontWeight="800" color="brand.600">{ativo.aulas}</Text>
            <Text fontSize="xs" color="gray.400">aulas em {ativo.dia_semana}</Text>
          </Box>
        )}
      </Flex>

      <Flex h="150px" align="end" gap={3}>
        {data.map((item, index) => {
          const active = hover === index
          return (
            <Flex key={item.dia_iso} direction="column" flex={1} align="center" gap={2} cursor="pointer" onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
              <Box w="full" rounded="xl" bg={active ? 'brand.500' : 'brand.100'} h={`${Math.max(10, (item.aulas / max) * 100)}px`} transition="all 0.2s" />
              <Text fontSize="xs" fontWeight="700" color={active ? 'brand.600' : 'gray.400'}>{item.dia_semana}</Text>
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}
