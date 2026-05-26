import {
  Badge,
  Box,
  Flex,
  IconButton,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import type { Funcionario } from '../../../service/funcionarios'
import { formatCurrency, formatPhone } from '../../../utils/formatters'

interface Props {
  funcionarios: Funcionario[]
  loading: boolean
  onEditar: (funcionario: Funcionario) => void
  onDeletar: (funcionario: Funcionario) => void
}

export default function TabelaFuncionarios({ funcionarios, loading, onEditar, onDeletar }: Props) {
  if (loading) {
    return (
      <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={4}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} h="48px" mb={2} rounded="lg" />
        ))}
      </Box>
    )
  }

  if (funcionarios.length === 0) {
    return (
      <Flex bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={10} justify="center" align="center" direction="column" gap={2}>
        <Text color="gray.400" fontSize="sm" fontWeight="500">Nenhum funcionario encontrado</Text>
        <Text color="gray.300" fontSize="xs">Adicione funcionarios usando o botao acima</Text>
      </Flex>
    )
  }

  return (
    <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" overflow="hidden">
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr bg="gray.50">
              <Th fontSize="xs" color="gray.500" py={3}>Nome</Th>
              <Th fontSize="xs" color="gray.500" py={3}>Cargo</Th>
              <Th fontSize="xs" color="gray.500" py={3}>Contato</Th>
              <Th fontSize="xs" color="gray.500" py={3} isNumeric>Salario</Th>
              <Th fontSize="xs" color="gray.500" py={3}>Status</Th>
              <Th fontSize="xs" color="gray.500" py={3} w="90px" textAlign="center">Acoes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {funcionarios.map((f) => (
              <Tr key={f.idfuncionario} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                <Td py={3}>
                  <Text fontSize="sm" fontWeight="600" color="gray.700">{f.nome}</Text>
                </Td>
                <Td py={3}>
                  <Badge colorScheme="brand" rounded="full" px={2.5} py={0.5} fontSize="xs" fontWeight="600">
                    {f.cargo}
                  </Badge>
                </Td>
                <Td py={3}>
                  <Text fontSize="sm" color="gray.500">{f.telefone ? formatPhone(f.telefone) : f.email || '-'}</Text>
                </Td>
                <Td py={3} isNumeric>
                  <Text fontSize="sm" fontWeight="700" color="gray.700">{formatCurrency(f.salario)}</Text>
                </Td>
                <Td py={3}>
                  <Badge colorScheme={f.situacao === 1 ? 'green' : 'gray'} rounded="full" px={2.5} py={0.5} fontSize="xs" fontWeight="600">
                    {f.situacao === 1 ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Td>
                <Td py={3} textAlign="center">
                  <Flex gap={1} justify="center">
                    <Tooltip label="Editar" hasArrow>
                      <IconButton aria-label="Editar funcionario" icon={<FiEdit2 />} size="sm" variant="ghost" colorScheme="brand" onClick={() => onEditar(f)} />
                    </Tooltip>
                    <Tooltip label="Excluir" hasArrow>
                      <IconButton aria-label="Excluir funcionario" icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={() => onDeletar(f)} />
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
