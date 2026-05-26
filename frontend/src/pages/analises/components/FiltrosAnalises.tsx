import { Button, Flex, FormControl, FormLabel, Input, Select } from '@chakra-ui/react'
import { FiFilter } from 'react-icons/fi'
import type { Modalidade } from '../../../service/alunos'
import type { AnaliseFiltros } from '../../../service/analises'

interface Props {
  filtros: AnaliseFiltros
  modalidades: Modalidade[]
  loading: boolean
  onChange: (filtros: AnaliseFiltros) => void
  onAplicar: () => void
}

export default function FiltrosAnalises({ filtros, modalidades, loading, onChange, onAplicar }: Props) {
  return (
    <Flex bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" p={4} mb={5} gap={3} align={{ base: 'stretch', lg: 'end' }} direction={{ base: 'column', lg: 'row' }}>
      <FormControl>
        <FormLabel fontSize="xs" color="gray.500" fontWeight="700">Inicio</FormLabel>
        <Input type="date" value={filtros.data_inicio} onChange={(e) => onChange({ ...filtros, data_inicio: e.target.value })} rounded="xl" bg="gray.50" fontSize="sm" />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" color="gray.500" fontWeight="700">Fim</FormLabel>
        <Input type="date" value={filtros.data_fim} onChange={(e) => onChange({ ...filtros, data_fim: e.target.value })} rounded="xl" bg="gray.50" fontSize="sm" />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" color="gray.500" fontWeight="700">Modalidade</FormLabel>
        <Select value={filtros.modalidade_id} onChange={(e) => onChange({ ...filtros, modalidade_id: Number(e.target.value) })} rounded="xl" bg="gray.50" fontSize="sm">
          <option value={0}>Todas</option>
          {modalidades.map((m) => <option key={m.idmodalidade} value={m.idmodalidade}>{m.nome}</option>)}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" color="gray.500" fontWeight="700">Situacao do aluno</FormLabel>
        <Select value={filtros.aluno_situacao} onChange={(e) => onChange({ ...filtros, aluno_situacao: Number(e.target.value) })} rounded="xl" bg="gray.50" fontSize="sm">
          <option value={-1}>Todos</option>
          <option value={1}>Ativos</option>
          <option value={0}>Inativos</option>
        </Select>
      </FormControl>
      <Button leftIcon={<FiFilter />} colorScheme="brand" rounded="xl" px={8} onClick={onAplicar} isLoading={loading}>
        Aplicar
      </Button>
    </Flex>
  )
}
