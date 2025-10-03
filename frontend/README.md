# Bitrix24 Configuration Frontend

Interface de configuração React para o MCP Bitrix24 Server.

## 🚀 Funcionalidades

- ✅ Formulário completo para configuração de conta Bitrix24
- ✅ Campos para: Nome da Conta, Webhook URL, Client ID, Client Secret, Token de Acesso, Descrição
- ✅ Teste de conexão com feedback visual (sucesso/erro)
- ✅ Botão de salvar configuração
- ✅ Layout responsivo e intuitivo
- ✅ Pronto para integração com backend via API REST

## 📋 Campos do Formulário

### Obrigatórios
- **Nome da Conta**: Identificador amigável para a conta
- **URL do Webhook/Endpoint**: URL do webhook de entrada do Bitrix24

### Opcionais
- **Client ID**: Para autenticação OAuth
- **Client Secret**: Para autenticação OAuth
- **Token de Acesso**: Token alternativo de autenticação
- **Descrição**: Informações adicionais sobre a integração

## 🛠️ Como Executar

### Instalação

```bash
cd frontend
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

## 🔌 Integração com Backend

O componente está preparado para integração com endpoints REST. As chamadas de API devem ser implementadas em:

### Testar Conexão
```typescript
POST /api/bitrix24/test-connection
Body: Bitrix24Config
Response: { success: boolean, message: string }
```

### Salvar Configuração
```typescript
POST /api/bitrix24/config
Body: Bitrix24Config
Response: { success: boolean, id: string }
```

## 📱 Responsividade

A interface é totalmente responsiva e se adapta a:
- 📱 Mobile (< 480px)
- 📱 Tablet (< 768px)
- 💻 Desktop (> 768px)

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool moderna e rápida
- **CSS Modules** - Estilos isolados
- **Responsive Design** - Mobile-first

## 📝 Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/
│   │   ├── ConfigForm.tsx      # Componente principal do formulário
│   │   └── ConfigForm.css      # Estilos do formulário
│   ├── types/
│   │   └── config.ts           # Tipos TypeScript
│   ├── styles/
│   │   └── global.css          # Estilos globais
│   ├── App.tsx                 # Componente raiz
│   └── main.tsx                # Entry point
├── public/                     # Assets estáticos
├── index.html                  # HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔒 Segurança

- Senhas e tokens são ocultados (type="password")
- Validação de campos obrigatórios
- Sanitização de inputs
- Pronto para implementação de HTTPS em produção

## 🌐 Futuras Melhorias

- [ ] Integração real com backend API
- [ ] Validação avançada de URLs
- [ ] Suporte a múltiplas contas
- [ ] Histórico de conexões
- [ ] Testes automatizados
- [ ] Internacionalização (i18n)
