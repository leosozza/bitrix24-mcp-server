export interface Bitrix24Config {
  accountName: string;
  webhookUrl: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  description: string;
}

export interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export enum ConnectionStatus {
  IDLE = 'idle',
  TESTING = 'testing',
  SUCCESS = 'success',
  ERROR = 'error',
}
