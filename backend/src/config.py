import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB Configuration
    MONGODB_URI = os.environ.get('MONGODB_URI') or 'mongodb://localhost:27017/vip_mudancas'
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'vip-mudancas-secret-key-2024'
    JWT_ACCESS_TOKEN_EXPIRES = False  # Token não expira
    
    # API Keys
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    AUTHENTIC_API_KEY = os.environ.get('AUTHENTIC_API_KEY')
    
    # CORS Configuration - Mais flexível para produção
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
    
    # App Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'vip-mudancas-flask-secret'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Upload Configuration
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    
    # Production Settings
    ENV = os.environ.get('FLASK_ENV', 'production')
    TESTING = False

