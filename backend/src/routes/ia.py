from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from openai import OpenAI
import os
from src.config import Config
from src.models import User
from datetime import datetime, timedelta
import json

ia_bp = Blueprint('ia', __name__)

# Configurar OpenAI
client = OpenAI(api_key=Config.OPENAI_API_KEY) if Config.OPENAI_API_KEY else None

@ia_bp.route('/analisar-desempenho', methods=['POST'])
@jwt_required()
def analisar_desempenho():
    """IA Mirante - Análise de desempenho do usuário logado"""
    try:
        user_id = get_jwt_identity()
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        data = request.get_json()
        periodo = data.get('periodo', '30')  # últimos 30 dias por padrão
        
        # Dados simulados de desempenho (em produção, viria do banco de dados)
        dados_desempenho = {
            "orcamentos_criados": 15,
            "vendas_fechadas": 8,
            "valor_vendido": 45000.00,
            "visitas_realizadas": 12,
            "taxa_conversao": 53.3,
            "meta_mensal": 60000.00,
            "ranking_equipe": 2
        }
        
        # Prompt para análise de desempenho
        prompt = f"""
        Analise o desempenho do colaborador {user['name']} da VIP Mudanças nos últimos {periodo} dias:
        
        Dados de Performance:
        - Orçamentos criados: {dados_desempenho['orcamentos_criados']}
        - Vendas fechadas: {dados_desempenho['vendas_fechadas']}
        - Valor vendido: R$ {dados_desempenho['valor_vendido']:,.2f}
        - Visitas realizadas: {dados_desempenho['visitas_realizadas']}
        - Taxa de conversão: {dados_desempenho['taxa_conversao']}%
        - Meta mensal: R$ {dados_desempenho['meta_mensal']:,.2f}
        - Posição no ranking: {dados_desempenho['ranking_equipe']}º lugar
        
        Forneça uma análise motivacional e construtiva em até 150 palavras, incluindo:
        1. Pontos fortes
        2. Áreas de melhoria
        3. Sugestões específicas
        4. Motivação personalizada
        """
        
        if not client:
            # Análise simulada
            analise = f"Parabéns {user['name']}! Seu desempenho está sólido com {dados_desempenho['vendas_fechadas']} vendas fechadas. Sua taxa de conversão de {dados_desempenho['taxa_conversao']}% está acima da média. Continue focando na qualidade das visitas para alcançar sua meta mensal!"
        else:
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "Você é a IA Mirante, assistente motivacional da VIP Mudanças. Seja positivo, específico e motivador."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=200,
                    temperature=0.7
                )
                
                analise = response.choices[0].message.content.strip()
                
            except Exception as e:
                print(f"Erro na API OpenAI: {e}")
                analise = f"Olá {user['name']}! Seu desempenho está sendo analisado. Continue o excelente trabalho!"
        
        return jsonify({
            "usuario": user['name'],
            "periodo": f"Últimos {periodo} dias",
            "dados_desempenho": dados_desempenho,
            "analise": analise,
            "gerado_em": datetime.utcnow().isoformat(),
            "assistente": "IA Mirante"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ia_bp.route('/feedback-motivacional', methods=['POST'])
@jwt_required()
def feedback_motivacional():
    """IA Mirante - Feedback motivacional personalizado"""
    try:
        user_id = get_jwt_identity()
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        data = request.get_json()
        meta_pessoal = data.get('meta_pessoal', 'carro novo')  # ex: carro, viagem, casa
        valor_atual = data.get('valor_atual', 15000.00)
        valor_meta = data.get('valor_meta', 50000.00)
        
        progresso = (valor_atual / valor_meta) * 100
        falta = valor_meta - valor_atual
        
        prompt = f"""
        Crie uma mensagem motivacional personalizada para {user['name']} da VIP Mudanças:
        
        Meta pessoal: {meta_pessoal}
        Valor atual acumulado: R$ {valor_atual:,.2f}
        Valor da meta: R$ {valor_meta:,.2f}
        Progresso: {progresso:.1f}%
        Falta: R$ {falta:,.2f}
        
        Crie uma mensagem motivacional de até 100 palavras que:
        1. Reconheça o progresso atual
        2. Conecte o trabalho com a meta pessoal
        3. Seja inspiradora e específica
        4. Inclua uma ação concreta
        """
        
        if not client:
            # Feedback simulado
            feedback = f"🎯 {user['name']}, você já conquistou {progresso:.1f}% da sua meta para {meta_pessoal}! Cada venda te aproxima do seu sonho. Continue assim!"
        else:
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "Você é a IA Mirante, especialista em motivação e coaching para vendedores. Use emojis e seja inspirador."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=150,
                    temperature=0.8
                )
                
                feedback = response.choices[0].message.content.strip()
                
            except Exception as e:
                print(f"Erro na API OpenAI: {e}")
                feedback = f"🚀 {user['name']}, você está no caminho certo! Cada cliente atendido te aproxima da sua {meta_pessoal}. Continue focado!"
        
        return jsonify({
            "usuario": user['name'],
            "meta_pessoal": meta_pessoal,
            "progresso_percentual": round(progresso, 1),
            "valor_faltante": falta,
            "feedback": feedback,
            "gerado_em": datetime.utcnow().isoformat(),
            "assistente": "IA Mirante"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ia_bp.route('/sugestoes-setor', methods=['POST'])
@jwt_required()
def sugestoes_setor():
    """IA Mirante - Sugestões específicas por setor"""
    try:
        user_id = get_jwt_identity()
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        data = request.get_json()
        setor = data.get('setor', 'comercial')  # comercial, operacional, vistoria
        contexto = data.get('contexto', '')
        
        prompts_setor = {
            'comercial': f"""
            Forneça 3 sugestões práticas para melhorar as vendas na VIP Mudanças:
            
            Contexto atual: {contexto}
            Usuário: {user['name']}
            
            Foque em:
            - Técnicas de abordagem
            - Fechamento de vendas
            - Relacionamento com cliente
            - Prospecção
            
            Máximo 200 palavras, seja específico e prático.
            """,
            'operacional': f"""
            Forneça 3 sugestões para otimizar as operações de mudança:
            
            Contexto atual: {contexto}
            Usuário: {user['name']}
            
            Foque em:
            - Eficiência operacional
            - Qualidade do serviço
            - Gestão de equipe
            - Redução de custos
            
            Máximo 200 palavras, seja específico e prático.
            """,
            'vistoria': f"""
            Forneça 3 sugestões para melhorar o processo de vistoria:
            
            Contexto atual: {contexto}
            Usuário: {user['name']}
            
            Foque em:
            - Precisão na cubagem
            - Experiência do cliente
            - Documentação
            - Tecnologia
            
            Máximo 200 palavras, seja específico e prático.
            """
        }
        
        prompt = prompts_setor.get(setor, prompts_setor['comercial'])
        
        if not client:
            # Sugestões simuladas por setor
            sugestoes_simuladas = {
                'comercial': [
                    "Implemente follow-up estruturado em 24h, 3 dias e 1 semana",
                    "Use WhatsApp Business para envio de portfólio visual",
                    "Crie propostas personalizadas com fotos de trabalhos similares"
                ],
                'operacional': [
                    "Padronize checklist de materiais por tipo de mudança",
                    "Implemente sistema de rastreamento em tempo real",
                    "Crie treinamento mensal para equipe operacional"
                ],
                'vistoria': [
                    "Use aplicativo móvel para cubagem com fotos",
                    "Crie relatório visual para o cliente",
                    "Implemente assinatura digital no local"
                ]
            }
            sugestoes = sugestoes_simuladas.get(setor, sugestoes_simuladas['comercial'])
        else:
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": f"Você é a IA Mirante, especialista em otimização de processos para empresas de mudança. Foque no setor {setor}."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=250,
                    temperature=0.7
                )
                
                resposta = response.choices[0].message.content.strip()
                # Extrair sugestões (assumindo que vêm numeradas)
                sugestoes = [linha.strip() for linha in resposta.split('\n') if linha.strip() and any(char.isdigit() for char in linha[:3])]
                if not sugestoes:
                    sugestoes = [resposta]  # Se não conseguir extrair, usa a resposta completa
                
            except Exception as e:
                print(f"Erro na API OpenAI: {e}")
                sugestoes = [f"Analise os processos atuais do setor {setor} e identifique oportunidades de melhoria."]
        
        return jsonify({
            "usuario": user['name'],
            "setor": setor,
            "sugestoes": sugestoes,
            "contexto": contexto,
            "gerado_em": datetime.utcnow().isoformat(),
            "assistente": "IA Mirante"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ia_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat_ia():
    """IA Mirante - Chat interativo personalizado"""
    try:
        user_id = get_jwt_identity()
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        data = request.get_json()
        pergunta = data.get('pergunta', '')
        contexto = data.get('contexto', '')
        
        prompt = f"""
        Você é a IA Mirante, assistente especializada da VIP Mudanças.
        
        Usuário: {user['name']}
        Contexto: {contexto}
        Pergunta: {pergunta}
        
        Responda de forma útil, prática e específica para o negócio de mudanças.
        Seja motivador e use o nome do usuário na resposta.
        Máximo 200 palavras.
        """
        
        if not client:
            resposta = f"Olá {user['name']}! Sou a IA Mirante, sua assistente na VIP Mudanças. Como posso ajudar você hoje? 🚀"
        else:
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "Você é a IA Mirante, assistente especializada em mudanças residenciais e comerciais da VIP Mudanças. Seja sempre positiva e motivadora."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=250,
                    temperature=0.7
                )
                
                resposta = response.choices[0].message.content.strip()
                
            except Exception as e:
                print(f"Erro na API OpenAI: {e}")
                resposta = f"Olá {user['name']}! Estou aqui para ajudar. No momento estou com dificuldades técnicas, mas continue com o excelente trabalho!"
        
        return jsonify({
            "usuario": user['name'],
            "pergunta": pergunta,
            "resposta": resposta,
            "gerado_em": datetime.utcnow().isoformat(),
            "assistente": "IA Mirante"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Manter endpoints existentes para compatibilidade
@ia_bp.route('/analisar-cliente', methods=['POST'])
@jwt_required()
def analisar_cliente():
    """IA Mirante - Análise automática de cliente (compatibilidade)"""
    try:
        data = request.get_json()
        nome = data.get('nome', '')
        email = data.get('email', '')
        telefone = data.get('telefone', '')
        empresa = data.get('empresa', '')
        
        prompt = f"""
        Analise o seguinte cliente e classifique seu perfil como A, B ou AA:
        
        Nome: {nome}
        Email: {email}
        Telefone: {telefone}
        Empresa: {empresa}
        
        Critérios:
        - Perfil AA: Cliente premium, empresa grande, alto potencial de faturamento
        - Perfil A: Cliente bom, empresa média, potencial moderado
        - Perfil B: Cliente básico, empresa pequena, potencial baixo
        
        Responda apenas com a classificação (A, B ou AA) e uma breve justificativa de até 100 palavras.
        """
        
        if not client:
            perfil = "A"
            justificativa = "Análise simulada: Cliente com potencial moderado baseado nos dados fornecidos."
        else:
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "Você é um assistente especializado em análise de clientes para empresa de mudanças."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=150,
                    temperature=0.7
                )
                
                resultado = response.choices[0].message.content.strip()
                
                if "AA" in resultado:
                    perfil = "AA"
                elif "A" in resultado:
                    perfil = "A"
                else:
                    perfil = "B"
                
                justificativa = resultado
                
            except Exception as e:
                print(f"Erro na API OpenAI: {e}")
                perfil = "A"
                justificativa = "Análise padrão aplicada devido a erro na IA."
        
        return jsonify({
            "perfil": perfil,
            "justificativa": justificativa,
            "analisado_por": "IA Mirante"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

