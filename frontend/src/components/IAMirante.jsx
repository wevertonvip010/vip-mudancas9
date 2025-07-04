import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  MessageCircle, 
  Lightbulb, 
  HelpCircle, 
  Zap,
  Brain,
  Sparkles,
  User,
  Settings,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import { authService } from '../lib/api';

const IAMirante = ({ isOpen, onToggle, onClose }) => {
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); // chat, desempenho, motivacao, sugestoes
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sugestões predefinidas por categoria
  const sugestoesPredefinidas = {
    chat: [
      "Como usar o sistema de orçamentos?",
      "Gerar relatório de vendas",
      "Configurar notificações",
      "Exportar dados financeiros"
    ],
    desempenho: [
      "Analisar meu desempenho dos últimos 30 dias",
      "Como melhorar minha taxa de conversão?",
      "Comparar com a meta mensal",
      "Dicas para aumentar vendas"
    ],
    motivacao: [
      "Feedback sobre minha meta de carro novo",
      "Progresso para viagem dos sonhos",
      "Motivação para casa própria",
      "Acompanhar economia mensal"
    ],
    sugestoes: [
      "Sugestões para setor comercial",
      "Melhorias operacionais",
      "Otimizar processo de vistoria",
      "Estratégias de vendas"
    ]
  };

  useEffect(() => {
    if (isOpen && conversas.length === 0) {
      // Mensagem de boas-vindas personalizada
      const mensagemBoasVindas = {
        id: 1,
        tipo: 'bot',
        mensagem: "👋 Olá! Sou o **Mirante**, seu assistente inteligente da VIP Mudanças!\n\n🎯 **Novidades:**\n• Análise de desempenho personalizada\n• Feedback motivacional para suas metas\n• Sugestões específicas por setor\n• Chat inteligente com GPT-4o\n\nEscolha uma aba acima ou me faça uma pergunta. Como posso ajudar você hoje?",
        timestamp: new Date()
      };
      
      setConversas([mensagemBoasVindas]);
      setSugestoes(sugestoesPredefinidas.chat);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [conversas]);

  useEffect(() => {
    setSugestoes(sugestoesPredefinidas[activeTab] || []);
  }, [activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const enviarMensagem = async (texto = mensagem) => {
    if (!texto.trim()) return;

    const novaMensagem = {
      id: Date.now(),
      tipo: 'user',
      mensagem: texto,
      timestamp: new Date()
    };

    setConversas(prev => [...prev, novaMensagem]);
    setMensagem('');
    setIsTyping(true);

    try {
      // Usar a nova API da IA Mirante
      const response = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          pergunta: texto,
          contexto: `Aba ativa: ${activeTab}`
        })
      });

      const data = await response.json();
      
      const respostaMirante = {
        id: Date.now() + 1,
        tipo: 'bot',
        mensagem: data.resposta || "Desculpe, não consegui processar sua pergunta no momento.",
        timestamp: new Date()
      };

      setConversas(prev => [...prev, respostaMirante]);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Fallback para resposta local
      const respostaFallback = {
        id: Date.now() + 1,
        tipo: 'bot',
        mensagem: "Estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.",
        timestamp: new Date()
      };

      setConversas(prev => [...prev, respostaFallback]);
    } finally {
      setIsTyping(false);
    }
  };

  const analisarDesempenho = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ia/analisar-desempenho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          periodo: '30'
        })
      });

      const data = await response.json();
      
      const analiseMsg = {
        id: Date.now(),
        tipo: 'bot',
        mensagem: `📊 **Análise de Desempenho - ${data.periodo}**\n\n${data.analise}\n\n**Dados:**\n• Orçamentos: ${data.dados_desempenho.orcamentos_criados}\n• Vendas: ${data.dados_desempenho.vendas_fechadas}\n• Valor: R$ ${data.dados_desempenho.valor_vendido.toLocaleString('pt-BR')}\n• Taxa conversão: ${data.dados_desempenho.taxa_conversao}%`,
        timestamp: new Date()
      };

      setConversas(prev => [...prev, analiseMsg]);
      
    } catch (error) {
      console.error('Erro ao analisar desempenho:', error);
      const errorMsg = {
        id: Date.now(),
        tipo: 'bot',
        mensagem: "Não consegui acessar seus dados de desempenho no momento. Tente novamente mais tarde.",
        timestamp: new Date()
      };
      setConversas(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const gerarFeedbackMotivacional = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ia/feedback-motivacional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          meta_pessoal: 'carro novo',
          valor_atual: 25000,
          valor_meta: 60000
        })
      });

      const data = await response.json();
      
      const feedbackMsg = {
        id: Date.now(),
        tipo: 'bot',
        mensagem: `🎯 **Feedback Motivacional**\n\n${data.feedback}\n\n**Progresso:** ${data.progresso_percentual}%\n**Falta:** R$ ${data.valor_faltante.toLocaleString('pt-BR')}`,
        timestamp: new Date()
      };

      setConversas(prev => [...prev, feedbackMsg]);
      
    } catch (error) {
      console.error('Erro ao gerar feedback:', error);
      const errorMsg = {
        id: Date.now(),
        tipo: 'bot',
        mensagem: "Não consegui gerar seu feedback motivacional no momento. Tente novamente mais tarde.",
        timestamp: new Date()
      };
      setConversas(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const obterSugestoesSetor = async (setor) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ia/sugestoes-setor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          setor: setor,
          contexto: 'Solicitação via chat da IA Mirante'
        })
      });

      const data = await response.json();
      
      const sugestoesText = data.sugestoes.map((s, i) => `${i + 1}. ${s}`).join('\n');
      
      const sugestoesMsg = {
        id: Date.now(),
        tipo: 'bot',
        mensagem: `💡 **Sugestões para ${setor.charAt(0).toUpperCase() + setor.slice(1)}**\n\n${sugestoesText}`,
        timestamp: new Date()
      };

      setConversas(prev => [...prev, sugestoesMsg]);
      
    } catch (error) {
      console.error('Erro ao obter sugestões:', error);
      const errorMsg = {
        id: Date.now(),
        tipo: 'bot',
        mensagem: "Não consegui gerar sugestões no momento. Tente novamente mais tarde.",
        timestamp: new Date()
      };
      setConversas(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copiarMensagem = (texto) => {
    navigator.clipboard.writeText(texto);
    alert('Mensagem copiada para a área de transferência!');
  };

  const avaliarResposta = (id, tipo) => {
    alert(`Obrigado pelo feedback! Sua avaliação (${tipo}) foi registrada.`);
  };

  const limparConversa = () => {
    setConversas([{
      id: 1,
      tipo: 'bot',
      mensagem: "Conversa limpa! Como posso ajudar você agora?",
      timestamp: new Date()
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-80' : 'w-96'} transition-all duration-300`}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Mirante</h3>
                <p className="text-blue-100 text-sm">Assistente IA da VIP</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tabs */}
            <div className="bg-gray-50 border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    activeTab === 'chat' 
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 inline mr-1" />
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('desempenho')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    activeTab === 'desempenho' 
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  Performance
                </button>
                <button
                  onClick={() => setActiveTab('motivacao')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    activeTab === 'motivacao' 
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Target className="h-4 w-4 inline mr-1" />
                  Metas
                </button>
                <button
                  onClick={() => setActiveTab('sugestoes')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    activeTab === 'sugestoes' 
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Lightbulb className="h-4 w-4 inline mr-1" />
                  Dicas
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {activeTab !== 'chat' && (
              <div className="p-3 bg-white border-b">
                <div className="flex flex-wrap gap-2">
                  {activeTab === 'desempenho' && (
                    <button
                      onClick={analisarDesempenho}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      📊 Analisar Desempenho
                    </button>
                  )}
                  {activeTab === 'motivacao' && (
                    <button
                      onClick={gerarFeedbackMotivacional}
                      disabled={loading}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      🎯 Feedback Motivacional
                    </button>
                  )}
                  {activeTab === 'sugestoes' && (
                    <>
                      <button
                        onClick={() => obterSugestoesSetor('comercial')}
                        disabled={loading}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs hover:bg-purple-100 transition-colors disabled:opacity-50"
                      >
                        💼 Comercial
                      </button>
                      <button
                        onClick={() => obterSugestoesSetor('operacional')}
                        disabled={loading}
                        className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs hover:bg-orange-100 transition-colors disabled:opacity-50"
                      >
                        🚛 Operacional
                      </button>
                      <button
                        onClick={() => obterSugestoesSetor('vistoria')}
                        disabled={loading}
                        className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs hover:bg-teal-100 transition-colors disabled:opacity-50"
                      >
                        📋 Vistoria
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Chat Area */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {conversas.map((conversa) => (
                <div key={conversa.id} className={`flex ${conversa.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    conversa.tipo === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-800 shadow-sm border'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {conversa.tipo === 'bot' && (
                        <Bot className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                      )}
                      {conversa.tipo === 'user' && (
                        <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm whitespace-pre-line">{conversa.mensagem}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className={`text-xs ${conversa.tipo === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {conversa.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {conversa.tipo === 'bot' && (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => copiarMensagem(conversa.mensagem)}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Copiar"
                              >
                                <Copy className="h-3 w-3 text-gray-400" />
                              </button>
                              <button
                                onClick={() => avaliarResposta(conversa.id, 'positiva')}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Útil"
                              >
                                <ThumbsUp className="h-3 w-3 text-gray-400" />
                              </button>
                              <button
                                onClick={() => avaliarResposta(conversa.id, 'negativa')}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Não útil"
                              >
                                <ThumbsDown className="h-3 w-3 text-gray-400" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(isTyping || loading) && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sugestões */}
            {sugestoes.length > 0 && (
              <div className="p-3 bg-white border-t">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-600">Sugestões:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sugestoes.map((sugestao, index) => (
                    <button
                      key={index}
                      onClick={() => enviarMensagem(sugestao)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
                    >
                      {sugestao}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                    placeholder="Digite sua pergunta..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    onClick={limparConversa}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    title="Limpar conversa"
                  >
                    <RefreshCw className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <button
                  onClick={() => enviarMensagem()}
                  disabled={!mensagem.trim() || isTyping || loading}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Sparkles className="h-3 w-3" />
                  <span>Powered by GPT-4o</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
          </>
        )}

        {isMinimized && (
          <div className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Mirante</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IAMirante;

