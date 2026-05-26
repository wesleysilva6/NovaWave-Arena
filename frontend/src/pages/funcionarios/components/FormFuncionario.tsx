import { useEffect, useState } from 'react'
import {
  Button,
  Flex,
  FormControl,
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
} from '@chakra-ui/react'
import { FiSave } from 'react-icons/fi'
import type { CargoFuncionario } from '../../../service/cargosFuncionarios'
import type { Funcionario, FuncionarioForm } from '../../../service/funcionarios'
import { maskCurrency, maskPhone, unmaskCurrency, unmaskPhone } from '../../../utils/formatters'

interface Props {
  isOpen: boolean
  onClose: () => void
  funcionario: Funcionario | null
  cargos: CargoFuncionario[]
  saving: boolean
  initialValue: FuncionarioForm
  onSalvar: (dados: FuncionarioForm) => void
}

export default function FormFuncionario({ isOpen, onClose, funcionario, cargos, saving, initialValue, onSalvar }: Props) {
  const [form, setForm] = useState<FuncionarioForm>(initialValue)

  useEffect(() => {
    if (!isOpen) return

    if (funcionario) {
      setForm({
        nome: funcionario.nome,
        cargo_id: funcionario.cargo_id ?? null,
        cargo: funcionario.cargo,
        telefone: funcionario.telefone ? maskPhone(funcionario.telefone) : '',
        email: funcionario.email ?? '',
        salario: funcionario.salario,
        data_admissao: funcionario.data_admissao ?? '',
        situacao: funcionario.situacao,
        observacao: funcionario.observacao ?? '',
      })
    } else {
      setForm(initialValue)
    }
  }, [isOpen, funcionario, initialValue])

  const valido = form.nome.trim().length > 0 && !!form.cargo_id && form.salario > 0

  function handleSubmit() {
    if (!valido) return

    const cargoSelecionado = cargos.find((c) => c.idcargo === Number(form.cargo_id))
    onSalvar({
      ...form,
      cargo: cargoSelecionado?.nome ?? form.cargo,
      telefone: form.telefone ? unmaskPhone(form.telefone) : null,
      email: form.email?.trim() || null,
      observacao: form.observacao?.trim() || null,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl" mx={4}>
        <ModalHeader fontSize="lg" fontWeight="700" color="gray.800">
          {funcionario ? 'Editar Funcionario' : 'Novo Funcionario'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Nome</FormLabel>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" rounded="xl" bg="gray.50" fontSize="sm" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Cargo</FormLabel>
                <Select value={form.cargo_id ?? ''} onChange={(e) => setForm({ ...form, cargo_id: e.target.value ? Number(e.target.value) : null })} placeholder="Selecione o cargo" rounded="xl" bg="gray.50" fontSize="sm">
                  {cargos.map((cargo) => (
                    <option key={cargo.idcargo} value={cargo.idcargo}>{cargo.nome}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Telefone</FormLabel>
                <Input value={form.telefone ?? ''} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} placeholder="(00) 00000-0000" rounded="xl" bg="gray.50" fontSize="sm" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Email</FormLabel>
                <Input value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" rounded="xl" bg="gray.50" fontSize="sm" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Salario</FormLabel>
                <Input value={form.salario > 0 ? maskCurrency(String(Math.round(form.salario * 100))) : ''} onChange={(e) => setForm({ ...form, salario: unmaskCurrency(e.target.value ? maskCurrency(e.target.value) : '') })} placeholder="0,00" rounded="xl" bg="gray.50" fontSize="sm" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Admissao</FormLabel>
                <Input type="date" value={form.data_admissao ?? ''} onChange={(e) => setForm({ ...form, data_admissao: e.target.value })} rounded="xl" bg="gray.50" fontSize="sm" />
              </FormControl>
            </SimpleGrid>

            <Flex w="full" align="center" justify="space-between">
              <Text fontSize="sm" fontWeight="600" color="gray.600">Funcionario ativo</Text>
              <Switch colorScheme="green" isChecked={form.situacao === 1} onChange={(e) => setForm({ ...form, situacao: e.target.checked ? 1 : 0 })} />
            </Flex>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Observacao</FormLabel>
              <Textarea value={form.observacao ?? ''} onChange={(e) => setForm({ ...form, observacao: e.target.value })} placeholder="Observacao opcional..." rounded="xl" bg="gray.50" fontSize="sm" rows={3} resize="none" />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} rounded="xl">Cancelar</Button>
          <Button leftIcon={<FiSave />} colorScheme="brand" rounded="xl" isLoading={saving} loadingText="Salvando..." isDisabled={!valido} onClick={handleSubmit}>
            {funcionario ? 'Salvar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
