# 📧 Guia: Como Usar seus Créditos de Email

Este guia mostra como configurar e usar seus créditos de serviços de email (SendGrid, Mailgun, Gmail, etc) para enviar campanhas.

## 🎯 Serviços Suportados

A plataforma suporta:
- **SendGrid** (recomendado - plano gratuito: 100 emails/dia)
- **Mailgun** (plano gratuito: 5.000 emails/mês nos primeiros 3 meses)
- **Amazon SES** (via SMTP)
- **Gmail** (para testes - limite: 500 emails/dia)
- **Qualquer SMTP** (Outlook, servidor próprio, etc)

---

## ⚡ Opção 1: SendGrid (Recomendado)

### Por que SendGrid?
- ✅ 100 emails gratuitos por dia (para sempre)
- ✅ Fácil de configurar
- ✅ Boa deliverability
- ✅ Dashboard com estatísticas

### Passo a passo:

#### 1. Criar conta no SendGrid
- Acesse: https://signup.sendgrid.com/
- Crie conta gratuita

#### 2. Gerar API Key
1. Login no SendGrid
2. Vá em: **Settings > API Keys**
3. Clique em **Create API Key**
4. Nome: "Email Marketing CRM"
5. Permissões: **Full Access**
6. Copie a chave (só aparece uma vez!)

#### 3. Configurar no projeto

Edite o arquivo `.env`:

```env
EMAIL_PROVIDER=sendgrid
EMAIL_FROM=seu-email@dominio.com
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 4. Testar

```bash
curl -X POST http://localhost:3000/api/campaigns/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "seu-email@gmail.com",
    "subject": "Teste SendGrid",
    "html": "<h1>Funcionou!</h1><p>SendGrid está configurado.</p>"
  }'
```

---

## 📮 Opção 2: Mailgun

### Por que Mailgun?
- ✅ 5.000 emails grátis/mês (primeiros 3 meses)
- ✅ Ótima deliverability
- ✅ API poderosa

### Passo a passo:

#### 1. Criar conta no Mailgun
- Acesse: https://signup.mailgun.com/
- Crie conta (precisa de cartão de crédito, mas não cobra nos primeiros 3 meses)

#### 2. Obter credenciais
1. Login no Mailgun
2. Vá em: **Sending > Domains**
3. Copie:
   - **API Key** (em API Keys)
   - **Domain** (ex: mg.seu-dominio.com)

#### 3. Configurar no projeto

Edite o arquivo `.env`:

```env
EMAIL_PROVIDER=mailgun
EMAIL_FROM=noreply@mg.seu-dominio.com
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.seu-dominio.com
```

#### 4. Testar

```bash
curl -X POST http://localhost:3000/api/campaigns/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "seu-email@gmail.com",
    "subject": "Teste Mailgun",
    "html": "<h1>Funcionou!</h1><p>Mailgun está configurado.</p>"
  }'
```

---

## 📧 Opção 3: Gmail (Para Testes)

### Limitações:
- ⚠️ Máximo 500 emails/dia
- ⚠️ Pode ser bloqueado para uso comercial
- ✅ Ótimo para desenvolvimento/testes

### Passo a passo:

#### 1. Ativar "Senhas de App" no Gmail

1. Acesse: https://myaccount.google.com/security
2. Ative **Verificação em duas etapas** (se não tiver)
3. Vá em: **Senhas de app**
4. Escolha: **App: Email** / **Dispositivo: Outro**
5. Nome: "Email Marketing CRM"
6. Copie a senha gerada (16 caracteres)

#### 2. Configurar no projeto

Edite o arquivo `.env`:

```env
EMAIL_PROVIDER=smtp
EMAIL_FROM=seu-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

#### 3. Testar

```bash
curl -X POST http://localhost:3000/api/campaigns/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "outro-email@gmail.com",
    "subject": "Teste Gmail",
    "html": "<h1>Funcionou!</h1><p>Gmail SMTP está configurado.</p>"
  }'
```

---

## 🚀 Opção 4: Amazon SES

### Por que Amazon SES?
- ✅ Muito barato ($0.10 por 1.000 emails)
- ✅ Alta escalabilidade
- ⚠️ Configuração mais complexa

### Passo a passo:

#### 1. Criar conta AWS e configurar SES
1. Crie conta: https://aws.amazon.com/
2. Ative Amazon SES
3. Verifique seu domínio/email
4. Crie credenciais SMTP

#### 2. Configurar no projeto

Edite o arquivo `.env`:

```env
EMAIL_PROVIDER=smtp
EMAIL_FROM=noreply@seu-dominio.com
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=AKIAXXXXXXXXXXXXXXXX
SMTP_PASS=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 📊 Como Enviar Campanhas

### 1. Enviar para uma Lista

```bash
curl -X POST http://localhost:3000/api/campaigns/send/list \
  -H "Content-Type: application/json" \
  -d '{
    "listId": "id-da-lista",
    "subject": "Promoção Especial! {{firstName}}",
    "html": "<h1>Olá {{firstName}}!</h1><p>Confira nossa promoção especial...</p>"
  }'
```

### 2. Enviar para um Segmento

```bash
curl -X POST http://localhost:3000/api/campaigns/send/segment \
  -H "Content-Type: application/json" \
  -d '{
    "segmentId": "id-do-segmento",
    "subject": "Oferta Exclusiva VIP",
    "html": "<h1>Olá {{firstName}} {{lastName}}!</h1><p>Como cliente VIP...</p>"
  }'
```

### 3. Enviar para Contatos Específicos

```bash
curl -X POST http://localhost:3000/api/campaigns/send/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "contactIds": ["id1", "id2", "id3"],
    "subject": "Mensagem Personalizada",
    "html": "<h1>Olá {{firstName}}!</h1>"
  }'
```

### 4. Verificar Configuração

```bash
curl http://localhost:3000/api/campaigns/verify
```

---

## 🎨 Personalização de Emails

Use estas variáveis nos seus templates:

- `{{firstName}}` - Primeiro nome
- `{{lastName}}` - Sobrenome
- `{{email}}` - Email do contato
- `{{fullName}}` - Nome completo

**Exemplo:**

```html
<h1>Olá {{firstName}}!</h1>
<p>Enviamos este email para {{email}}</p>
<p>Esperamos que esteja bem, {{fullName}}!</p>
```

---

## 💰 Comparação de Custos

| Serviço | Plano Gratuito | Custo Adicional |
|---------|---------------|----------------|
| **SendGrid** | 100 emails/dia | $19.95/mês (40k emails) |
| **Mailgun** | 5k emails/mês (3 meses) | $35/mês (50k emails) |
| **Amazon SES** | 62k emails/mês (se usar EC2) | $0.10/1k emails |
| **Gmail** | 500 emails/dia | Grátis |

---

## ✅ Verificar se está Funcionando

### 1. Verificar configuração:
```bash
curl http://localhost:3000/api/campaigns/verify
```

### 2. Enviar email de teste:
```bash
curl -X POST http://localhost:3000/api/campaigns/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "seu-email@gmail.com",
    "subject": "Teste",
    "html": "<h1>Teste</h1>"
  }'
```

### 3. Verificar resposta:
```json
{
  "message": "Test email sent successfully",
  "messageId": "xxxxx"
}
```

---

## 🔧 Troubleshooting

### "Email configuration is invalid"

1. Verifique se o `.env` está configurado corretamente
2. Reinicie o servidor: `Ctrl+C` e `npm run dev`
3. Verifique as credenciais no painel do provedor

### "Authentication failed"

- **SendGrid**: Verifique se a API Key está correta
- **Mailgun**: Verifique API Key e Domain
- **Gmail**: Use "Senha de App", não a senha normal

### Emails caem no spam

1. Configure SPF, DKIM e DMARC no seu domínio
2. Use um domínio verificado
3. Evite palavras spam no assunto
4. Inclua link de "descadastrar"

---

## 🎯 Melhores Práticas

1. **Comece com teste**: Use Gmail ou SendGrid free
2. **Valide emails**: Remova bounces e inválidos
3. **Segmente**: Envie apenas para interessados
4. **Personalize**: Use {{firstName}} e outros campos
5. **Monitore**: Acompanhe taxas de abertura
6. **Respeite**: Sempre inclua "Descadastrar"

---

## 📱 Próximos Passos

1. Configure seu provedor preferido
2. Importe seus contatos
3. Crie segmentos
4. Envie uma campanha de teste
5. Analise os resultados

---

## 🆘 Precisa de Ajuda?

Consulte:
- [Documentação SendGrid](https://docs.sendgrid.com/)
- [Documentação Mailgun](https://documentation.mailgun.com/)
- [API_EXAMPLES.md](./API_EXAMPLES.md)
- [README.md](./README.md)
