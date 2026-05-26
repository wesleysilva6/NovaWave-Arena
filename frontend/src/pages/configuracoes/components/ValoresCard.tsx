import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiDollarSign, FiSave } from 'react-icons/fi'
import { maskCurrency } from '../../../utils/formatters'

interface Props {
  valorMensalidade: string
  valorAulaAvulsa: string
  diasLembrete: string
  saving: boolean
  onValorMensalidadeChange: (v: string) => void
  onValorAulaAvulsaChange: (v: string) => void
  onDiasLembreteChange: (v: string) => void
  onSalvar: () => void
}

export default function ValoresCard({
  valorMensalidade,
  valorAulaAvulsa,
  diasLembrete,
  saving,
  onValorMensalidadeChange,
  onValorAulaAvulsaChange,
  onDiasLembreteChange,
  onSalvar,
}: Props) {
  return (
    <Box
      bg="white"
      rounded="2xl"
      border="1px solid"
      borderColor="gray.100"
      p={{ base: 5, md: 6 }}
      mt={5}
    >
      <HStack spacing={3} mb={5}>
        <Flex w={9} h={9} rounded="xl" bg="green.50" align="center" justify="center" flexShrink={0}>
          <Icon as={FiDollarSign} boxSize={4} color="green.500" />
        </Flex>
        <Box>
          <Text fontSize="md" fontWeight="700" color="gray.800" lineHeight="1.2">
            Gestao de Valores
          </Text>
          <Text fontSize="xs" color="gray.400">
            Parametros usados em cobrancas e aulas avulsas
          </Text>
        </Box>
      </HStack>

      <Divider mb={5} />

      <VStack spacing={4} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
              Mensalidade padrao
            </FormLabel>
            <Input
              value={valorMensalidade}
              onChange={(e) => onValorMensalidadeChange(e.target.value ? maskCurrency(e.target.value) : '')}
              placeholder="0,00"
              rounded="xl"
              bg="gray.50"
              borderColor="gray.200"
              _focus={{ bg: 'white', borderColor: 'brand.500' }}
              fontSize="sm"
            />
            <FormHelperText fontSize="xs">Usada quando o aluno nao tem valor proprio.</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
              Valor de 1 aula
            </FormLabel>
            <Input
              value={valorAulaAvulsa}
              onChange={(e) => onValorAulaAvulsaChange(e.target.value ? maskCurrency(e.target.value) : '')}
              placeholder="0,00"
              rounded="xl"
              bg="gray.50"
              borderColor="gray.200"
              _focus={{ bg: 'white', borderColor: 'brand.500' }}
              fontSize="sm"
            />
            <FormHelperText fontSize="xs">Usado para cobrar o primeiro mes proporcional.</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
              Dias de lembrete
            </FormLabel>
            <Input
              type="number"
              min={0}
              value={diasLembrete}
              onChange={(e) => onDiasLembreteChange(e.target.value)}
              placeholder="0"
              rounded="xl"
              bg="gray.50"
              borderColor="gray.200"
              _focus={{ bg: 'white', borderColor: 'brand.500' }}
              fontSize="sm"
            />
          </FormControl>
        </SimpleGrid>

        <Button
          leftIcon={<FiSave />}
          colorScheme="brand"
          rounded="xl"
          alignSelf={{ base: 'stretch', md: 'flex-end' }}
          px={8}
          isLoading={saving}
          loadingText="Salvando..."
          onClick={onSalvar}
        >
          Salvar Valores
        </Button>
      </VStack>
    </Box>
  )
}
