# 📚 Exemplos de Uso da API

## 🎯 Contatos

### Criar um novo contato

```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "firstName": "João",
    "lastName": "Silva",
    "status": "ACTIVE",
    "phoneNumber": "+55 11 99999-9999",
    "streetAddress": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "country": "Brasil"
  }'
```

### Listar contatos com filtros

```bash
# Listar todos os contatos ativos
curl -X GET "http://localhost:3000/api/contacts?status=ACTIVE&limit=20&offset=0"

# Buscar por nome ou email
curl -X GET "http://localhost:3000/api/contacts?search=joão"

# Filtrar por lista específica
curl -X GET "http://localhost:3000/api/contacts?listId=<lista-id>"
```

### Atualizar contato

```bash
curl -X PUT http://localhost:3000/api/contacts/<contact-id> \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "João Pedro",
    "status": "ACTIVE"
  }'
```

### Adicionar contato a uma lista

```bash
curl -X POST http://localhost:3000/api/contacts/<contact-id>/lists \
  -H "Content-Type: application/json" \
  -d '{
    "listId": "<lista-id>"
  }'
```

### Adicionar tag a um contato

```bash
curl -X POST http://localhost:3000/api/contacts/<contact-id>/tags \
  -H "Content-Type: application/json" \
  -d '{
    "tagId": "<tag-id>"
  }'
```

## 📁 Listas

### Criar uma lista

```bash
curl -X POST http://localhost:3000/api/lists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clientes VIP",
    "description": "Clientes com alto valor de compra"
  }'
```

### Listar todas as listas

```bash
curl -X GET http://localhost:3000/api/lists
```

### Obter contatos de uma lista

```bash
curl -X GET "http://localhost:3000/api/lists/<lista-id>/contacts?limit=50&offset=0"
```

### Adicionar múltiplos contatos a uma lista

```bash
curl -X POST http://localhost:3000/api/lists/<lista-id>/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "contactIds": [
      "<contact-id-1>",
      "<contact-id-2>",
      "<contact-id-3>"
    ]
  }'
```

## 🏷️ Tags

### Criar uma tag

```bash
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium",
    "color": "#FFD700"
  }'
```

### Listar todas as tags

```bash
curl -X GET http://localhost:3000/api/tags
```

### Adicionar múltiplos contatos a uma tag

```bash
curl -X POST http://localhost:3000/api/tags/<tag-id>/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "contactIds": [
      "<contact-id-1>",
      "<contact-id-2>"
    ]
  }'
```

## 🎯 Segmentos Dinâmicos

### Criar segmento de clientes VIP (gastaram mais de R$ 1000)

```bash
curl -X POST http://localhost:3000/api/segments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clientes VIP",
    "description": "Clientes que gastaram mais de R$ 1000",
    "filters": [
      {
        "field": "totalSpent",
        "operator": "greater_than",
        "value": 1000
      }
    ]
  }'
```

### Criar segmento de clientes ativos em SP

```bash
curl -X POST http://localhost:3000/api/segments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clientes Ativos - SP",
    "description": "Clientes ativos localizados em São Paulo",
    "filters": [
      {
        "field": "status",
        "operator": "equals",
        "value": "ACTIVE"
      },
      {
        "field": "state",
        "operator": "equals",
        "value": "SP"
      }
    ]
  }'
```

### Criar segmento de clientes inativos (sem pedidos nos últimos 90 dias)

```bash
curl -X POST http://localhost:3000/api/segments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clientes Inativos",
    "description": "Sem pedidos nos últimos 90 dias",
    "filters": [
      {
        "field": "lastOrderDate",
        "operator": "less_than",
        "value": "2024-08-01T00:00:00Z"
      }
    ]
  }'
```

### Obter contatos de um segmento

```bash
curl -X GET "http://localhost:3000/api/segments/<segment-id>/contacts?limit=50&offset=0"
```

### Contar contatos em um segmento

```bash
curl -X GET http://localhost:3000/api/segments/<segment-id>/contacts/count
```

## 📥 Importação

### Importar contatos via CSV

```bash
# O arquivo CSV deve ter os seguintes campos (header):
# email,first_name,last_name,status,street_address,city,state,zip_code,country,phone_number

curl -X POST http://localhost:3000/api/imports/csv \
  -F "file=@contatos.csv"
```

Exemplo de arquivo CSV (`contatos.csv`):

```csv
email,first_name,last_name,status,street_address,city,state,zip_code,country,phone_number
joao@exemplo.com,João,Silva,ACTIVE,"Rua A, 123",São Paulo,SP,01234-567,Brasil,11999999999
maria@exemplo.com,Maria,Santos,ACTIVE,"Av B, 456",Rio de Janeiro,RJ,20000-000,Brasil,21988888888
```

### Sincronizar com WooCommerce

```bash
curl -X POST http://localhost:3000/api/imports/woocommerce
```

### Verificar status de importação

```bash
curl -X GET http://localhost:3000/api/imports/<import-id>
```

### Listar todas as importações

```bash
curl -X GET "http://localhost:3000/api/imports?limit=20&offset=0"
```

## 🔔 Webhook do WooCommerce

Configure o webhook no seu WooCommerce para apontar para:

```
POST http://seu-dominio.com/api/imports/woocommerce/webhook
```

Isso sincronizará automaticamente os dados do cliente quando houver novos pedidos.

## 📊 Exemplos de Casos de Uso

### Caso 1: Campanha para clientes inativos em SP

```bash
# 1. Criar segmento
SEGMENT_ID=$(curl -X POST http://localhost:3000/api/segments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Recuperação - SP",
    "filters": [
      {"field": "state", "operator": "equals", "value": "SP"},
      {"field": "lastOrderDate", "operator": "less_than", "value": "2024-08-01"}
    ]
  }' | jq -r '.id')

# 2. Obter contatos do segmento
curl -X GET "http://localhost:3000/api/segments/$SEGMENT_ID/contacts"
```

### Caso 2: Criar lista VIP e adicionar clientes

```bash
# 1. Criar lista VIP
LIST_ID=$(curl -X POST http://localhost:3000/api/lists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VIP",
    "description": "Clientes premium"
  }' | jq -r '.id')

# 2. Criar segmento de clientes VIP
SEGMENT_ID=$(curl -X POST http://localhost:3000/api/segments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clientes VIP",
    "filters": [
      {"field": "totalSpent", "operator": "greater_than", "value": 5000}
    ]
  }' | jq -r '.id')

# 3. Obter IDs dos contatos VIP
CONTACT_IDS=$(curl -X GET "http://localhost:3000/api/segments/$SEGMENT_ID/contacts" \
  | jq -r '.contacts[].id')

# 4. Adicionar à lista VIP
curl -X POST http://localhost:3000/api/lists/$LIST_ID/contacts \
  -H "Content-Type: application/json" \
  -d "{\"contactIds\": $(echo $CONTACT_IDS | jq -R 'split(\"\\n\") | map(select(length > 0))')}"
```

### Caso 3: Workflow completo de importação

```bash
# 1. Importar contatos do WooCommerce
IMPORT_ID=$(curl -X POST http://localhost:3000/api/imports/woocommerce | jq -r '.importId')

# 2. Aguardar alguns segundos
sleep 10

# 3. Verificar status
curl -X GET http://localhost:3000/api/imports/$IMPORT_ID

# 4. Criar tag "WooCommerce"
TAG_ID=$(curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "WooCommerce", "color": "#7B42BC"}' | jq -r '.id')

# 5. Buscar contatos importados do WooCommerce
curl -X GET "http://localhost:3000/api/contacts?source=woocommerce"
```

## 🔍 Operadores de Filtro para Segmentos

Os seguintes operadores estão disponíveis:

- `equals`: Igual a
- `contains`: Contém (texto)
- `greater_than`: Maior que
- `less_than`: Menor que
- `between`: Entre dois valores
- `in`: Está em uma lista de valores

Exemplos:

```json
// Igual a
{"field": "status", "operator": "equals", "value": "ACTIVE"}

// Contém
{"field": "email", "operator": "contains", "value": "@gmail.com"}

// Maior que
{"field": "totalSpent", "operator": "greater_than", "value": 1000}

// Menor que
{"field": "orderCount", "operator": "less_than", "value": 5}

// Entre
{"field": "totalSpent", "operator": "between", "value": [500, 2000]}

// Em lista
{"field": "state", "operator": "in", "value": ["SP", "RJ", "MG"]}
```

## 💡 Dicas

1. **Paginação**: Use `limit` e `offset` para paginar resultados
2. **Filtros**: Combine múltiplos filtros para resultados precisos
3. **Segmentos**: Use segmentos dinâmicos para evitar criar listas estáticas
4. **Importação**: Sempre verifique o status da importação antes de processar
5. **WooCommerce**: Configure webhooks para sincronização em tempo real
