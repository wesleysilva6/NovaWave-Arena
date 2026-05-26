import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Tooltip,
  Skeleton,
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { formatCurrency } from '../../../utils/formatters'
import type { Gasto } from '../../../service/gastos'

interface Props {
  gastos: Gasto[]
  loading: boolean
  onEditar: (g: Gasto) => void
  onDeletar: (g: Gasto) => void
}

const categoriaCores: Record<string, string> = {
  'Manutenção': 'orange',
  'Material esportivo': 'blue',
  'Limpeza': 'teal',
  'Energia': 'yellow',
  'Água': 'cyan',
  'Internet': 'purple',
  'Aluguel': 'red',
  'Salários': 'green',
  'Salarios': 'green',
  'Marketing': 'pink',
  'Outros': 'gray',
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export default function TabelaGastos({ gastos, loading, onEditar, onDeletar }: Props) {
  if (loading) {
    return (
      <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={4}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} h="48px" mb={2} rounded="lg" />
        ))}
      </Box>
    )
  }

  if (gastos.length === 0) {
    return (
      <Flex
        bg="white"
        rounded="2xl"
        border="1px solid"
        borderColor="gray.100"
        p={10}
        justify="center"
        align="center"
        direction="column"
        gap={2}
      >
        <Text color="gray.400" fontSize="sm" fontWeight="500">
          Nenhum gasto encontrado
        </Text>
        <Text color="gray.300" fontSize="xs">
          Adicione gastos usando o botão acima
        </Text>
      </Flex>
    )
  }

  return (
    <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" overflow="hidden">
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr bg="gray.50">
              <Th fontSize="xs" color="gray.500" py={3}>Descrição</Th>
              <Th fontSize="xs" color="gray.500" py={3}>Categoria</Th>
              <Th fontSize="xs" color="gray.500" py={3} isNumeric>Valor</Th>
              <Th fontSize="xs" color="gray.500" py={3}>Data</Th>
              <Th fontSize="xs" color="gray.500" py={3}>Observação</Th>
              <Th fontSize="xs" color="gray.500" py={3} w="90px" textAlign="center">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {gastos.map((g) => (
              <Tr
                key={g.idgasto}
                _hover={{ bg: 'gray.50' }}
                transition="background 0.15s"
              >
                <Td py={3}>
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    {g.descricao}
                  </Text>
                </Td>
                <Td py={3}>
                  <Badge
                    colorScheme={categoriaCores[g.categoria] ?? 'gray'}
                    rounded="full"
                    px={2.5}
                    py={0.5}
                    fontSize="xs"
                    fontWeight="600"
                  >
                    {g.categoria}
                  </Badge>
                </Td>
                <Td py={3} isNumeric>
                  <Text fontSize="sm" fontWeight="700" color="red.500">
                    {formatCurrency(g.valor)}
                  </Text>
                </Td>
                <Td py={3}>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(g.data)}
                  </Text>
                </Td>
                <Td py={3}>
                  <Text fontSize="xs" color="gray.400" noOfLines={1} maxW="200px">
                    {g.observacao || '—'}
                  </Text>
                </Td>
                <Td py={3} textAlign="center">
                  <Flex gap={1} justify="center">
                    <Tooltip label="Editar" hasArrow>
                      <IconButton
                        aria-label="Editar gasto"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="brand"
                        onClick={() => onEditar(g)}
                      />
                    </Tooltip>
                    <Tooltip label="Excluir" hasArrow>
                      <IconButton
                        aria-label="Excluir gasto"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => onDeletar(g)}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}
