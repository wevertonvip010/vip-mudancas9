import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Image, 
  Eye, 
  FileText, 
  Download, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Loader,
  Maximize2,
  X,
  BarChart3,
  Shield,
  Package
} from 'lucide-react';

const AnaliseVision = ({ visitaId, onAnaliseCompleta }) => {
  const [fotos, setFotos] = useState([]);
  const [analisando, setAnalisando] = useState(false);
  const [tipoAnalise, setTipoAnalise] = useState('geral');
  const [observacoes, setObservacoes] = useState('');
  const [resultados, setResultados] = useState([]);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const tiposAnalise = [
    { value: 'geral', label: 'Análise Geral', icon: Eye, color: 'blue' },
    { value: 'cubagem', label: 'Cubagem Detalhada', icon: Package, color: 'green' },
    { value: 'seguranca', label: 'Segurança e Riscos', icon: Shield, color: 'red' }
  ];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const novaFoto = {
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            nome: file.name,
            tamanho: file.size,
            analisada: false
          };
          setFotos(prev => [...prev, novaFoto]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analisarFoto = async (foto) => {
    setAnalisando(true);
    
    try {
      const formData = new FormData();
      formData.append('foto', foto.file);
      formData.append('tipo_analise', tipoAnalise);
      formData.append('observacoes', observacoes);
      formData.append('visita_id', visitaId);

      const response = await fetch('/api/vision/analisar-foto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const resultado = {
          ...data.resultado,
          foto_id: foto.id,
          foto_preview: foto.preview
        };

        setResultados(prev => [...prev, resultado]);
        
        // Marcar foto como analisada
        setFotos(prev => prev.map(f => 
          f.id === foto.id ? { ...f, analisada: true } : f
        ));

        if (onAnaliseCompleta) {
          onAnaliseCompleta(resultado);
        }

        // Mostrar resultado
        setFotoSelecionada(resultado);
        setShowModal(true);
      } else {
        alert('Erro ao analisar foto: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao analisar foto:', error);
      alert('Erro ao analisar foto. Tente novamente.');
    } finally {
      setAnalisando(false);
    }
  };

  const analisarTodasFotos = async () => {
    const fotosNaoAnalisadas = fotos.filter(f => !f.analisada);
    
    for (const foto of fotosNaoAnalisadas) {
      await analisarFoto(foto);
      // Pequeno delay entre análises
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const removerFoto = (fotoId) => {
    setFotos(prev => prev.filter(f => f.id !== fotoId));
    setResultados(prev => prev.filter(r => r.foto_id !== fotoId));
  };

  const gerarPlanilhaCubagem = async () => {
    try {
      const response = await fetch('/api/vision/gerar-planilha-cubagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          analises: resultados,
          visita_id: visitaId,
          cliente: 'Cliente da Visita',
          endereco: 'Endereço da Visita',
          responsavel: 'Responsável pela Vistoria'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Criar e baixar arquivo
        const blob = new Blob([JSON.stringify(data.planilha, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `planilha_cubagem_${visitaId}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erro ao gerar planilha:', error);
      alert('Erro ao gerar planilha de cubagem.');
    }
  };

  const formatarTamanhoArquivo = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Camera className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Análise de Fotos com IA Vision</h3>
        </div>
        {resultados.length > 0 && (
          <button
            onClick={gerarPlanilhaCubagem}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            <span>Gerar Planilha</span>
          </button>
        )}
      </div>

      {/* Configurações de Análise */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Configurações da Análise</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {tiposAnalise.map((tipo) => {
            const IconComponent = tipo.icon;
            return (
              <button
                key={tipo.value}
                onClick={() => setTipoAnalise(tipo.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  tipoAnalise === tipo.value
                    ? `border-${tipo.color}-500 bg-${tipo.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-5 w-5 ${
                    tipoAnalise === tipo.value ? `text-${tipo.color}-600` : 'text-gray-500'
                  }`} />
                  <span className={`font-medium ${
                    tipoAnalise === tipo.value ? `text-${tipo.color}-900` : 'text-gray-700'
                  }`}>
                    {tipo.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações Adicionais
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Informações específicas sobre o ambiente ou itens..."
          />
        </div>
      </div>

      {/* Upload de Fotos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Fotos da Vistoria</h4>
          <div className="flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              <span>Adicionar Fotos</span>
            </button>
            {fotos.length > 0 && (
              <button
                onClick={analisarTodasFotos}
                disabled={analisando}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {analisando ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span>Analisar Todas</span>
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Grid de Fotos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto) => (
            <div key={foto.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={foto.preview}
                  alt={foto.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Status da Análise */}
              <div className="absolute top-2 right-2">
                {foto.analisada ? (
                  <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500 bg-white rounded-full" />
                )}
              </div>

              {/* Ações */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => analisarFoto(foto)}
                    disabled={analisando || foto.analisada}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removerFoto(foto.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Info da Foto */}
              <div className="mt-2">
                <p className="text-xs text-gray-600 truncate">{foto.nome}</p>
                <p className="text-xs text-gray-500">{formatarTamanhoArquivo(foto.tamanho)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados das Análises */}
      {resultados.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Resultados das Análises</h4>
          <div className="space-y-3">
            {resultados.map((resultado, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Análise {index + 1} - {resultado.tipo_analise}
                  </span>
                  <button
                    onClick={() => {
                      setFotoSelecionada(resultado);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {resultado.analise.substring(0, 200)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Resultado Detalhado */}
      {showModal && fotoSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Resultado da Análise - {fotoSelecionada.tipo_analise}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Foto */}
                <div>
                  <img
                    src={fotoSelecionada.foto_preview}
                    alt="Foto analisada"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
                
                {/* Análise */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Análise Detalhada</h4>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {fotoSelecionada.analise}
                    </pre>
                  </div>
                  
                  {fotoSelecionada.observacoes_cliente && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Observações do Cliente</h5>
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        {fotoSelecionada.observacoes_cliente}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Analisado em: {new Date(fotoSelecionada.timestamp).toLocaleString('pt-BR')}</p>
                    {fotoSelecionada.tokens_usados > 0 && (
                      <p>Tokens utilizados: {fotoSelecionada.tokens_usados}</p>
                    )}
                    {fotoSelecionada.modo_demo && (
                      <p className="text-yellow-600">⚠️ Modo demonstrativo</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnaliseVision;

