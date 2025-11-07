# Email Marketing CRM

Plataforma completa de Email Marketing CRM com integração ao WooCommerce, inspirada em soluções como Mailchimp e Fluent CRM.

## 📋 Funcionalidades

### ✅ Gestão de Contatos
- CRUD completo de contatos
- Campos personalizáveis
- Status: Pending, Active, Bounce, Unsubscribed
- Dados de endereço completo
- IP Address tracking

### 🛒 Integração WooCommerce
- Sincronização automática de clientes
- Total Spent (total gasto)
- Last Order (último pedido)
- Lifetime Value (valor vitalício)
- Customer Since (cliente desde)
- Order Count (quantidade de pedidos)
- Webhook para atualizações em tempo real

### 📁 Organização
- **Listas**: Organize contatos em listas diferentes
- **Tags**: Adicione tags para categorização flexível
- **Segmentos Dinâmicos**: Crie segmentos com filtros avançados

### 📥 Importação
- Importação via CSV
- Sincronização automática com WooCommerce
- Tracking de status de importação
- Relatórios de erros

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd mail-sender
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
Crie um arquivo `.env` baseado no `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/email_crm?schema=public"
PORT=3000
NODE_ENV=development

# WooCommerce (opcional)
WOOCOMMERCE_URL=https://your-store.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxx
```

### 4. Execute as migrations do Prisma
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Inicie o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Estrutura do Projeto

```
mail-sender/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── config/
│   │   └── database.ts        # Configuração Prisma
│   ├── controllers/           # Controllers da API
│   │   ├── contact.controller.ts
│   │   ├── list.controller.ts
│   │   ├── tag.controller.ts
│   │   ├── segment.controller.ts
│   │   └── import.controller.ts
│   ├── services/              # Lógica de negócio
│   │   ├── contact.service.ts
│   │   ├── list.service.ts
│   │   ├── tag.service.ts
│   │   ├── segment.service.ts
│   │   ├── import.service.ts
│   │   └── woocommerce.service.ts
│   ├── routes/                # Rotas da API
│   │   ├── contact.routes.ts
│   │   ├── list.routes.ts
│   │   ├── tag.routes.ts
│   │   ├── segment.routes.ts
│   │   └── import.routes.ts
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   └── index.ts               # Servidor Express
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Contatos

```
POST   /api/contacts              # Criar contato
GET    /api/contacts              # Listar contatos (com filtros)
GET    /api/contacts/:id          # Buscar contato por ID
PUT    /api/contacts/:id          # Atualizar contato
DELETE /api/contacts/:id          # Deletar contato
POST   /api/contacts/:id/lists    # Adicionar a uma lista
DELETE /api/contacts/:id/lists    # Remover de uma lista
POST   /api/contacts/:id/tags     # Adicionar tag
DELETE /api/contacts/:id/tags     # Remover tag
```

### Listas

```
POST   /api/lists                 # Criar lista
GET    /api/lists                 # Listar todas as listas
GET    /api/lists/:id             # Buscar lista por ID
PUT    /api/lists/:id             # Atualizar lista
DELETE /api/lists/:id             # Deletar lista
GET    /api/lists/:id/contacts    # Obter contatos da lista
POST   /api/lists/:id/contacts    # Adicionar contatos à lista
DELETE /api/lists/:id/contacts    # Remover contatos da lista
```

### Tags

```
POST   /api/tags                  # Criar tag
GET    /api/tags                  # Listar todas as tags
GET    /api/tags/:id              # Buscar tag por ID
PUT    /api/tags/:id              # Atualizar tag
DELETE /api/tags/:id              # Deletar tag
GET    /api/tags/:id/contacts     # Obter contatos da tag
POST   /api/tags/:id/contacts     # Adicionar contatos à tag
DELETE /api/tags/:id/contacts     # Remover contatos da tag
```

### Segmentos Dinâmicos

```
POST   /api/segments              # Criar segmento
GET    /api/segments              # Listar todos os segmentos
GET    /api/segments/:id          # Buscar segmento por ID
PUT    /api/segments/:id          # Atualizar segmento
DELETE /api/segments/:id          # Deletar segmento
GET    /api/segments/:id/contacts # Obter contatos do segmento
GET    /api/segments/:id/contacts/count # Contar contatos
```

### Importação

```
POST   /api/imports/csv           # Importar CSV
POST   /api/imports/woocommerce   # Sincronizar WooCommerce
POST   /api/imports/woocommerce/webhook # Webhook WooCommerce
GET    /api/imports               # Listar importações
GET    /api/imports/:id           # Status da importação
```

## 📖 Exemplos de Uso

Veja o arquivo [API_EXAMPLES.md](./API_EXAMPLES.md) para exemplos detalhados de uso da API.

## 🗄️ Modelo de Dados

### Contact (Contato)
- Informações pessoais (nome, email, telefone)
- Endereço completo
- Status (Pending, Active, Bounce, Unsubscribed)
- Dados WooCommerce (total gasto, último pedido, etc)
- Relacionamentos com Listas e Tags
- Campos customizados
- Histórico de atividades

### List (Lista)
- Nome e descrição
- Relacionamento Many-to-Many com Contacts

### Tag (Tag)
- Nome e cor
- Relacionamento Many-to-Many com Contacts

### Segment (Segmento)
- Nome e descrição
- Filtros dinâmicos em JSON
- Suporta múltiplos operadores (equals, contains, greater_than, etc)

### Import (Importação)
- Tracking de importações CSV e WooCommerce
- Status e estatísticas
- Registro de erros

## 🎯 Próximos Passos

### Features Recomendadas
1. **Campanhas de Email**
   - Editor de templates
   - Agendamento de envios
   - Tracking de abertura e cliques

2. **Automação**
   - Workflows automatizados
   - Triggers baseados em eventos
   - Drip campaigns

3. **Analytics**
   - Dashboard com métricas
   - Relatórios de engajamento
   - ROI tracking

4. **Autenticação**
   - Sistema de usuários
   - Permissões e roles
   - API keys

5. **Frontend**
   - Interface administrativa
   - Editor visual de segmentos
   - Visualização de campanhas

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**: Runtime e linguagem
- **Express**: Framework web
- **Prisma**: ORM moderno
- **PostgreSQL**: Banco de dados
- **WooCommerce REST API**: Integração e-commerce
- **csv-parser**: Importação de CSV
- **Multer**: Upload de arquivos

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Prisma
npm run prisma:generate     # Gerar cliente Prisma
npm run prisma:migrate      # Executar migrations
npm run prisma:studio       # Abrir Prisma Studio (GUI)

# Produção
npm start
```

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
