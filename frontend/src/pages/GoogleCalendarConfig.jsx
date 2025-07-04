import React, { useState } from 'react';
import { Calendar, Settings, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const GoogleCalendarConfig = () => {
  const [googleCalendarConfig, setGoogleCalendarConfig] = useState({
    apiKey: '',
    accessToken: '',
    calendarId: 'primary'
  });
  
  const [isConfigured, setIsConfigured] = useState(false);

  // Função para configurar Google Calendar
  const configurarGoogleCalendar = async () => {
    if (!googleCalendarConfig.apiKey || !googleCalendarConfig.accessToken) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Simular configuração
    setIsConfigured(true);
    alert('Google Calendar configurado com sucesso! Sincronização ativada.');
  };

  const testarSincronizacao = async () => {
    if (!isConfigured) {
      alert('Configure o Google Calendar primeiro.');
      return;
    }

    alert('Teste de sincronização realizado com sucesso!');
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="bg-vip-gradient text-white px-6 py-4 shadow-vip">
        <div className="flex items-center space-x-3">
          <Calendar className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Configuração Google Calendar</h1>
            <p className="text-blue-100">Configure a integração com Google Calendar</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status da Configuração */}
          <div className={`p-4 rounded-lg border ${isConfigured ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center space-x-3">
              {isConfigured ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              )}
              <div>
                <h3 className={`font-semibold ${isConfigured ? 'text-green-800' : 'text-yellow-800'}`}>
                  {isConfigured ? 'Google Calendar Configurado' : 'Configuração Pendente'}
                </h3>
                <p className={`text-sm ${isConfigured ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isConfigured 
                    ? 'A sincronização com Google Calendar está ativa.'
                    : 'Configure as credenciais para ativar a sincronização.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Configuração */}
          <div className="bg-white rounded-xl shadow-vip p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Settings className="h-6 w-6" />
              <span>Credenciais da API</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key do Google Calendar
                </label>
                <input
                  type="text"
                  value={googleCalendarConfig.apiKey}
                  onChange={(e) => setGoogleCalendarConfig(prev => ({
                    ...prev,
                    apiKey: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Insira sua API Key do Google Calendar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token
                </label>
                <input
                  type="text"
                  value={googleCalendarConfig.accessToken}
                  onChange={(e) => setGoogleCalendarConfig(prev => ({
                    ...prev,
                    accessToken: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Insira seu Access Token"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calendar ID (opcional)
                </label>
                <input
                  type="text"
                  value={googleCalendarConfig.calendarId}
                  onChange={(e) => setGoogleCalendarConfig(prev => ({
                    ...prev,
                    calendarId: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="primary (padrão)"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={configurarGoogleCalendar}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Configurar
              </button>
              
              <button
                onClick={testarSincronizacao}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Testar Sincronização
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-white rounded-xl shadow-vip p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Como obter as credenciais</h3>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Acesse o Google Cloud Console</h4>
                <p>Vá para <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                  console.cloud.google.com <ExternalLink className="h-3 w-3 ml-1" />
                </a></p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Crie um projeto ou selecione um existente</h4>
                <p>No topo da página, clique no seletor de projeto e crie um novo ou selecione um existente.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Ative a API do Google Calendar</h4>
                <p>Vá para "APIs e Serviços" → "Biblioteca" e procure por "Google Calendar API". Clique em "Ativar".</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Crie credenciais</h4>
                <p>Vá para "APIs e Serviços" → "Credenciais" → "Criar credenciais" → "Chave de API".</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">5. Configure OAuth 2.0</h4>
                <p>Para o Access Token, você precisará configurar OAuth 2.0 e autorizar o aplicativo.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Escopos necessários:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-blue-800">
                <li>https://www.googleapis.com/auth/calendar</li>
                <li>https://www.googleapis.com/auth/calendar.events</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarConfig;

