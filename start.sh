#!/bin/bash

echo "🚀 Iniciando Email Marketing CRM..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "Por favor, instale Node.js 18+ de https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker não detectado. Você precisará de PostgreSQL instalado manualmente."
else
    echo "✅ Docker detectado"
    echo "📦 Iniciando PostgreSQL..."
    docker-compose up -d
    echo "⏳ Aguardando banco de dados iniciar..."
    sleep 5
    echo ""
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npm run prisma:generate

# Executar migrations
echo "🗄️  Criando tabelas no banco de dados..."
npm run prisma:migrate

echo ""
echo "✅ Setup completo!"
echo ""
echo "🌐 Iniciando servidor..."
echo "📍 API disponível em: http://localhost:3000"
echo "📍 Health check: http://localhost:3000/health"
echo ""
echo "Para parar o servidor: Ctrl+C"
echo "Para parar o banco: docker-compose down"
echo ""

# Iniciar servidor
npm run dev
