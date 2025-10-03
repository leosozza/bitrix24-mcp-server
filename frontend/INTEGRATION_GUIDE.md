# Guia de Integração - Frontend Bitrix24

Este documento descreve como integrar o frontend de configuração do Bitrix24 com seu backend.

## 📋 Visão Geral

O frontend foi desenvolvido em React com TypeScript e está localizado no diretório `/frontend`. Ele fornece uma interface intuitiva para que os usuários configurem suas credenciais do Bitrix24.

## 🎯 Funcionalidades

### Campos do Formulário

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Nome da Conta | text | ✅ Sim | Identificador amigável para a conta |
| URL do Webhook | url | ✅ Sim | URL do webhook de entrada do Bitrix24 |
| Client ID | text | ❌ Não | Client ID para OAuth |
| Client Secret | password | ❌ Não | Client Secret para OAuth |
| Token de Acesso | password | ❌ Não | Token alternativo de autenticação |
| Descrição | textarea | ❌ Não | Informações adicionais |

### Ações Disponíveis

1. **Testar Conexão**: Valida as credenciais antes de salvar
2. **Salvar Configuração**: Persiste a configuração no backend

## 🔌 Endpoints da API

O frontend espera os seguintes endpoints REST:

### 1. Testar Conexão

```http
POST /api/bitrix24/test-connection
Content-Type: application/json

{
  "accountName": "Minha Empresa",
  "webhookUrl": "https://sua-conta.bitrix24.com/rest/...",
  "clientId": "opcional",
  "clientSecret": "opcional",
  "accessToken": "opcional",
  "description": "opcional"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Conexão estabelecida com sucesso!"
}
```

**Resposta de Erro (400/401):**
```json
{
  "success": false,
  "message": "Falha ao conectar. Verifique as credenciais."
}
```

### 2. Salvar Configuração

```http
POST /api/bitrix24/config
Content-Type: application/json

{
  "accountName": "Minha Empresa",
  "webhookUrl": "https://sua-conta.bitrix24.com/rest/...",
  "clientId": "opcional",
  "clientSecret": "opcional",
  "accessToken": "opcional",
  "description": "opcional"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "id": "config-123",
  "message": "Configuração salva com sucesso"
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "message": "Erro ao salvar configuração"
}
```

## 💻 Implementação Backend (Node.js/Express)

### Exemplo de Implementação

```typescript
import express from 'express';
import { bitrix24Client } from './bitrix24/client';

const app = express();
app.use(express.json());

// Testar Conexão
app.post('/api/bitrix24/test-connection', async (req, res) => {
  try {
    const { webhookUrl, accessToken } = req.body;
    
    // Configure o cliente temporariamente para teste
    const testClient = new Bitrix24Client(webhookUrl, accessToken);
    
    // Teste a conexão
    const isValid = await testClient.validateWebhook();
    
    if (isValid) {
      res.json({
        success: true,
        message: 'Conexão estabelecida com sucesso! Bitrix24 está respondendo corretamente.'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Falha ao conectar com Bitrix24. Verifique as credenciais.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno ao testar conexão'
    });
  }
});

// Salvar Configuração
app.post('/api/bitrix24/config', async (req, res) => {
  try {
    const config = req.body;
    
    // Validar campos obrigatórios
    if (!config.accountName || !config.webhookUrl) {
      return res.status(400).json({
        success: false,
        message: 'Nome da Conta e Webhook URL são obrigatórios'
      });
    }
    
    // Salvar no banco de dados
    const savedConfig = await saveToDatabase(config);
    
    res.status(201).json({
      success: true,
      id: savedConfig.id,
      message: 'Configuração salva com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao salvar configuração'
    });
  }
});

app.listen(3001, () => {
  console.log('Backend rodando na porta 3001');
});
```

## 🔧 Configuração do Frontend

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório `/frontend`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

### Atualizar o Componente

Edite `frontend/src/components/ConfigForm.tsx` para usar a API real:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const testConnection = async () => {
  setConnectionStatus(ConnectionStatus.TESTING);
  setStatusMessage('');

  try {
    const response = await fetch(`${API_BASE_URL}/api/bitrix24/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setConnectionStatus(ConnectionStatus.SUCCESS);
      setStatusMessage(data.message);
    } else {
      setConnectionStatus(ConnectionStatus.ERROR);
      setStatusMessage(data.message || 'Erro ao testar conexão');
    }
  } catch (error) {
    setConnectionStatus(ConnectionStatus.ERROR);
    setStatusMessage('Erro de rede ao conectar com o servidor');
  }
};

const handleSave = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bitrix24/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('Configuração salva com sucesso!');
    } else {
      alert('Erro ao salvar: ' + data.message);
    }
  } catch (error) {
    alert('Erro de rede ao salvar configuração');
  }
};
```

## 🔒 Segurança

### Recomendações

1. **HTTPS**: Use sempre HTTPS em produção
2. **CORS**: Configure CORS adequadamente no backend
3. **Validação**: Valide todos os inputs no backend
4. **Sanitização**: Sanitize dados antes de salvar no banco
5. **Rate Limiting**: Implemente rate limiting nas APIs
6. **Autenticação**: Adicione autenticação de usuário se necessário

### Exemplo de CORS (Express)

```typescript
import cors from 'cors';

app.use(cors({
  origin: ['http://localhost:3000', 'https://seu-dominio.com'],
  methods: ['POST', 'GET'],
  credentials: true
}));
```

## 📦 Deploy

### Frontend (Produção)

```bash
cd frontend
npm run build
```

Os arquivos otimizados estarão em `/frontend/dist`. Você pode:
- Servir com Nginx/Apache
- Deploy no Vercel/Netlify
- Integrar no mesmo servidor do backend

### Configuração Nginx

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🧪 Testando a Integração

### 1. Iniciar Backend

```bash
cd backend
npm start
```

### 2. Iniciar Frontend

```bash
cd frontend
npm run dev
```

### 3. Testar Fluxo Completo

1. Acesse `http://localhost:3000`
2. Preencha os campos obrigatórios
3. Clique em "Testar Conexão"
4. Verifique o feedback visual
5. Clique em "Salvar Configuração"
6. Confirme que os dados foram salvos

## 📚 Referências

- [Documentação React](https://react.dev/)
- [Documentação Vite](https://vitejs.dev/)
- [Bitrix24 API](https://dev.bitrix24.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 🆘 Suporte

Em caso de dúvidas ou problemas:

1. Verifique os logs do console do navegador (F12)
2. Verifique os logs do servidor backend
3. Confirme que as URLs estão corretas
4. Teste os endpoints diretamente com Postman/curl
5. Verifique a configuração do CORS

## 🎨 Customização

### Cores

Edite `/frontend/src/styles/global.css`:

```css
:root {
  --primary-color: #007bff;  /* Sua cor primária */
  --success-color: #28a745;  /* Cor de sucesso */
  --error-color: #dc3545;    /* Cor de erro */
}
```

### Layout

Modifique `/frontend/src/components/ConfigForm.css` para ajustar:
- Espaçamentos
- Tamanhos de fonte
- Responsividade
- Animações
