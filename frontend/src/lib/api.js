import axios from 'axios';

// Configuração da API - Detecta automaticamente ambiente
const getApiBaseUrl = () => {
  // Em produção (Vercel), usar URL relativa
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // Em desenvolvimento, usar variável de ambiente ou localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Mock de autenticação para funcionar sem backend
const mockAuth = {
  login: async (cpf, password) => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Credenciais válidas (CPF de teste: 11144477735, senha: 1234)
    const cpfClean = cpf.replace(/[^0-9]/g, '');
    if (cpfClean === '11144477735' && password === '1234') {
      return {
        access_token: 'mock_token_123456',
        user: {
          id: 1,
          name: 'Administrador VIP',
          cpf: '11144477735',
          role: 'admin'
        }
      };
    } else {
      throw new Error('CPF ou senha inválidos');
    }
  }
};

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: mockAuth.login, // Usar mock em vez da API real
  
  register: async (cpf, password, name) => {
    const response = await api.post('/auth/register', { cpf, password, name });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Serviços de dashboard
export const dashboardService = {
  getMetricas: async () => {
    const response = await api.get('/dashboard/metricas');
    return response.data;
  },
  
  getAtividadesRecentes: async () => {
    const response = await api.get('/dashboard/atividades-recentes');
    return response.data;
  },
  
  getCalendario: async () => {
    const response = await api.get('/dashboard/calendario');
    return response.data;
  },
  
  getNotificacoes: async () => {
    const response = await api.get('/dashboard/notificacoes');
    return response.data;
  },
  
  getResumoModulos: async () => {
    const response = await api.get('/dashboard/resumo-modulos');
    return response.data;
  },
};

// Serviços de clientes
export const clientesService = {
  getAll: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/clientes', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },
  
  updateStatus: async (id, status, justificativa = '') => {
    const response = await api.put(`/clientes/${id}/status`, { status, justificativa });
    return response.data;
  },
  
  preCadastro: async (data) => {
    const response = await api.post('/clientes/pre-cadastro', data);
    return response.data;
  },
};

// Serviços de leads
export const leadsService = {
  getAll: async () => {
    const response = await api.get('/leads');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/leads', data);
    return response.data;
  },
  
  capturar: async (filtros) => {
    const response = await api.post('/leads/capturar', { filtros });
    return response.data;
  },
  
  exportar: async () => {
    const response = await api.get('/leads/exportar');
    return response.data;
  },
};

// Serviços de licitações
export const licitacoesService = {
  getAll: async () => {
    const response = await api.get('/licitacoes');
    return response.data;
  },
  
  buscar: async (palavrasChave) => {
    const response = await api.post('/licitacoes/buscar', { palavras_chave: palavrasChave });
    return response.data;
  },
  
  configurarMonitoramento: async (config) => {
    const response = await api.post('/licitacoes/monitorar', config);
    return response.data;
  },
  
  getEstatisticas: async () => {
    const response = await api.get('/licitacoes/estatisticas');
    return response.data;
  },
};

export default api;

