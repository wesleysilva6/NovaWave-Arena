import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiCheckCircle, FiDollarSign, FiUsers } from 'react-icons/fi'
import { formatCurrency } from '../../../utils/formatters'

interface Props {
  totalAtivos: number
  totalInativos: number
  totalFuncionarios: number
  folhaMes: number
  loading: boolean
}

export default function ResumoCards({ totalAtivos, totalInativos, totalFuncionarios, folhaMes, loading }: Props) {
  const cards = [
    {
      value: totalAtivos,
      sub: `${totalInativos} inativo${totalInativos !== 1 ? 's' : ''}`,
      icon: FiCheckCircle,
      iconBg: 'green.50',
      iconColor: 'green.500',
      valueColor: 'green.600',
    },
    {
      value: formatCurrency(folhaMes),
      sub: 'Folha do mes',
      icon: FiDollarSign,
      iconBg: 'brand.50',
      iconColor: 'brand.500',
      valueColor: 'brand.600',
    },
    {
      value: totalFuncionarios,
      sub: 'Total de funcionarios',
      icon: FiUsers,
      iconBg: 'purple.50',
      iconColor: 'purple.500',
      valueColor: 'purple.600',
    },
  ]

  return (
    <Flex gap={4} mb={6} wrap="wrap">
      {cards.map((card, index) => (
        <Flex
          key={index}
          bg="white"
          rounded="2xl"
          px={5}
          py={4}
          align="center"
          gap={3}
          border="1px solid"
          borderColor="gray.100"
          flex="1"
          minW="220px"
          opacity={loading ? 0.5 : 1}
          transition="opacity 0.2s"
        >
          <Flex w={10} h={10} rounded="xl" bg={card.iconBg} align="center" justify="center">
            <Icon as={card.icon} boxSize={5} color={card.iconColor} />
          </Flex>
          <Box>
            <Text fontSize="lg" fontWeight="bold" color={card.valueColor} lineHeight="1">
              {card.value}
            </Text>
            <Text fontSize="xs" color="gray.400" fontWeight="500" mt={0.5}>
              {card.sub}
            </Text>
          </Box>
        </Flex>
      ))}
    </Flex>
  )
}
