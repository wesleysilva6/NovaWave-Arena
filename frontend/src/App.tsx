import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import ProtectedLayout from './ProtectedLayout';
import Dashboard from './pages/dashboard/Index';
import Alunos from './pages/alunos/Index';
import Modalidades from './pages/modalidades/Index';
import Turmas from './pages/turmas/Index';
import Mensalidades from './pages/mensalidades/Index';
import Presencas from './pages/presencas/Index';
import Mensagens from './pages/mensagens/Index';
import Notificacoes from './pages/notificacoes/Index';
import Gastos from './pages/gastos/Index';
import Configuracoes from './pages/configuracoes/Index';
import Perfil from './pages/perfil/Index';
import Funcionarios from './pages/funcionarios/Index';
import Analises from './pages/analises/Index';

function App() {
  return (
    <Router>
      <Routes>
        {/* ROTAS PUBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ROTAS PROTEGIDAS */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analises" element={<Analises />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/modalidades" element={<Modalidades />} />
          <Route path="/turmas" element={<Turmas />} />
          <Route path="/mensalidades" element={<Mensalidades />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/presencas" element={<Presencas />} />
          <Route path="/mensagens" element={<Mensagens />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
