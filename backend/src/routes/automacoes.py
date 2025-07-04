from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
import requests
from src.config import Config

automacoes_bp = Blueprint('automacoes', __name__)

# Configurações para integrações
MANYCHAT_API_URL = "https://api.manychat.com/fb"
GOOGLE_AGENDA_API_URL = "https://www.googleapis.com/calendar/v3"

@automacoes_bp.route('/webhook/manychat', methods=['POST'])
def webhook_manychat():
    """Webhook para receber dados do ManyChat"""
    try:
        data = request.get_json()
        
        # Log do webhook recebido
        print(f"Webhook ManyChat recebido: {data}")
        
        # Processar diferentes tipos de eventos
        event_type = data.get('type', '')
        
        if event_type == 'lead_capture':
            return processar_lead_manychat(data)
        elif event_type == 'appointment_request':
            return processar_agendamento_manychat(data)
        elif event_type == 'feedback_request':
            return processar_feedback_manychat(data)
        else:
            return jsonify({'status': 'received', 'message': 'Evento não processado'}), 200
            
    except Exception as e:
        print(f"Erro no webhook ManyChat: {e}")
        return jsonify({'error': str(e)}), 500

def processar_lead_manychat(data):
    """Processa captura de lead do ManyChat"""
    try:
        lead_data = data.get('lead', {})
        
        # Extrair informações do lead
        nome = lead_data.get('name', '')
        telefone = lead_data.get('phone', '')
        email = lead_data.get('email', '')
        origem = lead_data.get('source', 'ManyChat')
        
        # Criar lead no sistema
        novo_lead = {
            'nome': nome,
            'telefone': telefone,
            'email': email,
            'origem': origem,
            'status': 'novo',
            'data_criacao': datetime.now().isoformat(),
            'manychat_id': lead_data.get('id'),
            'tags': lead_data.get('tags', [])
        }
        
        # Aqui você salvaria no banco de dados
        # leads_collection.insert_one(novo_lead)
        
        # Resposta automática via ManyChat
        resposta_automatica = {
            'subscriber_id': lead_data.get('id'),
            'message': f"Olá {nome}! Recebemos seu interesse. Nossa equipe entrará em contato em breve!"
        }
        
        # Enviar resposta (implementar chamada para API do ManyChat)
        # enviar_mensagem_manychat(resposta_automatica)
        
        return jsonify({
            'status': 'success',
            'message': 'Lead processado com sucesso',
            'lead_id': novo_lead.get('manychat_id')
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao processar lead: {str(e)}'}), 500

def processar_agendamento_manychat(data):
    """Processa solicitação de agendamento do ManyChat"""
    try:
        agendamento_data = data.get('appointment', {})
        lead_data = data.get('lead', {})
        
        # Extrair informações do agendamento
        nome = lead_data.get('name', '')
        telefone = lead_data.get('phone', '')
        data_preferida = agendamento_data.get('preferred_date', '')
        hora_preferida = agendamento_data.get('preferred_time', '')
        endereco = agendamento_data.get('address', '')
        tipo_mudanca = agendamento_data.get('move_type', 'Residencial')
        
        # Criar visita no sistema
        nova_visita = {
            'cliente': nome,
            'telefone': telefone,
            'endereco': endereco,
            'data': data_preferida,
            'hora': hora_preferida,
            'tipo_mudanca': tipo_mudanca,
            'status': 'agendada',
            'origem': 'ManyChat',
            'responsavel': 'Kenneth',  # Padrão
            'data_criacao': datetime.now().isoformat(),
            'manychat_id': lead_data.get('id')
        }
        
        # Aqui você salvaria no banco de dados
        # visitas_collection.insert_one(nova_visita)
        
        # Criar evento no Google Agenda
        evento_google = criar_evento_google_agenda(nova_visita)
        
        # Resposta de confirmação
        mensagem_confirmacao = f"""
✅ Agendamento confirmado!

📅 Data: {data_preferida}
🕐 Horário: {hora_preferida}
📍 Endereço: {endereco}
👤 Responsável: Kenneth

Você receberá uma confirmação por WhatsApp 1 dia antes da visita.
        """
        
        return jsonify({
            'status': 'success',
            'message': 'Agendamento processado com sucesso',
            'visita_id': nova_visita.get('manychat_id'),
            'google_event_id': evento_google.get('id') if evento_google else None,
            'confirmation_message': mensagem_confirmacao
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao processar agendamento: {str(e)}'}), 500

def processar_feedback_manychat(data):
    """Processa feedback de cliente do ManyChat"""
    try:
        feedback_data = data.get('feedback', {})
        lead_data = data.get('lead', {})
        
        # Extrair informações do feedback
        nome = lead_data.get('name', '')
        avaliacao = feedback_data.get('rating', 0)
        comentario = feedback_data.get('comment', '')
        servico_id = feedback_data.get('service_id', '')
        
        # Criar feedback no sistema
        novo_feedback = {
            'cliente': nome,
            'avaliacao': avaliacao,
            'comentario': comentario,
            'servico_id': servico_id,
            'data_feedback': datetime.now().isoformat(),
            'origem': 'ManyChat',
            'manychat_id': lead_data.get('id')
        }
        
        # Aqui você salvaria no banco de dados
        # feedbacks_collection.insert_one(novo_feedback)
        
        # Se avaliação for alta (4-5), solicitar avaliação no Google
        if avaliacao >= 4:
            mensagem_google = f"""
🌟 Obrigado pela avaliação {avaliacao}/5!

Que tal compartilhar sua experiência no Google também?
👉 https://g.page/r/vipmudancas/review

Isso nos ajuda muito! 🙏
            """
        else:
            mensagem_google = f"""
Obrigado pelo seu feedback. Vamos usar suas sugestões para melhorar nossos serviços.

Nossa equipe entrará em contato para resolver qualquer questão.
            """
        
        return jsonify({
            'status': 'success',
            'message': 'Feedback processado com sucesso',
            'feedback_id': novo_feedback.get('manychat_id'),
            'response_message': mensagem_google
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao processar feedback: {str(e)}'}), 500

@automacoes_bp.route('/automacao/enviar-lembrete', methods=['POST'])
def enviar_lembrete_visita():
    """Envia lembrete automático de visita"""
    try:
        data = request.get_json()
        visita_id = data.get('visita_id')
        tipo_lembrete = data.get('tipo', '24h')  # 24h, 2h, pos_visita
        
        # Buscar dados da visita
        # visita = visitas_collection.find_one({'_id': visita_id})
        
        # Mock da visita para demonstração
        visita = {
            'cliente': 'João Silva',
            'telefone': '11999999999',
            'data': '2024-07-03',
            'hora': '14:00',
            'endereco': 'Rua das Flores, 123',
            'responsavel': 'Kenneth'
        }
        
        mensagens = {
            '24h': f"""
🚛 VIP Mudanças - Lembrete de Visita

Olá {visita['cliente']}!

Lembramos que sua visita técnica está agendada para:
📅 {visita['data']} às {visita['hora']}
📍 {visita['endereco']}
👤 Técnico: {visita['responsavel']}

Estaremos no local no horário combinado!

Dúvidas? Responda esta mensagem.
            """,
            '2h': f"""
🕐 VIP Mudanças - Visita em 2 horas

Olá {visita['cliente']}!

Nosso técnico {visita['responsavel']} está a caminho!
Chegada prevista: {visita['hora']}

Confirme se estará no local: {visita['endereco']}
            """,
            'pos_visita': f"""
✅ VIP Mudanças - Obrigado pela visita!

Olá {visita['cliente']}!

Obrigado por nos receber hoje. Seu orçamento será enviado em até 24h.

Avalie nosso atendimento (1-5): 
⭐⭐⭐⭐⭐

Responda com o número de estrelas!
            """
        }
        
        mensagem = mensagens.get(tipo_lembrete, mensagens['24h'])
        
        # Aqui você enviaria via WhatsApp Business API ou ManyChat
        resultado_envio = enviar_whatsapp(visita['telefone'], mensagem)
        
        return jsonify({
            'status': 'success',
            'message': 'Lembrete enviado com sucesso',
            'tipo': tipo_lembrete,
            'destinatario': visita['telefone']
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao enviar lembrete: {str(e)}'}), 500

@automacoes_bp.route('/automacao/google-agenda', methods=['POST'])
def criar_evento_google_agenda(visita_data=None):
    """Cria evento no Google Agenda"""
    try:
        if not visita_data:
            visita_data = request.get_json()
        
        # Configurar evento
        evento = {
            'summary': f"Visita Técnica - {visita_data.get('cliente')}",
            'description': f"""
Visita técnica VIP Mudanças

Cliente: {visita_data.get('cliente')}
Telefone: {visita_data.get('telefone')}
Endereço: {visita_data.get('endereco')}
Tipo: {visita_data.get('tipo_mudanca', 'Residencial')}
Responsável: {visita_data.get('responsavel', 'Kenneth')}
            """,
            'location': visita_data.get('endereco'),
            'start': {
                'dateTime': f"{visita_data.get('data')}T{visita_data.get('hora')}:00",
                'timeZone': 'America/Sao_Paulo'
            },
            'end': {
                'dateTime': f"{visita_data.get('data')}T{calcular_hora_fim(visita_data.get('hora'))}:00",
                'timeZone': 'America/Sao_Paulo'
            },
            'attendees': [
                {'email': 'vip@vipmudancas.com.br'},
                {'email': f"{visita_data.get('responsavel', 'kenneth').lower()}@vipmudancas.com.br"}
            ],
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},  # 24h antes
                    {'method': 'popup', 'minutes': 120}       # 2h antes
                ]
            }
        }
        
        # Aqui você faria a chamada real para Google Calendar API
        # service = build('calendar', 'v3', credentials=creds)
        # event = service.events().insert(calendarId='primary', body=evento).execute()
        
        # Mock de resposta
        evento_criado = {
            'id': f"evento_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'htmlLink': 'https://calendar.google.com/calendar/event?eid=mock',
            'status': 'confirmed'
        }
        
        return jsonify({
            'status': 'success',
            'message': 'Evento criado no Google Agenda',
            'event': evento_criado
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao criar evento: {str(e)}'}), 500

@automacoes_bp.route('/automacao/planilhas', methods=['POST'])
def enviar_dados_planilha():
    """Envia dados para planilhas Google Sheets"""
    try:
        data = request.get_json()
        tipo_planilha = data.get('tipo')  # leads, visitas, orcamentos, vendas
        dados = data.get('dados')
        
        planilhas_config = {
            'leads': {
                'sheet_id': '1ABC123_LEADS_SHEET_ID',
                'range': 'Leads!A:F',
                'headers': ['Data', 'Nome', 'Telefone', 'Email', 'Origem', 'Status']
            },
            'visitas': {
                'sheet_id': '1DEF456_VISITAS_SHEET_ID', 
                'range': 'Visitas!A:H',
                'headers': ['Data', 'Cliente', 'Telefone', 'Endereço', 'Responsável', 'Status', 'Tipo', 'Observações']
            },
            'orcamentos': {
                'sheet_id': '1GHI789_ORCAMENTOS_SHEET_ID',
                'range': 'Orçamentos!A:J',
                'headers': ['Data', 'Cliente', 'Valor', 'Status', 'Responsável', 'Origem', 'Cubagem', 'Distância', 'Observações', 'Validade']
            }
        }
        
        config = planilhas_config.get(tipo_planilha)
        if not config:
            return jsonify({'error': 'Tipo de planilha não suportado'}), 400
        
        # Aqui você faria a chamada real para Google Sheets API
        # service = build('sheets', 'v4', credentials=creds)
        # result = service.spreadsheets().values().append(
        #     spreadsheetId=config['sheet_id'],
        #     range=config['range'],
        #     valueInputOption='RAW',
        #     body={'values': [dados]}
        # ).execute()
        
        return jsonify({
            'status': 'success',
            'message': f'Dados enviados para planilha {tipo_planilha}',
            'sheet_id': config['sheet_id']
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao enviar para planilha: {str(e)}'}), 500

def enviar_whatsapp(telefone, mensagem):
    """Envia mensagem via WhatsApp Business API"""
    try:
        # Aqui você implementaria a integração com WhatsApp Business API
        # ou com serviços como Twilio, ChatAPI, etc.
        
        # Mock de envio
        return {
            'status': 'sent',
            'message_id': f"msg_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'telefone': telefone
        }
        
    except Exception as e:
        return {'status': 'error', 'error': str(e)}

def calcular_hora_fim(hora_inicio):
    """Calcula hora de fim da visita (1h30 depois)"""
    try:
        hora, minuto = map(int, hora_inicio.split(':'))
        inicio = datetime.strptime(f"{hora}:{minuto}", "%H:%M")
        fim = inicio + timedelta(hours=1, minutes=30)
        return fim.strftime("%H:%M")
    except:
        return "15:30"  # Padrão se der erro

@automacoes_bp.route('/automacao/status', methods=['GET'])
def status_automacoes():
    """Retorna status das automações"""
    return jsonify({
        'status': 'active',
        'integracoes': {
            'manychat': 'configurado',
            'google_agenda': 'configurado', 
            'google_sheets': 'configurado',
            'whatsapp_business': 'pendente'
        },
        'webhooks_ativos': [
            '/webhook/manychat'
        ],
        'ultima_atualizacao': datetime.now().isoformat()
    }), 200

