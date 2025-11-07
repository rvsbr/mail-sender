# 💻 Guia: Usando com sua IDE

Este guia mostra como usar o projeto com as IDEs mais populares.

---

## 🎯 Visual Studio Code (Recomendado)

### 1. Abrir o projeto

```bash
cd mail-sender
code .
```

### 2. Extensões Recomendadas

O projeto já inclui recomendações de extensões. Quando abrir no VS Code, aparecerá uma notificação para instalar. Ou instale manualmente:

**Essenciais:**
- **Prisma** (`Prisma.prisma`) - Syntax highlight e autocomplete para Prisma
- **ESLint** (`dbaeumer.vscode-eslint`) - Linting de código
- **Thunder Client** (`rangav.vscode-thunder-client`) - Testar APIs direto no VS Code

**Opcionais:**
- **SQLTools** (`mtxr.sqltools`) - Conectar ao banco de dados
- **SQLTools PostgreSQL** (`mtxr.sqltools-driver-pg`) - Driver PostgreSQL
- **Prettier** (`esbenp.prettier-vscode`) - Formatação de código

### 3. Configurações Automáticas

O projeto já inclui configurações otimizadas em `.vscode/settings.json`:
- ✅ Formatar ao salvar
- ✅ Fix automático do ESLint
- ✅ Conexão com banco de dados configurada

### 4. Debug no VS Code

Pressione `F5` ou vá em **Run > Start Debugging** para:
- Iniciar o servidor em modo debug
- Colocar breakpoints
- Inspecionar variáveis

### 5. Testar APIs no Thunder Client

1. Instale a extensão **Thunder Client**
2. Clique no ícone do raio na barra lateral
3. Crie uma nova request:
   - **GET** `http://localhost:3000/api/contacts`
   - **POST** `http://localhost:3000/api/contacts`

### 6. Visualizar Banco de Dados

1. Instale **SQLTools** e **SQLTools PostgreSQL**
2. A conexão já está configurada em `.vscode/settings.json`
3. Clique no ícone de banco de dados na barra lateral
4. Conecte-se a "Email CRM Database"

---

## 🚀 WebStorm / IntelliJ IDEA

### 1. Abrir o projeto

```bash
# Abrir diretamente
webstorm .

# Ou via File > Open > Selecionar pasta mail-sender
```

### 2. Configurar Node.js

1. **Settings/Preferences** > **Languages & Frameworks** > **Node.js**
2. O WebStorm detectará automaticamente

### 3. Configurar Database Tool

1. **View** > **Tool Windows** > **Database**
2. Clique em **+** > **Data Source** > **PostgreSQL**
3. Configure:
   - **Host**: localhost
   - **Port**: 5432
   - **Database**: email_crm
   - **User**: postgres
   - **Password**: postgres
4. Teste a conexão

### 4. Executar/Debug

1. Abra `package.json`
2. Clique no ícone de play ao lado de `"dev"` no scripts
3. Ou crie uma configuração de Run:
   - **Run** > **Edit Configurations**
   - **+** > **npm**
   - **Command**: `run`
   - **Scripts**: `dev`

### 5. HTTP Client

O WebStorm tem um cliente HTTP integrado:

1. Crie um arquivo: `api-tests.http`
2. Adicione requests:

```http
### Get all contacts
GET http://localhost:3000/api/contacts

### Create contact
POST http://localhost:3000/api/contacts
Content-Type: application/json

{
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User"
}
```

---

## 📝 Cursor / VS Code Forks

Se você usa **Cursor**, **VSCodium** ou outros forks do VS Code:

1. Abra o projeto normalmente
2. As configurações `.vscode/` funcionarão automaticamente
3. Instale as extensões recomendadas

---

## 🐧 Vim / Neovim

### 1. Configuração básica

```bash
# Instalar Node.js LSP
npm install -g typescript typescript-language-server

# Abrir projeto
nvim .
```

### 2. Plugins recomendados

Para NeoVim com lazy.nvim:

```lua
{
  "neovim/nvim-lspconfig",
  "jose-elias-alvarez/typescript.nvim",
  "prisma/vim-prisma",
}
```

### 3. LSP Config

```lua
require('lspconfig').tsserver.setup{}
```

---

## 🖥️ Qualquer IDE / Editor de Texto

### Sublime Text, Atom, etc:

1. Abra a pasta do projeto
2. Use o terminal integrado ou externo
3. Execute: `npm run dev`

### Terminal + Editor

```bash
# Terminal 1: Rodar servidor
npm run dev

# Terminal 2: Ver logs do banco
docker-compose logs -f

# Terminal 3: Editar código
nano src/index.ts
# ou vim, emacs, etc
```

---

## 🔧 Configuração do TypeScript na IDE

### Habilitar autocomplete

Todas as IDEs modernas detectam automaticamente o `tsconfig.json`.

Para garantir:

```bash
# Gerar tipos do Prisma
npm run prisma:generate
```

Agora você terá autocomplete completo para:
- Prisma Client
- Models (Contact, List, Tag, etc)
- Tipos TypeScript

### Exemplo de autocomplete:

```typescript
import prisma from './config/database';

// A IDE mostrará todas as opções
prisma.contact.
// -> create, findMany, update, delete, etc

// E os campos do modelo
prisma.contact.create({
  data: {
    email: '', // autocomplete dos campos
    firstName: '',
    // ...
  }
})
```

---

## 🎨 Dicas de Produtividade

### VS Code

**Atalhos úteis:**
- `Ctrl+P` - Buscar arquivo
- `Ctrl+Shift+P` - Command Palette
- `F5` - Debug
- `Ctrl+`` - Terminal integrado
- `Ctrl+B` - Toggle sidebar

**Snippets personalizados:**

Crie um arquivo `.vscode/snippets.code-snippets`:

```json
{
  "Prisma Query": {
    "prefix": "prismaQuery",
    "body": [
      "const ${1:result} = await prisma.${2:model}.${3:findMany}({",
      "  where: { ${4} },",
      "});"
    ]
  }
}
```

### WebStorm

**Atalhos úteis:**
- `Shift+Shift` - Buscar qualquer coisa
- `Alt+Enter` - Quick fixes
- `Ctrl+Alt+L` - Formatar código
- `Shift+F10` - Run
- `Shift+F9` - Debug

---

## 📊 Monitoramento em Tempo Real

### 1. Logs do servidor

No VS Code/WebStorm, o terminal mostrará:
```
🚀 Server running on port 3000
📧 Email Marketing CRM API
```

### 2. Logs do banco

```bash
# Terminal separado
docker-compose logs -f postgres
```

### 3. Prisma Studio (GUI do banco)

```bash
npm run prisma:studio
```

Abre em: http://localhost:5555

---

## 🔍 Debugging

### VS Code - Breakpoints

1. Clique na margem esquerda do código (linha)
2. Pressione `F5` para iniciar debug
3. O servidor pausará nos breakpoints

### Console.log estratégico

```typescript
// Em qualquer service
console.log('📧 Enviando email para:', contact.email);
console.log('📊 Dados:', { subject, html });
```

### Inspecionar requests

No controller:
```typescript
console.log('📥 Request body:', req.body);
console.log('🔍 Query params:', req.query);
```

---

## 🚀 Hot Reload

O projeto já está configurado com hot reload (tsx watch):

1. Salve qualquer arquivo `.ts`
2. O servidor reinicia automaticamente
3. Não precisa reiniciar manualmente!

```bash
# Isso já está em package.json > scripts > dev
tsx watch src/index.ts
```

---

## 📦 Gerenciamento de Dependências

### Instalar nova dependência

```bash
npm install nome-do-pacote
npm install -D @types/nome-do-pacote  # tipos TypeScript
```

### VS Code/WebStorm detecta automaticamente

Ao salvar `package.json`, a IDE sugerirá instalar.

---

## 💡 Dicas Finais

1. **Use o terminal integrado da IDE** - Mais prático
2. **Configure Git na IDE** - Commits visuais
3. **Aproveite o autocomplete** - Economiza tempo
4. **Use Prisma Studio** - Visualizar dados facilmente
5. **Thunder Client / HTTP Client** - Testar APIs sem sair da IDE

---

## 🆘 Problemas Comuns

### IDE não reconhece imports

```bash
# Regenerar tipos
npm run prisma:generate

# Reiniciar TypeScript Server (VS Code)
Ctrl+Shift+P > TypeScript: Restart TS Server
```

### Hot reload não funciona

Verifique se está usando:
```bash
npm run dev  # não npm start
```

### Debugger não para nos breakpoints

1. Verifique se está em modo Debug (F5)
2. Use `debugger;` no código se necessário
3. Reinstale dependências: `npm install`

---

## 📚 Recursos

- [VS Code Node.js Tutorial](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)
- [WebStorm TypeScript Guide](https://www.jetbrains.com/help/webstorm/typescript-support.html)
- [Prisma VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
