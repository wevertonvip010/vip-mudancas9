from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Dados mock em memória
users = [
    {
        "id": "1",
        "email": "admin@vipmudancas.com.br",
        "password": "vip123456",
        "name": "Administrador VIP",
        "role": "admin"
    }
]

clientes = []
leads = []
licitacoes = []

@app.route('/api/health', methods=['GET'])
def health_check():
    return {"status": "ok", "message": "VIP Mudanças API Mock está funcionando"}, 200

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Verificar credenciais
    user = next((u for u in users if u['email'] == email and u['password'] == password), None)
    
    if user:
        return {
            "access_token": "mock_token_123",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"]
            }
        }, 200
    else:
        return {"error": "Credenciais inválidas"}, 401

@app.route('/api/dashboard/metricas', methods=['GET'])
def get_metricas():
    return {
        "total_clientes": len(clientes),
        "leads_mes": len(leads),
        "orcamentos_pendentes": 5,
        "receita_mes": 25000.00,
        "mudancas_agendadas": 8,
        "contratos_ativos": 12
    }, 200

@app.route('/api/dashboard/atividades-recentes', methods=['GET'])
def get_atividades():
    return [
        {
            "id": "1",
            "tipo": "cliente",
            "descricao": "Novo cliente cadastrado: João Silva",
            "data": "2025-06-21T10:30:00Z"
        },
        {
            "id": "2", 
            "tipo": "orcamento",
            "descricao": "Orçamento #001 enviado para Maria Santos",
            "data": "2025-06-21T09:15:00Z"
        }
    ], 200

@app.route('/api/dashboard/calendario', methods=['GET'])
def get_calendario():
    return [
        {
            "id": "1",
            "titulo": "Mudança - Família Silva",
            "data": "2025-06-22",
            "tipo": "mudanca",
            "status": "agendado"
        },
        {
            "id": "2",
            "titulo": "Visita técnica - Empresa ABC",
            "data": "2025-06-23",
            "tipo": "visita",
            "status": "confirmado"
        }
    ], 200

@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    return clientes, 200

@app.route('/api/clientes', methods=['POST'])
def create_cliente():
    data = request.get_json()
    cliente = {
        "id": str(len(clientes) + 1),
        "nome": data.get('nome'),
        "email": data.get('email'),
        "telefone": data.get('telefone'),
        "endereco": data.get('endereco'),
        "status": "Novo",
        "created_at": "2025-06-21T14:00:00Z"
    }
    clientes.append(cliente)
    return cliente, 201

@app.route('/api/leads', methods=['GET'])
def get_leads():
    return leads, 200

@app.route('/api/licitacoes', methods=['GET'])
def get_licitacoes():
    return licitacoes, 200

if __name__ == '__main__':
    print("🚀 Iniciando VIP Mudanças API Mock...")
    print("📍 Usuário padrão: admin@vipmudancas.com.br / vip123456")
    app.run(host='0.0.0.0', port=5000, debug=True)

