#!/bin/bash

# Script de build para Vercel - VIP Mudanças Frontend

echo "🚀 Iniciando build do VIP Mudanças Frontend..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --legacy-peer-deps

# Build do projeto
echo "🔨 Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos gerados em: dist/"
    ls -la dist/
else
    echo "❌ Erro no build!"
    exit 1
fi

echo "🎉 Frontend pronto para deploy!"

