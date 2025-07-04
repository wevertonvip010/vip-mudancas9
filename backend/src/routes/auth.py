from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.models import User
import re

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de login"""
    try:
        data = request.get_json()
        cpf = data.get('cpf')
        password = data.get('password')
        
        if not cpf or not password:
            return jsonify({"error": "CPF e senha são obrigatórios"}), 400
        
        # Validar formato do CPF
        cpf_clean = re.sub(r'[^0-9]', '', cpf)
        if len(cpf_clean) != 11:
            return jsonify({"error": "CPF deve ter 11 dígitos"}), 400
        
        # Validar se senha é numérica e tem pelo menos 4 dígitos
        if not password.isdigit() or len(password) < 4:
            return jsonify({"error": "Senha deve ser numérica com pelo menos 4 dígitos"}), 400
        
        # Autenticar usuário
        user = User.authenticate(cpf, password)
        if not user:
            return jsonify({"error": "CPF ou senha inválidos"}), 401
        
        # Criar token JWT
        access_token = create_access_token(identity=user['_id'])
        
        return jsonify({
            "message": "Login realizado com sucesso",
            "access_token": access_token,
            "user": {
                "id": user['_id'],
                "cpf": user['cpf'],
                "name": user['name'],
                "role": user['role']
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint de registro (apenas para desenvolvimento)"""
    try:
        data = request.get_json()
        cpf = data.get('cpf')
        password = data.get('password')
        name = data.get('name')
        
        if not cpf or not password or not name:
            return jsonify({"error": "CPF, senha e nome são obrigatórios"}), 400
        
        # Validar formato do CPF
        cpf_clean = re.sub(r'[^0-9]', '', cpf)
        if len(cpf_clean) != 11:
            return jsonify({"error": "CPF deve ter 11 dígitos"}), 400
        
        # Validar se senha é numérica e tem pelo menos 4 dígitos
        if not password.isdigit() or len(password) < 4:
            return jsonify({"error": "Senha deve ser numérica com pelo menos 4 dígitos"}), 400
        
        # Criar usuário
        user_id = User.create_user(cpf, password, name)
        if not user_id:
            return jsonify({"error": "Usuário já existe"}), 409
        
        return jsonify({
            "message": "Usuário criado com sucesso",
            "user_id": user_id
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Obter dados do usuário atual"""
    try:
        user_id = get_jwt_identity()
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        return jsonify({
            "user": {
                "id": user['_id'],
                "cpf": user['cpf'],
                "name": user['name'],
                "role": user['role']
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

