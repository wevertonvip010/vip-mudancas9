import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadsLinkedIn from './pages/LeadsLinkedIn';
import LicitacoesPublicas from './pages/LicitacoesPublicas';
import Clientes from './pages/Clientes';
import SelfStorage from './pages/SelfStorage';
import Estoque from './pages/Estoque';
import Financeiro from './pages/Financeiro';
import Visitas from './pages/Visitas';
import Orcamentos from './pages/Orcamentos';
import Contratos from './pages/Contratos';
import OrdensServico from './pages/OrdensServico';
import Vendas from './pages/Vendas';
import Graficos from './pages/Graficos';
import Configuracoes from './pages/Configuracoes';
import Marketing from './pages/Marketing';
import ProgramaPontos from './pages/ProgramaPontos';
import './App.css';

// Páginas placeholder para os módulos
const PlaceholderPage = ({ title }) => (
  <div className="flex-1 bg-gray-50">
    <div className="bg-vip-gradient text-white px-6 py-4 shadow-vip">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-vip p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Módulo {title}</h2>
        <p className="text-gray-600 mb-6">Este módulo está em desenvolvimento e será implementado em breve.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            🚧 Funcionalidades planejadas para este módulo incluem gestão completa, 
            relatórios detalhados e integrações automáticas.
          </p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rota de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas com Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Rotas aninhadas dentro do Layout */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="leads-linkedin" element={<LeadsLinkedIn />} />
              <Route path="licitacoes" element={<LicitacoesPublicas />} />
              <Route path="visitas" element={<Visitas />} />
              <Route path="orcamentos" element={<Orcamentos />} />
              <Route path="contratos" element={<Contratos />} />
              <Route path="ordens-servico" element={<OrdensServico />} />
              <Route path="self-storage" element={<SelfStorage />} />
              <Route path="financeiro" element={<Financeiro />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="vendas" element={<Vendas />} />
              <Route path="estoque" element={<Estoque />} />
              <Route path="programa-pontos" element={<ProgramaPontos />} />
              <Route path="calendario" element={<PlaceholderPage title="Calendário" />} />
              <Route path="graficos" element={<Graficos />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
            
            {/* Rota 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

