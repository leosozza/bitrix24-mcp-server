import fetch from 'node-fetch';
import { z } from 'zod';

// Environment configuration
const BITRIX24_WEBHOOK_URL = process.env.BITRIX24_WEBHOOK_URL || 
  'https://sviluppofranchising.bitrix24.it/rest/27/wwugdez6m774803q/';

// Validation schemas
const BitrixResponseSchema = z.object({
  result: z.any(),
  error: z.optional(z.object({
    error: z.string(),
    error_description: z.string()
  })),
  total: z.optional(z.number()),
  next: z.optional(z.number()),
  time: z.optional(z.object({
    start: z.number(),
    finish: z.number(),
    duration: z.number()
  }))
});

export interface BitrixContact {
  ID?: string;
  NAME?: string;
  LAST_NAME?: string;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  COMPANY_TITLE?: string;
  POST?: string;
  COMMENTS?: string;
}

export interface BitrixDeal {
  ID?: string;
  TITLE?: string;
  STAGE_ID?: string;
  OPPORTUNITY?: string;
  CURRENCY_ID?: string;
  CONTACT_ID?: string;
  COMPANY_ID?: string;
  BEGINDATE?: string;
  CLOSEDATE?: string;
  COMMENTS?: string;
}

export interface BitrixTask {
  ID?: string;
  TITLE?: string;
  DESCRIPTION?: string;
  RESPONSIBLE_ID?: string;
  DEADLINE?: string;
  PRIORITY?: '0' | '1' | '2'; // 0=Low, 1=Normal, 2=High
  STATUS?: '1' | '2' | '3' | '4' | '5'; // 1=New, 2=Pending, 3=In Progress, 4=Completed, 5=Deferred
  STAGE?: string;
  UF_CRM_TASK?: string[]; // CRM entities linked to task
}

export class Bitrix24Client {
  private baseUrl: string;
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 500; // 500ms between requests (2 requests/second)

  constructor(webhookUrl: string = BITRIX24_WEBHOOK_URL) {
    this.baseUrl = webhookUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await new Promise(resolve => 
        setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  private async makeRequest(method: string, params: Record<string, any> = {}): Promise<any> {
    await this.enforceRateLimit();

    const url = `${this.baseUrl}/${method}`;
    
    try {
      let response;
      
      if (Object.keys(params).length === 0) {
        // GET request for methods without parameters
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } else {
        // POST request with form data
        const body = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (key === 'fields' && typeof value === 'object' && value !== null) {
            // For fields parameter, we need to send each field as a separate parameter
            Object.entries(value).forEach(([fieldKey, fieldValue]) => {
              if (Array.isArray(fieldValue)) {
                // Handle arrays (like phone/email arrays)
                fieldValue.forEach((item, index) => {
                  if (typeof item === 'object') {
                    Object.entries(item).forEach(([subKey, subValue]) => {
                      body.append(`fields[${fieldKey}][${index}][${subKey}]`, String(subValue));
                    });
                  } else {
                    body.append(`fields[${fieldKey}][${index}]`, String(item));
                  }
                });
              } else if (typeof fieldValue === 'object' && fieldValue !== null) {
                Object.entries(fieldValue).forEach(([subKey, subValue]) => {
                  body.append(`fields[${fieldKey}][${subKey}]`, String(subValue));
                });
              } else if (fieldValue !== undefined && fieldValue !== null) {
                body.append(`fields[${fieldKey}]`, String(fieldValue));
              }
            });
          } else if (typeof value === 'object' && value !== null) {
            body.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            body.append(key, String(value));
          }
        });

        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: body.toString(),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const parsed = BitrixResponseSchema.parse(data);
      
      if (parsed.error) {
        throw new Error(`Bitrix24 API Error: ${parsed.error.error} - ${parsed.error.error_description}`);
      }

      return parsed.result;
    } catch (error) {
      console.error(`Bitrix24 API Error [${method}]:`, error);
      throw error;
    }
  }

  // CRM Contact Methods
  async createContact(contact: BitrixContact): Promise<string> {
    const result = await this.makeRequest('crm.contact.add', { fields: contact });
    return result.toString();
  }

  async getContact(id: string): Promise<BitrixContact> {
    return await this.makeRequest('crm.contact.get', { id });
  }

  async updateContact(id: string, contact: Partial<BitrixContact>): Promise<boolean> {
    const result = await this.makeRequest('crm.contact.update', { id, fields: contact });
    return result === true;
  }

  async listContacts(params: { start?: number; filter?: Record<string, any> } = {}): Promise<BitrixContact[]> {
    return await this.makeRequest('crm.contact.list', params);
  }

  // CRM Deal Methods
  async createDeal(deal: BitrixDeal): Promise<string> {
    const result = await this.makeRequest('crm.deal.add', { fields: deal });
    return result.toString();
  }

  async getDeal(id: string): Promise<BitrixDeal> {
    return await this.makeRequest('crm.deal.get', { id });
  }

  async updateDeal(id: string, deal: Partial<BitrixDeal>): Promise<boolean> {
    const result = await this.makeRequest('crm.deal.update', { id, fields: deal });
    return result === true;
  }

  async listDeals(params: { start?: number; filter?: Record<string, any> } = {}): Promise<BitrixDeal[]> {
    return await this.makeRequest('crm.deal.list', params);
  }

  // Task Methods
  async createTask(task: BitrixTask): Promise<string> {
    const result = await this.makeRequest('tasks.task.add', { fields: task });
    return result.task.id.toString();
  }

  async getTask(id: string): Promise<BitrixTask> {
    const result = await this.makeRequest('tasks.task.get', { taskId: id });
    return result.task;
  }

  async updateTask(id: string, task: Partial<BitrixTask>): Promise<boolean> {
    const result = await this.makeRequest('tasks.task.update', { taskId: id, fields: task });
    return result === true;
  }

  async listTasks(params: { 
    select?: string[];
    filter?: Record<string, any>;
    order?: Record<string, string>;
    start?: number;
  } = {}): Promise<BitrixTask[]> {
    const result = await this.makeRequest('tasks.task.list', params);
    return result.tasks || [];
  }

  // Utility Methods
  async getCurrentUser(): Promise<any> {
    return await this.makeRequest('user.current');
  }

  async searchCRM(query: string, entityTypes: string[] = ['contact', 'company', 'deal', 'lead']): Promise<any> {
    return await this.makeRequest('crm.duplicate.findbycomm', {
      entity_type: entityTypes.join(','),
      type: 'EMAIL',
      values: [query]
    });
  }

  async validateWebhook(): Promise<boolean> {
    try {
      // Try a simple method that requires minimal permissions
      await this.makeRequest('app.info');
      return true;
    } catch (error) {
      console.error('Webhook validation failed:', error);
      // Try alternative validation methods
      try {
        await this.listContacts({ start: 0 });
        return true;
      } catch (secondError) {
        console.error('Alternative validation also failed:', secondError);
        return false;
      }
    }
  }

  private async batchRequest(requests: Array<{ method: string; params: any }>): Promise<any[]> {
    // Implement batch processing for multiple operations
    const results = [];
    for (const req of requests) {
      const result = await this.makeRequest(req.method, req.params);
      results.push(result);
    }
    return results;
  }
}

export const bitrix24Client = new Bitrix24Client();
