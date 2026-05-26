import { useEffect, useState } from 'react'
import { Box, SimpleGrid } from '@chakra-ui/react'

import type { Vencimento, Treino } from '../../utils/types'
import { obterDashboard } from '../../service/dashboard'

import TabelaVencimentos from './components/TabelaVencimentos'
import ListaTreinos from './components/ListaTreinos'
import KpiCards from './components/KpiCards'
import FinanceiroChart, { type FinanceiroMes } from './components/FinanceiroChart'
import AulasDiaChart, { type AulasDia } from './components/AulasDiaChart'
import ModalidadesChart, { type ModalidadeData } from './components/ModalidadesChart'
import ExecutiveSummary from './components/ExecutiveSummary'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [proximosVencimentos, setProximosVencimentos] = useState<Vencimento[]>([])
  const [treinosHoje, setTreinosHoje] = useState<Treino[]>([])
  const [agendaSemana, setAgendaSemana] = useState<Treino[]>([])
  const [financeiro, setFinanceiro] = useState<FinanceiroMes[]>([])
  const [alunosModalidade, setAlunosModalidade] = useState<ModalidadeData[]>([])
  const [aulasPorDia, setAulasPorDia] = useState<AulasDia[]>([])
  const [stats, setStats] = useState({
    total_alunos: 0,
    treinos_hoje: 0,
    receita_mes: 0,
    gastos_mes: 0,
    vencimentos_proximos: 0,
    modalidades_ativas: 0,
    novos_alunos_mes: 0,
  })

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        const data = await obterDashboard()
        setStats(data.stats)
        setProximosVencimentos(data.vencimentos ?? [])
        setTreinosHoje(data.treinos_hoje ?? [])
        setAgendaSemana(data.agenda_semana ?? [])
        setFinanceiro(data.financeiro_6_meses ?? [])
        setAlunosModalidade(data.alunos_modalidade ?? [])
        setAulasPorDia(data.aulas_por_dia ?? [])
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1500px" w="full" mx="auto">
      <ExecutiveSummary
        receita={stats.receita_mes}
        gastos={stats.gastos_mes}
        aulasHoje={stats.treinos_hoje}
        vencimentos={stats.vencimentos_proximos}
      />

      <KpiCards stats={stats} loading={loading} />

      <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={5} mb={5}>
        <Box gridColumn={{ base: 'auto', xl: 'span 2' }}>
          <FinanceiroChart data={financeiro} />
        </Box>
        <ModalidadesChart data={alunosModalidade} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={5}>
        <AulasDiaChart data={aulasPorDia} />
        <Box gridColumn={{ base: 'auto', xl: 'span 2' }}>
          <ListaTreinos treinos={treinosHoje} agendaSemana={agendaSemana} loading={loading} />
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1 }} spacing={5} mt={5}>
        <TabelaVencimentos vencimentos={proximosVencimentos} loading={loading} />
      </SimpleGrid>
    </Box>
  )
}
