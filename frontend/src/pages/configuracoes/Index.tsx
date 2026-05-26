import { useCallback, useEffect, useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'

import {
  buscarValoresConfiguracao,
  salvarValoresConfiguracao,
} from '../../service/configuracoes'
import { maskCurrency, unmaskCurrency } from '../../utils/formatters'

import ValoresCard from './components/ValoresCard'
import CargosCard from './components/CargosCard'

export default function ConfiguracoesPage() {
  const toast = useToast()

  const [valorMensalidade, setValorMensalidade] = useState('')
  const [valorAulaAvulsa, setValorAulaAvulsa] = useState('')
  const [diasLembrete, setDiasLembrete] = useState('0')
  const [savingValores, setSavingValores] = useState(false)

  useEffect(() => {
    buscarValoresConfiguracao()
      .then((data) => {
        setValorMensalidade(data.valor_mensalidade > 0 ? maskCurrency(String(Math.round(data.valor_mensalidade * 100))) : '')
        setValorAulaAvulsa(data.valor_aula_avulsa > 0 ? maskCurrency(String(Math.round(data.valor_aula_avulsa * 100))) : '')
        setDiasLembrete(String(data.dias_lembrete ?? 0))
      })
      .catch((err) => {
        toast({
          title: 'Erro ao carregar valores',
          description: err?.response?.data?.error || err.message,
          status: 'error',
          duration: 4000,
          position: 'top',
        })
      })
  }, [toast])

  const handleSalvarValores = useCallback(async () => {
    setSavingValores(true)
    try {
      await salvarValoresConfiguracao({
        valor_mensalidade: unmaskCurrency(valorMensalidade),
        valor_aula_avulsa: unmaskCurrency(valorAulaAvulsa),
        dias_lembrete: Number(diasLembrete || 0),
      })

      toast({
        title: 'Valores atualizados com sucesso',
        status: 'success',
        duration: 3000,
        position: 'top',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar valores',
        description: err?.response?.data?.error || err.message,
        status: 'error',
        duration: 4000,
        position: 'top',
      })
    } finally {
      setSavingValores(false)
    }
  }, [valorMensalidade, valorAulaAvulsa, diasLembrete, toast])

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="900px" w="full" mx="auto">
      <ValoresCard
        valorMensalidade={valorMensalidade}
        valorAulaAvulsa={valorAulaAvulsa}
        diasLembrete={diasLembrete}
        saving={savingValores}
        onValorMensalidadeChange={setValorMensalidade}
        onValorAulaAvulsaChange={setValorAulaAvulsa}
        onDiasLembreteChange={setDiasLembrete}
        onSalvar={handleSalvarValores}
      />
      <CargosCard />
    </Box>
  )
}
