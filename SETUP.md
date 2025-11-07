# 🚀 Guia de Setup Rápido

## Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose (opcional, mas recomendado para o banco de dados)
- PostgreSQL (se não usar Docker)

## Setup Passo a Passo

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

#### Opção A: Usando Docker (Recomendado)

```bash
# Iniciar PostgreSQL via Docker
docker-compose up -d

# Aguardar o banco iniciar (cerca de 10 segundos)
sleep 10
```

O banco já estará configurado com:
- **Host**: localhost
- **Port**: 5432
- **Database**: email_crm
- **User**: postgres
- **Password**: postgres

#### Opção B: PostgreSQL local

Se você já tem PostgreSQL instalado localmente:

```bash
# Criar o banco de dados
createdb email_crm
```

Edite o arquivo `.env` com suas credenciais:

```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/email_crm?schema=public"
```

### 3. Executar migrations

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar migrations (criar tabelas)
npm run prisma:migrate
```

### 4. Iniciar o servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### 5. Testar a API

```bash
# Health check
curl http://localhost:3000/health

# Criar um contato de teste
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "firstName": "Teste",
    "lastName": "Usuario",
    "status": "ACTIVE"
  }'
```

## 📊 Prisma Studio (Interface Gráfica)

Para visualizar e gerenciar seus dados com interface gráfica:

```bash
npm run prisma:studio
```

Abrirá automaticamente em `http://localhost:5555`

## 📥 Importar Dados de Exemplo

```bash
# Importar o CSV de exemplo
curl -X POST http://localhost:3000/api/imports/csv \
  -F "file=@example-contacts.csv"
```

## 🛒 Configurar Integração WooCommerce

1. No seu painel WooCommerce, vá em: **WooCommerce > Configurações > Avançado > REST API**

2. Clique em **Adicionar chave**

3. Configure:
   - **Descrição**: Email Marketing CRM
   - **Usuário**: (escolha um usuário administrador)
   - **Permissões**: Leitura/Gravação

4. Copie as chaves geradas e adicione no arquivo `.env`:

```env
WOOCOMMERCE_URL=https://sua-loja.com.br
WOOCOMMERCE_CONSUMER_KEY=ck_abc123...
WOOCOMMERCE_CONSUMER_SECRET=cs_xyz789...
```

5. Sincronizar clientes:

```bash
curl -X POST http://localhost:3000/api/imports/woocommerce
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor em modo dev

# Prisma
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrations
npm run prisma:studio    # Abrir Prisma Studio

# Build e Produção
npm run build           # Compilar TypeScript
npm start              # Iniciar servidor (produção)

# Docker
docker-compose up -d    # Iniciar banco
docker-compose down     # Parar banco
docker-compose logs -f  # Ver logs
```

## ✅ Verificar se tudo está funcionando

```bash
# 1. Criar uma lista
curl -X POST http://localhost:3000/api/lists \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "description": "Lista de teste"}'

# 2. Criar uma tag
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "Premium", "color": "#FFD700"}'

# 3. Criar um contato
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "firstName": "Teste",
    "lastName": "Usuario"
  }'

# 4. Listar contatos
curl http://localhost:3000/api/contacts
```

## 🐛 Troubleshooting

### Erro de conexão com banco

```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs postgres
```

### Erro ao executar migrations

```bash
# Resetar banco (CUIDADO: apaga todos os dados)
npm run prisma:migrate reset

# Recriar migrations
npm run prisma:migrate
```

### Porta 3000 já em uso

Edite o arquivo `.env`:

```env
PORT=3001
```

## 📚 Próximos Passos

1. Explore a [documentação da API](./API_EXAMPLES.md)
2. Configure a integração WooCommerce
3. Importe seus contatos via CSV
4. Crie segmentos dinâmicos para organizar seus contatos
5. Desenvolva campanhas de email marketing

## 💡 Dicas

- Use o Prisma Studio para visualizar seus dados graficamente
- Configure webhooks do WooCommerce para sincronização automática
- Crie backups regulares do banco de dados
- Em produção, use variáveis de ambiente seguras
