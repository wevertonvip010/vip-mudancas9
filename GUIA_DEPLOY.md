# 🚀 GUIA DE DEPLOY - VIP MUDANÇAS v3.0

## Deploy na Vercel (Recomendado)

### 1. Preparação do Repositório GitHub

```bash
# 1. Criar repositório no GitHub
# 2. Fazer upload do projeto
git init
git add .
git commit -m "VIP Mudanças v3.0 - Deploy inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/vip-mudancas.git
git push -u origin main
```

### 2. Deploy na Vercel

1. **Acesse**: https://vercel.com
2. **Login**: Com sua conta GitHub
3. **Import Project**: Selecione o repositório `vip-mudancas`
4. **Configure**:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `cd frontend && npm install --legacy-peer-deps && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install --legacy-peer-deps`

### 3. Variáveis de Ambiente na Vercel

No painel da Vercel, vá em **Settings** → **Environment Variables** e adicione:

```env
# Obrigatórias
OPENAI_API_KEY=sk-sua_chave_openai_aqui
JWT_SECRET_KEY=sua_chave_jwt_muito_segura
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/vip_mudancas

# Opcionais
CORS_ORIGINS=https://seu-projeto.vercel.app
FLASK_ENV=production
FLASK_DEBUG=false
```

### 4. Configuração do MongoDB Atlas

1. **Acesse**: https://cloud.mongodb.com
2. **Crie um cluster gratuito**
3. **Configure**:
   - Database User: `vip_admin`
   - Password: `senha_segura`
   - Network Access: `0.0.0.0/0` (ou IPs específicos)
4. **Connection String**: 
   ```
   mongodb+srv://vip_admin:senha_segura@cluster0.xxxxx.mongodb.net/vip_mudancas
   ```

### 5. Configuração da OpenAI API

1. **Acesse**: https://platform.openai.com/api-keys
2. **Crie uma API Key**
3. **Configure limite de gastos**: $10-20/mês
4. **Adicione na Vercel**: `OPENAI_API_KEY=sk-...`

---

## Deploy Alternativo (Google Cloud)

### 1. Google Cloud Run

```bash
# 1. Instalar Google Cloud CLI
# 2. Fazer login
gcloud auth login

# 3. Configurar projeto
gcloud config set project SEU_PROJETO_ID

# 4. Deploy do backend
cd backend
gcloud run deploy vip-mudancas-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# 5. Deploy do frontend
cd ../frontend
npm run build
gsutil -m cp -r dist/* gs://SEU_BUCKET/
```

---

## Configuração Local para Desenvolvimento

### 1. Pré-requisitos

- Node.js 20.18.0+
- Python 3.11+
- MongoDB (local ou Atlas)

### 2. Instalação

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
# Editar .env com suas configurações

# Frontend
cd frontend
npm install --legacy-peer-deps
cp .env.example .env.local
# Editar .env.local se necessário
```

### 3. Execução

```bash
# Terminal 1 - Backend
cd backend/src
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Acesso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Login**: CPF `111.444.777-35` | Senha `1234`

---

## Estrutura de Arquivos para Deploy

```
vip-mudancas/
├── frontend/                 # React + Vite
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── backend/                  # Flask + Python
│   ├── src/
│   ├── requirements.txt
│   └── .env.example
├── vercel.json              # Configuração Vercel
├── .gitignore               # Arquivos ignorados
├── .env.example             # Variáveis globais
├── README.md                # Documentação
├── DOCUMENTACAO_FINAL.md    # Manual completo
└── GUIA_DEPLOY.md          # Este arquivo
```

---

## Troubleshooting

### Erro: "Module not found"
```bash
# Reinstalar dependências
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Erro: "CORS policy"
```bash
# Verificar CORS_ORIGINS na Vercel
# Deve incluir: https://seu-projeto.vercel.app
```

### Erro: "OpenAI API"
```bash
# Verificar se OPENAI_API_KEY está configurada
# Verificar limite de gastos na OpenAI
```

### Erro: "MongoDB connection"
```bash
# Verificar MONGODB_URI
# Verificar Network Access no MongoDB Atlas
# Verificar usuário e senha
```

---

## Monitoramento e Logs

### Vercel
- **Logs**: Dashboard Vercel → Functions → View Logs
- **Analytics**: Dashboard Vercel → Analytics
- **Performance**: Dashboard Vercel → Speed Insights

### MongoDB Atlas
- **Monitoring**: Cluster → Monitoring
- **Logs**: Cluster → Logs
- **Performance**: Cluster → Performance Advisor

### OpenAI
- **Usage**: Platform → Usage
- **Limits**: Platform → Limits
- **API Keys**: Platform → API Keys

---

## Backup e Segurança

### 1. Backup do Banco
```bash
# MongoDB Atlas - Backup automático ativo por padrão
# Download manual: Cluster → Collections → Export
```

### 2. Backup do Código
```bash
# GitHub - repositório já é backup
# Clone local: git clone https://github.com/SEU_USUARIO/vip-mudancas.git
```

### 3. Segurança
- ✅ Variáveis de ambiente protegidas
- ✅ API Keys não expostas no código
- ✅ CORS configurado adequadamente
- ✅ JWT com chave secreta forte
- ✅ MongoDB com autenticação

---

## Suporte Pós-Deploy

### Contatos
- **Email**: vip@vipmudancas.com.br
- **Website**: https://vipmudancas.com.br

### Documentação
- **Manual Completo**: `DOCUMENTACAO_FINAL.md`
- **README**: `README.md`
- **Testes**: `relatorio_testes_responsividade.md`

---

*Guia criado em 02/07/2025 - VIP Mudanças v3.0*

