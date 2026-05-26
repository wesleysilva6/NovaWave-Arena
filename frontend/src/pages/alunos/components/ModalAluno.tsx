import { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import type { Aluno, Modalidade } from '../../../service/alunos'
import { listarTurmasDoAluno } from '../../../service/alunos'
import type { Turma } from '../../../service/turmas'
import { buscarValoresConfiguracao } from '../../../service/configuracoes'
import { maskPhone, unmaskPhone, maskCPF, unmaskCPF, formatCurrency } from '../../../utils/formatters'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSalvar: (dados: Partial<Aluno>) => Promise<void>
  aluno: Aluno | null
  modalidades: Modalidade[]
  turmas: Turma[]
  salvando: boolean
}

const PLANOS = ['mensal', 'trimestral', 'semestral', 'anual']

const MESES_POR_PLANO: Record<string, number> = {
  mensal: 1,
  trimestral: 3,
  semestral: 6,
  anual: 12,
}

function calcularVencimentoContrato(plano: string, dataInicio: string): string {
  if (!dataInicio) return ''
  const date = new Date(dataInicio + 'T00:00:00')
  const meses = MESES_POR_PLANO[plano] ?? 1
  date.setMonth(date.getMonth() + meses)
  return date.toISOString().split('T')[0]
}

export default function ModalAluno({ isOpen, onClose, onSalvar, aluno, turmas, salvando }: Props) {
  const [form, setForm] = useState<Partial<Aluno>>({})
  const [turmasSelecionadas, setTurmasSelecionadas] = useState<string[]>([])
  const [valorPadrao, setValorPadrao] = useState(0)

  useEffect(() => {
    if (isOpen) {
      buscarValoresConfiguracao()
        .then((data) => setValorPadrao(Number(data.valor_mensalidade ?? 0)))
        .catch(() => setValorPadrao(0))
    }
  }, [isOpen])

  useEffect(() => {
    if (aluno) {
      setForm({
        ...aluno,
        telefone: aluno.telefone || '',
        cpf: aluno.cpf || '',
      })
      listarTurmasDoAluno(aluno.idaluno)
        .then((data) => setTurmasSelecionadas(data.map((t) => String(t.idturma))))
        .catch(() => setTurmasSelecionadas([]))
    } else {
      setForm({
        nome: '',
        telefone: '',
        cpf: '',
        data_nascimento: '',
        modalidade_id: undefined,
        data_inicio: '',
        dia_vencimento: 10,
        notificacao_whatsapp: 1,
        situacao: 1,
        observacao: '',
        plano: 'mensal',
        data_inicio_contrato: '',
        data_vencimento_contrato: '',
      })
      setTurmasSelecionadas([])
    }
  }, [aluno, isOpen])

  useEffect(() => {
    const plano = form.plano ?? 'mensal'
    const inicio = form.data_inicio_contrato ?? ''
    const vencimento = calcularVencimentoContrato(plano, inicio)
    setForm((prev) => ({ ...prev, data_vencimento_contrato: vencimento }))
  }, [form.plano, form.data_inicio_contrato])

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const primeiraTurma = turmas.find((t) => String(t.idturma) === turmasSelecionadas[0])
    const dados = {
      ...form,
      telefone: unmaskPhone(form.telefone ?? ''),
      cpf: form.cpf ? unmaskCPF(form.cpf) : '',
      modalidade_id: primeiraTurma?.modalidade_id ?? form.modalidade_id,
      turmas_ids: turmasSelecionadas.map(Number),
    }
    await onSalvar(dados)
  }

  const totalMensalidade = turmasSelecionadas.reduce((total, id) => {
    const turma = turmas.find((t) => String(t.idturma) === id)
    const valorTurma = Number(turma?.valor_mensalidade ?? 0)
    return total + (valorTurma > 0 ? valorTurma : valorPadrao)
  }, 0)

  const isValid =
    !!form.nome?.trim() &&
    !!form.telefone &&
    turmasSelecionadas.length > 0 &&
    !!form.dia_vencimento

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl">
        <ModalHeader fontSize="lg" fontWeight="700" color="gray.800">
          {aluno ? 'Editar Aluno' : 'Novo Aluno'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={4}>
          <VStack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Nome</FormLabel>
                <Input
                  value={form.nome ?? ''}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Nome completo"
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Telefone</FormLabel>
                <Input
                  value={maskPhone(form.telefone ?? '')}
                  onChange={(e) => handleChange('telefone', maskPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">CPF</FormLabel>
                <Input
                  value={maskCPF(form.cpf ?? '')}
                  onChange={(e) => handleChange('cpf', maskCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Data de Nascimento</FormLabel>
                <Input
                  type="date"
                  value={form.data_nascimento ?? ''}
                  onChange={(e) => handleChange('data_nascimento', e.target.value)}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Turmas</FormLabel>
                <CheckboxGroup value={turmasSelecionadas} onChange={(values) => setTurmasSelecionadas(values as string[])}>
                  <Wrap spacing={2}>
                    {turmas.filter((t) => t.situacao === 1).map((turma) => (
                      <WrapItem key={turma.idturma}>
                        <Checkbox value={String(turma.idturma)} colorScheme="brand">
                          <Text as="span" fontSize="sm">
                            {turma.nome}
                          </Text>
                        </Checkbox>
                      </WrapItem>
                    ))}
                  </Wrap>
                </CheckboxGroup>
                <FormHelperText>
                  Turmas sem valor proprio usam o valor padrao das configuracoes.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Plano</FormLabel>
                <Select
                  value={form.plano ?? 'mensal'}
                  onChange={(e) => handleChange('plano', e.target.value)}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                >
                  {PLANOS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <Flex
                rounded="xl"
                bg="brand.50"
                border="1px solid"
                borderColor="brand.100"
                p={4}
                align="center"
                justify="space-between"
              >
                <Text fontSize="sm" fontWeight="600" color="gray.600">Mensalidade calculada</Text>
                <Text fontSize="lg" fontWeight="800" color="brand.600">
                  {formatCurrency(totalMensalidade)}
                </Text>
              </Flex>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Dia Vencimento</FormLabel>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={form.dia_vencimento ?? 10}
                  onChange={(e) => handleChange('dia_vencimento', parseInt(e.target.value))}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Data Início</FormLabel>
                <Input
                  type="date"
                  value={form.data_inicio ?? ''}
                  onChange={(e) => handleChange('data_inicio', e.target.value)}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Início Contrato</FormLabel>
                <Input
                  type="date"
                  value={form.data_inicio_contrato ?? ''}
                  onChange={(e) => handleChange('data_inicio_contrato', e.target.value)}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Vencimento Contrato</FormLabel>
                <Input
                  type="date"
                  value={form.data_vencimento_contrato ?? ''}
                  isReadOnly
                  bg="gray.100"
                  size="lg"
                  rounded="xl"
                  cursor="not-allowed"
                  _focus={{ boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" pt={8}>
                <FormLabel fontSize="sm" fontWeight="600" mb={0}>
                  Notificação WhatsApp
                </FormLabel>
                <Switch
                  colorScheme="green"
                  isChecked={form.notificacao_whatsapp === 1}
                  onChange={(e) => handleChange('notificacao_whatsapp', e.target.checked ? 1 : 0)}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">Observação</FormLabel>
              <Textarea
                value={form.observacao ?? ''}
                onChange={(e) => handleChange('observacao', e.target.value)}
                placeholder="Observações sobre o aluno..."
                rounded="xl"
                bg="gray.50"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} rounded="xl">
            Cancelar
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={salvando}
            isDisabled={!isValid}
            rounded="xl"
            px={8}
          >
            {aluno ? 'Salvar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
