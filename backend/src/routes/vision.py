from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import base64
from datetime import datetime
import openai
from src.config import Config

vision_bp = Blueprint('vision', __name__)

# Configurar OpenAI
openai.api_key = Config.OPENAI_API_KEY

UPLOAD_FOLDER = 'uploads/visitas'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

@vision_bp.route('/analisar-foto', methods=['POST'])
def analisar_foto():
    """Analisa foto de vistoria usando OpenAI Vision"""
    try:
        ensure_upload_folder()
        
        # Verificar se há arquivo na requisição
        if 'foto' not in request.files:
            return jsonify({'error': 'Nenhuma foto enviada'}), 400
        
        file = request.files['foto']
        if file.filename == '':
            return jsonify({'error': 'Nenhuma foto selecionada'}), 400
        
        if file and allowed_file(file.filename):
            # Salvar arquivo
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            # Converter para base64 para enviar para OpenAI
            with open(filepath, "rb") as image_file:
                base64_image = base64.b64encode(image_file.read()).decode('utf-8')
            
            # Obter dados adicionais da requisição
            tipo_analise = request.form.get('tipo_analise', 'geral')
            observacoes = request.form.get('observacoes', '')
            
            # Prompt personalizado baseado no tipo de análise
            prompts = {
                'geral': """Analise esta foto de vistoria de mudança e forneça:

1. **Descrição do ambiente**: Que tipo de cômodo/espaço é este?
2. **Itens identificados**: Liste os móveis, eletrodomésticos e objetos visíveis
3. **Estimativa de volume**: Aproximadamente quantos metros cúbicos de itens há neste ambiente?
4. **Complexidade da mudança**: Avalie a dificuldade (baixa/média/alta) considerando:
   - Tamanho e peso dos itens
   - Fragilidade dos objetos
   - Acesso ao local
5. **Recomendações**: Sugestões para embalagem e transporte
6. **Observações especiais**: Itens que requerem cuidado especial

Seja detalhado e prático nas suas observações.""",

                'cubagem': """Analise esta foto focando na CUBAGEM para mudança:

1. **Inventário detalhado**: Liste TODOS os itens visíveis com dimensões aproximadas
2. **Cálculo de volume**: 
   - Volume individual de cada item principal
   - Volume total estimado em m³
3. **Classificação por tamanho**:
   - Itens pequenos (caixas, objetos)
   - Itens médios (cadeiras, mesa pequena)
   - Itens grandes (sofá, cama, guarda-roupa)
4. **Peso estimado**: Classificação de peso por item
5. **Tipo de embalagem necessária**: Especifique materiais e quantidades
6. **Número de pessoas necessárias**: Para carregar cada item

Forneça números específicos e seja preciso nas medidas.""",

                'seguranca': """Analise esta foto focando em SEGURANÇA para mudança:

1. **Riscos identificados**:
   - Itens frágeis ou valiosos
   - Objetos pesados que requerem equipamentos especiais
   - Riscos de acesso (escadas, corredores estreitos)
2. **Equipamentos necessários**:
   - EPIs recomendados
   - Ferramentas e equipamentos de transporte
3. **Cuidados especiais**:
   - Itens que precisam de desmontagem
   - Objetos que requerem embalagem especial
4. **Planejamento de rota**: Melhor sequência para retirada
5. **Recomendações de seguro**: Itens de alto valor
6. **Alertas importantes**: Qualquer risco específico identificado

Priorize a segurança da equipe e dos bens."""
            }
            
            prompt = prompts.get(tipo_analise, prompts['geral'])
            
            if observacoes:
                prompt += f"\n\nObservações adicionais do cliente: {observacoes}"
            
            try:
                # Chamar OpenAI Vision API
                response = openai.ChatCompletion.create(
                    model="gpt-4-vision-preview",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt},
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{base64_image}"
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens=1000
                )
                
                analise = response.choices[0].message.content
                
                # Salvar resultado
                resultado = {
                    'foto_path': filepath,
                    'foto_url': f'/uploads/visitas/{filename}',
                    'tipo_analise': tipo_analise,
                    'analise': analise,
                    'observacoes_cliente': observacoes,
                    'timestamp': datetime.now().isoformat(),
                    'tokens_usados': response.usage.total_tokens if hasattr(response, 'usage') else 0
                }
                
                return jsonify({
                    'success': True,
                    'resultado': resultado
                })
                
            except Exception as e:
                # Fallback para análise mock se OpenAI falhar
                analise_mock = gerar_analise_mock(tipo_analise, filename)
                
                resultado = {
                    'foto_path': filepath,
                    'foto_url': f'/uploads/visitas/{filename}',
                    'tipo_analise': tipo_analise,
                    'analise': analise_mock,
                    'observacoes_cliente': observacoes,
                    'timestamp': datetime.now().isoformat(),
                    'tokens_usados': 0,
                    'modo_demo': True
                }
                
                return jsonify({
                    'success': True,
                    'resultado': resultado,
                    'warning': 'Usando análise demonstrativa (OpenAI indisponível)'
                })
        
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
        
    except Exception as e:
        return jsonify({'error': f'Erro ao processar foto: {str(e)}'}), 500

def gerar_analise_mock(tipo_analise, filename):
    """Gera análise mock para demonstração"""
    
    if tipo_analise == 'cubagem':
        return """**ANÁLISE DE CUBAGEM - MODO DEMONSTRATIVO**

1. **Inventário detalhado**:
   - Sofá 3 lugares: 2,2m x 0,9m x 0,8m = 1,58 m³
   - Mesa de centro: 1,2m x 0,6m x 0,4m = 0,29 m³
   - Estante: 1,8m x 0,3m x 2,0m = 1,08 m³
   - TV 55": 1,3m x 0,8m x 0,1m = 0,10 m³
   - Objetos diversos: ~0,5 m³

2. **Volume total estimado**: 3,55 m³

3. **Classificação por tamanho**:
   - Grandes: Sofá, estante
   - Médios: Mesa de centro, TV
   - Pequenos: Objetos decorativos

4. **Peso estimado**: 
   - Sofá: ~80kg (pesado)
   - Estante: ~60kg (médio)
   - Mesa: ~25kg (leve)

5. **Embalagem necessária**:
   - Plástico bolha: 10m
   - Papelão: 5 folhas grandes
   - Fita adesiva: 3 rolos

6. **Equipe recomendada**: 3 pessoas para itens pesados"""
    
    elif tipo_analise == 'seguranca':
        return """**ANÁLISE DE SEGURANÇA - MODO DEMONSTRATIVO**

1. **Riscos identificados**:
   - TV de tela grande: risco de quebra
   - Sofá pesado: risco de lesão nas costas
   - Objetos de vidro na estante: frágeis

2. **Equipamentos necessários**:
   - Cinta para carregar sofá
   - Proteção para TV
   - Luvas antiderrapantes
   - Carrinho de transporte

3. **Cuidados especiais**:
   - Desmontar estante se possível
   - Embalar TV em caixa original ou proteção rígida
   - Retirar objetos frágeis primeiro

4. **Planejamento**: 
   - 1º: Objetos pequenos e frágeis
   - 2º: TV com proteção
   - 3º: Mesa de centro
   - 4º: Sofá (último, com 3 pessoas)

5. **Valor estimado para seguro**: R$ 8.000 - R$ 12.000

6. **Alertas**: Verificar largura da porta para passagem do sofá"""
    
    else:  # geral
        return """**ANÁLISE GERAL - MODO DEMONSTRATIVO**

1. **Descrição do ambiente**: Sala de estar residencial

2. **Itens identificados**:
   - Sofá de 3 lugares em tecido
   - Mesa de centro em madeira
   - Estante/rack para TV
   - Televisão de aproximadamente 55"
   - Objetos decorativos diversos

3. **Estimativa de volume**: Aproximadamente 3,5 m³

4. **Complexidade da mudança**: MÉDIA
   - Itens de tamanho médio a grande
   - Alguns objetos frágeis (TV, decorações)
   - Acesso aparentemente normal

5. **Recomendações**:
   - Usar proteção adequada para TV
   - Embalar objetos pequenos em caixas
   - Plástico bolha para móveis
   - Equipe de 3 pessoas recomendada

6. **Observações especiais**:
   - Verificar se sofá passa pela porta
   - Atenção especial com eletrônicos
   - Fotografar disposição para remontagem"""

@vision_bp.route('/gerar-planilha-cubagem', methods=['POST'])
def gerar_planilha_cubagem():
    """Gera planilha de cubagem baseada nas análises de fotos"""
    try:
        data = request.get_json()
        analises = data.get('analises', [])
        
        # Processar análises e gerar planilha estruturada
        planilha = {
            'cliente': data.get('cliente', ''),
            'endereco': data.get('endereco', ''),
            'data_vistoria': datetime.now().strftime('%d/%m/%Y'),
            'responsavel': data.get('responsavel', ''),
            'ambientes': [],
            'resumo': {
                'volume_total': 0,
                'peso_estimado': 0,
                'valor_estimado': 0,
                'equipe_recomendada': 0,
                'tempo_estimado': 0
            }
        }
        
        volume_total = 0
        for i, analise in enumerate(analises):
            ambiente = {
                'nome': f"Ambiente {i+1}",
                'foto': analise.get('foto_url', ''),
                'itens': extrair_itens_da_analise(analise.get('analise', '')),
                'volume_ambiente': extrair_volume_da_analise(analise.get('analise', ''))
            }
            planilha['ambientes'].append(ambiente)
            volume_total += ambiente['volume_ambiente']
        
        # Calcular resumo
        planilha['resumo']['volume_total'] = volume_total
        planilha['resumo']['peso_estimado'] = volume_total * 150  # kg aproximado
        planilha['resumo']['valor_estimado'] = calcular_valor_mudanca(volume_total)
        planilha['resumo']['equipe_recomendada'] = max(2, min(5, int(volume_total / 2)))
        planilha['resumo']['tempo_estimado'] = max(2, int(volume_total * 1.5))  # horas
        
        return jsonify({
            'success': True,
            'planilha': planilha
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro ao gerar planilha: {str(e)}'}), 500

def extrair_itens_da_analise(analise_texto):
    """Extrai lista de itens da análise de texto"""
    # Implementação simplificada - em produção seria mais sofisticada
    itens_comuns = [
        {'nome': 'Sofá', 'quantidade': 1, 'volume': 1.5, 'peso': 80},
        {'nome': 'Mesa', 'quantidade': 1, 'volume': 0.3, 'peso': 25},
        {'nome': 'Cadeiras', 'quantidade': 4, 'volume': 0.2, 'peso': 8},
        {'nome': 'TV', 'quantidade': 1, 'volume': 0.1, 'peso': 15}
    ]
    return itens_comuns

def extrair_volume_da_analise(analise_texto):
    """Extrai volume total da análise"""
    # Buscar por padrões de volume no texto
    import re
    match = re.search(r'(\d+[,.]?\d*)\s*m³', analise_texto)
    if match:
        return float(match.group(1).replace(',', '.'))
    return 2.0  # valor padrão

def calcular_valor_mudanca(volume):
    """Calcula valor estimado da mudança baseado no volume"""
    # Valores base por m³
    valor_base = 150  # R$ por m³
    return volume * valor_base

@vision_bp.route('/uploads/visitas/<filename>')
def uploaded_file(filename):
    """Serve arquivos de upload"""
    return send_from_directory(UPLOAD_FOLDER, filename)

