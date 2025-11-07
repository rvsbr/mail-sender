# 🚀 Como Rodar o App Localmente

## Método Rápido (Recomendado)

### 1. Pré-requisitos
Certifique-se de ter instalado:
- **Node.js 18+** - [Baixar aqui](https://nodejs.org/)
- **Docker Desktop** (opcional, mas recomendado) - [Baixar aqui](https://www.docker.com/products/docker-desktop/)

### 2. Execute o script automático

```bash
./start.sh
```

Pronto! 🎉 O script vai:
- Instalar dependências
- Iniciar o banco de dados (PostgreSQL via Docker)
- Criar as tabelas
- Iniciar o servidor

O app estará rodando em: **http://localhost:3000**

---

## Método Manual (Passo a Passo)

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Iniciar o banco de dados

**Opção A: Com Docker (Recomendado)**

```bash
docker-compose up -d
```

Isso vai iniciar um PostgreSQL na porta 5432.

**Opção B: Sem Docker**

Se você já tem PostgreSQL instalado:

```bash
# Criar o banco
createdb email_crm

# Editar o .env com suas credenciais
# DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/email_crm"
```

### 3️⃣ Configurar o banco de dados

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Criar as tabelas
npm run prisma:migrate
```

### 4️⃣ Iniciar o servidor

```bash
npm run dev
```

Você verá algo assim:

```
🚀 Server running on port 3000
📧 Email Marketing CRM API
📝 Environment: development

📋 Available endpoints:
   - GET  /health
   - POST /api/contacts
   - GET  /api/contacts
   ...
```

### 5️⃣ Testar se está funcionando

Abra outra janela do terminal e execute:

```bash
curl http://localhost:3000/health
```

Deve retornar: `{"status":"ok"}`

---

## 🎨 Visualizar os dados (Interface Gráfica)

Para ver e editar os dados com uma interface visual:

```bash
npm run prisma:studio
```

Isso abrirá automaticamente em: **http://localhost:5555**

---

## 📥 Importar dados de exemplo

```bash
# Importar o arquivo CSV de exemplo
curl -X POST http://localhost:3000/api/imports/csv \
  -F "file=@example-contacts.csv"
```

---

## 🌐 Acessar a API

Depois que o servidor estiver rodando, você pode acessar:

- **Health Check**: http://localhost:3000/health
- **API Root**: http://localhost:3000/
- **Criar Contato**: http://localhost:3000/api/contacts (POST)
- **Listar Contatos**: http://localhost:3000/api/contacts (GET)
- **Prisma Studio**: http://localhost:5555 (se executou `npm run prisma:studio`)

---

## 🛠️ Testando a API

### Pelo navegador:

Abra: http://localhost:3000/api/contacts

### Usando curl:

```bash
# Criar um contato
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "firstName": "João",
    "lastName": "Silva",
    "status": "ACTIVE"
  }'

# Listar contatos
curl http://localhost:3000/api/contacts
```

### Usando Postman ou Insomnia:

1. Importe a URL base: `http://localhost:3000`
2. Siga os exemplos em [API_EXAMPLES.md](./API_EXAMPLES.md)

---

## ❌ Problemas Comuns

### "Port 3000 is already in use"

Outra aplicação está usando a porta 3000. Opções:

1. Parar a outra aplicação
2. Mudar a porta no arquivo `.env`:
   ```env
   PORT=3001
   ```

### "Connection refused" ao banco

O PostgreSQL não está rodando. Execute:

```bash
docker-compose up -d
```

### "Command not found: docker-compose"

Instale o Docker Desktop ou use PostgreSQL local.

### Erro ao executar migrations

Resetar o banco (CUIDADO: apaga todos os dados):

```bash
npm run prisma:migrate reset
```

---

## 🛑 Parar a aplicação

### Parar o servidor:
Pressione `Ctrl+C` no terminal

### Parar o banco de dados:
```bash
docker-compose down
```

### Parar tudo e remover dados:
```bash
docker-compose down -v
```

---

## 📱 Próximos Passos

1. ✅ Servidor rodando? Veja os [exemplos de API](./API_EXAMPLES.md)
2. 🛒 Tem WooCommerce? Configure a [integração](./SETUP.md#configurar-integração-woocommerce)
3. 📊 Quer ver os dados? Abra o Prisma Studio: `npm run prisma:studio`
4. 📥 Importe seus contatos via CSV ou WooCommerce

---

## 💡 Dicas

- **Desenvolvimento**: Use `npm run dev` (hot reload automático)
- **Produção**: Use `npm run build && npm start`
- **Visualizar dados**: Use `npm run prisma:studio`
- **Ver estrutura do banco**: Abra `prisma/schema.prisma`
- **Logs**: Tudo aparece no terminal onde você rodou `npm run dev`

---

## 🆘 Precisa de ajuda?

Consulte:
- [README.md](./README.md) - Documentação geral
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Exemplos de uso
- [SETUP.md](./SETUP.md) - Guia detalhado de setup
