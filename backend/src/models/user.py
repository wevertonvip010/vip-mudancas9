from bson import ObjectId
from src.database import db
import bcrypt
from datetime import datetime
import re

class User:
    collection = db.users
    
    @staticmethod
    def create_user(cpf, password, name, role='admin'):
        """Criar novo usuário"""
        # Limpar CPF (remover pontos e traços)
        cpf_clean = re.sub(r'[^0-9]', '', cpf)
        
        # Verificar se usuário já existe
        if User.collection.find_one({"cpf": cpf_clean}):
            return None
        
        # Hash da senha
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user_data = {
            "cpf": cpf_clean,
            "password": password_hash,
            "name": name,
            "role": role,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "active": True
        }
        
        result = User.collection.insert_one(user_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_cpf(cpf):
        """Buscar usuário por CPF"""
        # Limpar CPF (remover pontos e traços)
        cpf_clean = re.sub(r'[^0-9]', '', cpf)
        return User.collection.find_one({"cpf": cpf_clean})
    
    @staticmethod
    def find_by_id(user_id):
        """Buscar usuário por ID"""
        return User.collection.find_one({"_id": ObjectId(user_id)})
    
    @staticmethod
    def authenticate(cpf, password):
        """Autenticar usuário"""
        # Limpar CPF (remover pontos e traços)
        cpf_clean = re.sub(r'[^0-9]', '', cpf)
        user = User.collection.find_one({"cpf": cpf_clean, "active": True})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            user['_id'] = str(user['_id'])
            return user
        return None
    
    @staticmethod
    def verify_password(password, password_hash):
        """Verificar senha"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash)
    
    @staticmethod
    def validate_cpf(cpf):
        """Validar CPF"""
        # Limpar CPF (remover pontos e traços)
        cpf_clean = re.sub(r'[^0-9]', '', cpf)
        
        # Verificar se tem 11 dígitos
        if len(cpf_clean) != 11:
            return False
        
        # Verificar se não são todos os dígitos iguais
        if cpf_clean == cpf_clean[0] * 11:
            return False
        
        # Calcular primeiro dígito verificador
        soma = sum(int(cpf_clean[i]) * (10 - i) for i in range(9))
        resto = soma % 11
        digito1 = 0 if resto < 2 else 11 - resto
        
        # Calcular segundo dígito verificador
        soma = sum(int(cpf_clean[i]) * (11 - i) for i in range(10))
        resto = soma % 11
        digito2 = 0 if resto < 2 else 11 - resto
        
        # Verificar se os dígitos calculados conferem
        return cpf_clean[9] == str(digito1) and cpf_clean[10] == str(digito2)
    
    @staticmethod
    def to_dict(user_doc):
        """Converter documento do MongoDB para dict"""
        if not user_doc:
            return None
        
        return {
            'id': str(user_doc['_id']),
            'cpf': user_doc['cpf'],
            'name': user_doc['name'],
            'role': user_doc['role'],
            'active': user_doc.get('active', True),
            'created_at': user_doc.get('created_at'),
            'updated_at': user_doc.get('updated_at')
        }
