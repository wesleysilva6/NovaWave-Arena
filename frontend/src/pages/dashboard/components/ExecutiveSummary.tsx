import { Box, Flex, Text, Button, HStack } from '@chakra-ui/react'
import { FiCalendar, FiDollarSign } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../../utils/formatters'

interface Props {
  receita: number
  gastos: number
  aulasHoje: number
  vencimentos: number
}

export default function ExecutiveSummary({ receita, gastos, aulasHoje, vencimentos }: Props) {
  const navigate = useNavigate()
  const resultado = receita - gastos

  return (
    <Flex
      bg="linear-gradient(135deg, #0d1b2a 0%, #12375f 55%, #1890ff 100%)"
      color="white"
      rounded="2xl"
      p={{ base: 5, md: 6 }}
      mb={5}
      align={{ base: 'stretch', md: 'center' }}
      justify="space-between"
      gap={4}
      direction={{ base: 'column', md: 'row' }}
    >
      <Box>
        <Text fontSize="xs" color="whiteAlpha.700" fontWeight="700" textTransform="uppercase">Visao executiva</Text>
        <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" lineHeight="1.1" mt={1}>
          {resultado >= 0 ? 'Operação com saldo positivo' : 'Atenção ao saldo do mês'}
        </Text>
        <Text color="whiteAlpha.700" fontSize="sm" mt={2}>
          Hoje existem {aulasHoje} aula{aulasHoje !== 1 ? 's' : ''} e {vencimentos} mensalidade{vencimentos !== 1 ? 's' : ''} perto do vencimento.
        </Text>
      </Box>

      <HStack spacing={3} align="stretch" wrap="wrap">
        <Box bg="whiteAlpha.200" rounded="xl" px={4} py={3} minW="150px">
          <Text fontSize="xs" color="whiteAlpha.700">Resultado</Text>
          <Text fontWeight="900" fontSize="lg">{formatCurrency(resultado)}</Text>
        </Box>
        <Button leftIcon={<FiDollarSign />} rounded="xl" colorScheme="whiteAlpha" onClick={() => navigate('/mensalidades')}>
          Mensalidades
        </Button>
        <Button leftIcon={<FiCalendar />} rounded="xl" bg="white" color="brand.600" _hover={{ bg: 'whiteAlpha.900' }} onClick={() => navigate('/presencas')}>
          Agendas
        </Button>
      </HStack>
    </Flex>
  )
}
