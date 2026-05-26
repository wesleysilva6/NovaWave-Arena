import { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Icon, SimpleGrid, Text, useToast } from '@chakra-ui/react'
import { FiBarChart2 } from 'react-icons/fi'
import { listarModalidades, type Modalidade } from '../../service/alunos'
import { obterAnalises, type AnaliseData, type AnaliseFiltros } from '../../service/analises'
import { formatCurrency } from '../../utils/formatters'
import FiltrosAnalises from './components/FiltrosAnalises'
import KpiAnalises from './components/KpiAnalises'
import FinanceiroAreaChart from './components/FinanceiroAreaChart'
import HorizontalBarChart from './components/HorizontalBarChart'
import StatusDonut from './components/StatusDonut'

function dataISO(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const hoje = new Date()
const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1)

const filtrosIniciais: AnaliseFiltros = {
  data_inicio: dataISO(inicio),
  data_fim: dataISO(hoje),
  modalidade_id: 0,
  aluno_situacao: -1,
}

const vazio: AnaliseData = {
  filtros: filtrosIniciais,
  resumo: {
    receita: 0,
    gastos: 0,
    resultado: 0,
    em_aberto: 0,
    alunos: 0,
    novos_alunos: 0,
    presencas_confirmadas: 0,
    aulas_geradas: 0,
    taxa_presenca: 0,
  },
  financeiro_mensal: [],
  gastos_categoria: [],
  mensalidades_status: [],
  alunos_modalidade: [],
  presencas_modalidade: [],
  aulas_dia_semana: [],
  turmas_ocupacao: [],
}

export default function AnalisesPage() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [filtros, setFiltros] = useState<AnaliseFiltros>(filtrosIniciais)
  const [dados, setDados] = useState<AnaliseData>(vazio)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const [analisesData, modalidadesData] = await Promise.all([
        obterAnalises(filtros),
        listarModalidades(),
      ])
      setDados(analisesData)
      setModalidades(modalidadesData)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar analises', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setLoading(false)
    }
  }, [filtros, toast])

  useEffect(() => {
    carregar()
  }, [carregar])

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1500px" w="full" mx="auto">
      <Flex mb={6} align="center" gap={3}>
        <Flex w={10} h={10} rounded="xl" bg="brand.50" align="center" justify="center">
          <Icon as={FiBarChart2} boxSize={5} color="brand.500" />
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="700" color="gray.800">Analises</Text>
          <Text fontSize="xs" color="gray.400">Visao gerencial completa da arena com filtros avancados</Text>
        </Box>
      </Flex>

      <FiltrosAnalises
        filtros={filtros}
        modalidades={modalidades}
        loading={loading}
        onChange={setFiltros}
        onAplicar={carregar}
      />

      <KpiAnalises resumo={dados.resumo} loading={loading} />

      <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={5} mb={5}>
        <Box gridColumn={{ base: 'auto', xl: 'span 2' }}>
          <FinanceiroAreaChart data={dados.financeiro_mensal} />
        </Box>
        <StatusDonut data={dados.mensalidades_status} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={5} mb={5}>
        <HorizontalBarChart
          title="Despesas por categoria"
          subtitle="Onde o dinheiro esta sendo consumido"
          data={dados.gastos_categoria.map((g) => ({ label: g.categoria, value: g.total, sub: `${g.quantidade} registro${g.quantidade !== 1 ? 's' : ''}` }))}
          formatValue={formatCurrency}
        />
        <HorizontalBarChart
          title="Alunos por modalidade"
          subtitle="Distribuicao dos alunos filtrados"
          data={dados.alunos_modalidade.map((m) => ({ label: m.modalidade, value: m.total }))}
        />
        <HorizontalBarChart
          title="Presencas por modalidade"
          subtitle="Volume de presencas confirmadas"
          data={dados.presencas_modalidade.map((m) => ({ label: m.modalidade, value: m.presencas, sub: `${m.aulas_geradas} aulas geradas` }))}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
        <HorizontalBarChart
          title="Aulas por dia da semana"
          subtitle="Comparativo entre dias de maior movimento"
          data={dados.aulas_dia_semana.map((d) => ({ label: d.dia_semana, value: d.aulas_geradas, sub: `${d.presencas} presencas` }))}
        />
        <HorizontalBarChart
          title="Ocupacao das turmas"
          subtitle="Top 10 turmas por ocupacao"
          data={dados.turmas_ocupacao.map((t) => ({ label: t.turma, value: t.ocupacao ?? t.alunos, sub: `${t.alunos}${t.limite_alunos ? `/${t.limite_alunos}` : ''} alunos - ${t.modalidade}` }))}
          formatValue={(value) => `${value.toFixed(0)}%`}
        />
      </SimpleGrid>
    </Box>
  )
}
