# 🚛 VIP Mudanças - Sistema v3.0 Final

Sistema completo de gestão empresarial com Inteligência Artificial integrada.

## ✨ Principais Funcionalidades

- 🔐 **Login com CPF + Senha Numérica**
- 🤖 **IA Mirante**: Assistente inteligente com GPT-4o
- 📸 **IA Vision**: Análise automática de fotos para vistoria
- 📱 **100% Responsivo**: Compatível com iOS e Android
- 🔗 **Automações**: ManyChat, WhatsApp, Google Calendar

## 🚀 Início Rápido

### Credenciais de Teste:
- **CPF**: `111.444.777-35`
- **Senha**: `1234`

### Instalação:

```bash
# Frontend
cd frontend
npm install --legacy-peer-deps
npm run dev

# Backend
cd backend
pip install -r requirements.txt
cd src && python main.py
```

### Acesso:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📋 Funcionalidades Implementadas

### ✅ Fase 1: Análise Estrutural
- [x] Mapeamento completo do projeto
- [x] Identificação de melhorias necessárias

### ✅ Fase 2: Login Reformulado
- [x] Campo CPF com máscara automática
- [x] Validação de CPF em tempo real
- [x] Senha numérica simplificada
- [x] Remoção de exemplos de login

### ✅ Fase 3: IA Mirante Ativa
- [x] Análise de performance individual
- [x] Feedback motivacional personalizado
- [x] Sugestões inteligentes por setor
- [x] Integração com GPT-4o

### ✅ Fase 4: IA Vision Implementada
- [x] Upload e análise de fotos
- [x] Três tipos de análise (Geral, Cubagem, Segurança)
- [x] Geração automática de planilhas
- [x] Interface responsiva

### ✅ Fase 5: Automações Preparadas
- [x] Webhooks para ManyChat
- [x] Endpoints para captura de leads
- [x] Sistema de lembretes automáticos
- [x] Integração Google Calendar/Sheets

### ✅ Fase 6: Responsividade Mobile
- [x] Menu hambúrguer implementado
- [x] Layout adaptativo
- [x] Correção de scroll horizontal
- [x] Elementos touch-friendly (44px+)

### ✅ Fase 7: Documentação Final
- [x] Manual completo de uso
- [x] Guia de instalação
- [x] Troubleshooting
- [x] Roadmap futuro

## 🤖 IA Mirante - Como Usar

1. Clique no botão roxo flutuante (canto inferior direito)
2. Escolha a aba: **Performance**, **Sugestões** ou **Motivação**
3. Clique em "Gerar Análise" para insights personalizados

## 📸 IA Vision - Análise de Fotos

1. Acesse **Visitas** → **Análise de Fotos IA**
2. Escolha o tipo: **Geral**, **Cubagem** ou **Segurança**
3. Faça upload das fotos
4. Clique em "Analisar" para cada foto
5. Gere planilha de cubagem automática

## 📱 Compatibilidade Mobile

- ✅ **iOS**: iPhone e iPad (Safari)
- ✅ **Android**: Smartphones e tablets (Chrome)
- ✅ **Menu Hambúrguer**: Navegação otimizada
- ✅ **Touch-Friendly**: Botões adequados para toque

## 🔧 Configuração OpenAI

```env
# backend/.env
OPENAI_API_KEY=sk-sua_chave_aqui
```

**Limite Mensal**: R$ 100  
**Custo por Análise**: ~R$ 0,50 (IA Mirante) | ~R$ 2,00 (IA Vision)

## 📊 Estrutura do Projeto

```
vip-mudancas/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── styles/
├── backend/           # Flask + Python
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── config/
├── DOCUMENTACAO_FINAL.md
└── README.md
```

## 🆘 Problemas Comuns

### Login não funciona:
- Verificar CPF válido (11 dígitos)
- Usar credenciais de teste: `111.444.777-35` / `1234`

### IA não responde:
- Verificar chave OpenAI no `.env`
- Verificar limite de gastos da API

### Menu mobile não aparece:
- Redimensionar janela < 768px
- Atualizar página (F5)

## 📞 Suporte

**Website**: https://vipmudancas.com.br  
**Email**: vip@vipmudancas.com.br

---

**Versão**: 3.0 Final | **Data**: 02/07/2025  
*Sistema desenvolvido com ❤️ para VIP Mudanças*

