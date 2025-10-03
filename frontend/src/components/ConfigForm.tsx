import React, { useState } from 'react';
import { Bitrix24Config, ConnectionStatus } from '../types/config';
import './ConfigForm.css';

const ConfigForm: React.FC = () => {
  const [config, setConfig] = useState<Bitrix24Config>({
    accountName: '',
    webhookUrl: '',
    clientId: '',
    clientSecret: '',
    accessToken: '',
    description: '',
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.IDLE
  );
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const testConnection = async () => {
    // Reset status
    setConnectionStatus(ConnectionStatus.TESTING);
    setStatusMessage('');

    try {
      // Simulate API call to test connection
      // In a real implementation, this would call your backend API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demonstration, check if webhook URL is provided
      if (!config.webhookUrl) {
        throw new Error('Webhook URL é obrigatório');
      }

      // Simulate testing the webhook
      // In production, this would make an actual request to:
      // POST /api/bitrix24/test-connection
      // with the config data

      // Mock successful response
      setConnectionStatus(ConnectionStatus.SUCCESS);
      setStatusMessage('Conexão estabelecida com sucesso! Bitrix24 está respondendo corretamente.');
    } catch (error) {
      setConnectionStatus(ConnectionStatus.ERROR);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Falha ao conectar com Bitrix24. Verifique as credenciais.'
      );
    }
  };

  const handleSave = async () => {
    try {
      // In a real implementation, this would save to your backend
      // POST /api/bitrix24/config
      // with the config data

      // For now, just log to console and show in localStorage for demo
      console.log('Saving configuration:', config);
      localStorage.setItem('bitrix24_config', JSON.stringify(config));

      alert('Configuração salva com sucesso! (Armazenada localmente para demonstração)');
    } catch (error) {
      alert('Erro ao salvar configuração: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const isFormValid = () => {
    return config.accountName.trim() !== '' && config.webhookUrl.trim() !== '';
  };

  return (
    <div className="config-form">
      <div className="form-header">
        <h1>🔗 Configuração Bitrix24</h1>
        <p>Configure sua conta Bitrix24 para integração com o MCP Server</p>
      </div>

      <div className="form-group">
        <label htmlFor="accountName">
          Nome da Conta<span className="required">*</span>
        </label>
        <input
          type="text"
          id="accountName"
          name="accountName"
          value={config.accountName}
          onChange={handleInputChange}
          placeholder="Minha Empresa Bitrix24"
          required
        />
        <small>Um nome amigável para identificar esta conta</small>
      </div>

      <div className="form-group">
        <label htmlFor="webhookUrl">
          URL do Webhook/Endpoint<span className="required">*</span>
        </label>
        <input
          type="url"
          id="webhookUrl"
          name="webhookUrl"
          value={config.webhookUrl}
          onChange={handleInputChange}
          placeholder="https://sua-conta.bitrix24.com/rest/..."
          required
        />
        <small>URL do webhook de entrada do Bitrix24</small>
      </div>

      <div className="form-group">
        <label htmlFor="clientId">Client ID</label>
        <input
          type="text"
          id="clientId"
          name="clientId"
          value={config.clientId}
          onChange={handleInputChange}
          placeholder="seu-client-id"
        />
        <small>Client ID da aplicação OAuth (opcional)</small>
      </div>

      <div className="form-group">
        <label htmlFor="clientSecret">Client Secret</label>
        <input
          type="password"
          id="clientSecret"
          name="clientSecret"
          value={config.clientSecret}
          onChange={handleInputChange}
          placeholder="seu-client-secret"
        />
        <small>Client Secret da aplicação OAuth (opcional)</small>
      </div>

      <div className="form-group">
        <label htmlFor="accessToken">Token de Acesso</label>
        <input
          type="password"
          id="accessToken"
          name="accessToken"
          value={config.accessToken}
          onChange={handleInputChange}
          placeholder="seu-access-token"
        />
        <small>Token de acesso para autenticação (opcional se usar webhook)</small>
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={config.description}
          onChange={handleInputChange}
          placeholder="Descrição adicional sobre esta integração..."
          rows={4}
        />
        <small>Informações adicionais sobre esta configuração</small>
      </div>

      {connectionStatus !== ConnectionStatus.IDLE && (
        <div
          className={`status-message ${
            connectionStatus === ConnectionStatus.SUCCESS ? 'success' : 'error'
          }`}
        >
          <div className="status-icon">
            {connectionStatus === ConnectionStatus.SUCCESS ? '✅' : '❌'}
          </div>
          <div className="status-content">
            <h3>
              {connectionStatus === ConnectionStatus.SUCCESS
                ? 'Conexão Bem-Sucedida'
                : 'Erro na Conexão'}
            </h3>
            <p>{statusMessage}</p>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={testConnection}
          disabled={
            !isFormValid() || connectionStatus === ConnectionStatus.TESTING
          }
        >
          {connectionStatus === ConnectionStatus.TESTING ? (
            <>
              <span className="spinner"></span>
              Testando...
            </>
          ) : (
            <>
              🔍 Testar Conexão
            </>
          )}
        </button>
        <button
          type="button"
          className={`btn ${
            connectionStatus === ConnectionStatus.SUCCESS
              ? 'btn-success'
              : 'btn-primary'
          }`}
          onClick={handleSave}
          disabled={!isFormValid()}
        >
          💾 Salvar Configuração
        </button>
      </div>
    </div>
  );
};

export default ConfigForm;
