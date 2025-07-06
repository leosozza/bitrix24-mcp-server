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
  DATE_CREATE?: string;
  DATE_MODIFY?: string;
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
  DATE_CREATE?: string;
  DATE_MODIFY?: string;
  ASSIGNED_BY_ID?: string;
  CREATED_BY_ID?: string;
  MODIFY_BY_ID?: string;
}

export interface BitrixLead {
  ID?: string;
  TITLE?: string;
  NAME?: string;
  LAST_NAME?: string;
  SECOND_NAME?: string;
  COMPANY_TITLE?: string;
  SOURCE_ID?: string;
  STATUS_ID?: string;
  STATUS_SEMANTIC_ID?: string;
  OPPORTUNITY?: string;
  CURRENCY_ID?: string;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  ASSIGNED_BY_ID?: string;
  CREATED_BY_ID?: string;
  MODIFY_BY_ID?: string;
  DATE_CREATE?: string;
  DATE_MODIFY?: string;
  DATE_CLOSED?: string;
  COMMENTS?: string;
  OPENED?: string;
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

export interface BitrixCompany {
  ID?: string;
  TITLE?: string;
  COMPANY_TYPE?: string;
  INDUSTRY?: string;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  WEB?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  ADDRESS?: string;
  EMPLOYEES?: string;
  REVENUE?: string;
  COMMENTS?: string;
  ASSIGNED_BY_ID?: string;
  CREATED_BY_ID?: string;
  MODIFY_BY_ID?: string;
  DATE_CREATE?: string;
  DATE_MODIFY?: string;
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
          } else if (key === 'order' && typeof value === 'object' && value !== null) {
            // Handle order parameter specially - Bitrix24 expects it as individual parameters
            Object.entries(value).forEach(([orderKey, orderValue]) => {
              body.append(`order[${orderKey}]`, String(orderValue));
            });
          } else if (key === 'filter' && typeof value === 'object' && value !== null) {
            // Handle filter parameter specially
            Object.entries(value).forEach(([filterKey, filterValue]) => {
              body.append(`filter[${filterKey}]`, String(filterValue));
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

  // Helper method to get latest contacts with proper ordering
  async getLatestContacts(limit: number = 20): Promise<BitrixContact[]> {
    // Use Bitrix24's built-in ordering which works correctly
    const contacts = await this.makeRequest('crm.contact.list', {
      start: 0,
      order: { 'DATE_CREATE': 'DESC' },
      select: ['*']
    });
    
    return contacts.slice(0, limit);
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

  async listDeals(params: { 
    start?: number; 
    filter?: Record<string, any>;
    order?: Record<string, string>;
    select?: string[];
  } = {}): Promise<BitrixDeal[]> {
    return await this.makeRequest('crm.deal.list', params);
  }

  // Helper method to get latest deals with proper ordering
  async getLatestDeals(limit: number = 20): Promise<BitrixDeal[]> {
    // Use Bitrix24's built-in ordering which works correctly
    const deals = await this.makeRequest('crm.deal.list', {
      start: 0,
      order: { 'DATE_CREATE': 'DESC' },
      select: ['*']
    });
    
    return deals.slice(0, limit);
  }

  // Helper method to get deals from a specific date range
  async getDealsFromDateRange(startDate: string, endDate?: string, limit: number = 50): Promise<BitrixDeal[]> {
    const filter: Record<string, any> = {
      '>=DATE_CREATE': startDate
    };
    
    if (endDate) {
      filter['<=DATE_CREATE'] = endDate;
    }

    const deals = await this.makeRequest('crm.deal.list', {
      start: 0,
      select: ['*'],
      filter
    });
    
    // Sort by DATE_CREATE in JavaScript for consistency
    const sortedDeals = deals.sort((a: BitrixDeal, b: BitrixDeal) => {
      const dateA = new Date(a.DATE_CREATE || '1970-01-01');
      const dateB = new Date(b.DATE_CREATE || '1970-01-01');
      return dateB.getTime() - dateA.getTime(); // DESC order (newest first)
    });
    
    return sortedDeals.slice(0, limit);
  }

  // CRM Lead Methods
  async createLead(lead: BitrixLead): Promise<string> {
    const result = await this.makeRequest('crm.lead.add', { fields: lead });
    return result.toString();
  }

  async getLead(id: string): Promise<BitrixLead> {
    return await this.makeRequest('crm.lead.get', { id });
  }

  async updateLead(id: string, lead: Partial<BitrixLead>): Promise<boolean> {
    const result = await this.makeRequest('crm.lead.update', { id, fields: lead });
    return result === true;
  }

  async listLeads(params: { 
    start?: number; 
    filter?: Record<string, any>;
    order?: Record<string, string>;
    select?: string[];
  } = {}): Promise<BitrixLead[]> {
    return await this.makeRequest('crm.lead.list', params);
  }

  // Helper method to get latest leads with proper ordering
  async getLatestLeads(limit: number = 20): Promise<BitrixLead[]> {
    // Use Bitrix24's built-in ordering which works correctly
    const leads = await this.makeRequest('crm.lead.list', {
      start: 0,
      order: { 'DATE_CREATE': 'DESC' },
      select: ['*']
    });
    
    return leads.slice(0, limit);
  }

  // Helper method to get leads from a specific date range
  async getLeadsFromDateRange(startDate: string, endDate?: string, limit: number = 50): Promise<BitrixLead[]> {
    const filter: Record<string, any> = {
      '>=DATE_CREATE': startDate
    };
    
    if (endDate) {
      filter['<=DATE_CREATE'] = endDate;
    }

    const leads = await this.makeRequest('crm.lead.list', {
      start: 0,
      select: ['*'],
      filter
    });
    
    // Sort by DATE_CREATE in JavaScript
    const sortedLeads = leads.sort((a: BitrixLead, b: BitrixLead) => {
      const dateA = new Date(a.DATE_CREATE || '1970-01-01');
      const dateB = new Date(b.DATE_CREATE || '1970-01-01');
      return dateB.getTime() - dateA.getTime(); // DESC order (newest first)
    });
    
    return sortedLeads.slice(0, limit);
  }

  // CRM Company Methods
  async createCompany(company: BitrixCompany): Promise<string> {
    const result = await this.makeRequest('crm.company.add', { fields: company });
    return result.toString();
  }

  async getCompany(id: string): Promise<BitrixCompany> {
    return await this.makeRequest('crm.company.get', { id });
  }

  async updateCompany(id: string, company: Partial<BitrixCompany>): Promise<boolean> {
    const result = await this.makeRequest('crm.company.update', { id, fields: company });
    return result === true;
  }

  async listCompanies(params: { 
    start?: number; 
    filter?: Record<string, any>;
    order?: Record<string, string>;
    select?: string[];
  } = {}): Promise<BitrixCompany[]> {
    return await this.makeRequest('crm.company.list', params);
  }

  // Helper method to get latest companies with proper ordering
  async getLatestCompanies(limit: number = 20): Promise<BitrixCompany[]> {
    const companies = await this.makeRequest('crm.company.list', {
      start: 0,
      order: { 'DATE_CREATE': 'DESC' },
      select: ['*']
    });
    
    return companies.slice(0, limit);
  }

  // Helper method to get companies from a specific date range
  async getCompaniesFromDateRange(startDate: string, endDate?: string, limit: number = 50): Promise<BitrixCompany[]> {
    const filter: Record<string, any> = {
      '>=DATE_CREATE': startDate
    };
    
    if (endDate) {
      filter['<=DATE_CREATE'] = endDate;
    }

    const companies = await this.makeRequest('crm.company.list', {
      start: 0,
      select: ['*'],
      filter
    });
    
    // Sort by DATE_CREATE in JavaScript for consistency
    const sortedCompanies = companies.sort((a: BitrixCompany, b: BitrixCompany) => {
      const dateA = new Date(a.DATE_CREATE || '1970-01-01');
      const dateB = new Date(b.DATE_CREATE || '1970-01-01');
      return dateB.getTime() - dateA.getTime(); // DESC order (newest first)
    });
    
    return sortedCompanies.slice(0, limit);
  }

  // Deal Pipeline and Stage Methods
  async getDealPipelines(): Promise<any[]> {
    return await this.makeRequest('crm.dealcategory.list');
  }

  async getDealStages(pipelineId?: string): Promise<any[]> {
    const params: Record<string, any> = {};
    if (pipelineId) {
      params.id = pipelineId;
    }
    return await this.makeRequest('crm.dealcategory.stage.list', params);
  }

  // Enhanced Deal Filtering Methods
  async filterDealsByPipeline(pipelineId: string, options: {
    limit?: number;
    orderBy?: string;
    orderDirection?: string;
    select?: string[];
  } = {}): Promise<BitrixDeal[]> {
    const filter: Record<string, any> = {
      'CATEGORY_ID': pipelineId
    };

    const order: Record<string, string> = {};
    if (options.orderBy) {
      order[options.orderBy] = options.orderDirection || 'DESC';
    }

    const deals = await this.makeRequest('crm.deal.list', {
      start: 0,
      filter,
      order: Object.keys(order).length > 0 ? order : { 'DATE_CREATE': 'DESC' },
      select: options.select || ['*']
    });

    return deals.slice(0, options.limit || 50);
  }

  async filterDealsByBudget(minBudget: number, maxBudget?: number, currency: string = 'EUR', options: {
    limit?: number;
    orderBy?: string;
    orderDirection?: string;
    select?: string[];
  } = {}): Promise<BitrixDeal[]> {
    const filter: Record<string, any> = {
      '>=OPPORTUNITY': minBudget.toString()
    };

    if (maxBudget) {
      filter['<=OPPORTUNITY'] = maxBudget.toString();
    }

    // Add currency filter if specified
    if (currency) {
      filter['CURRENCY_ID'] = currency;
    }

    const order: Record<string, string> = {};
    if (options.orderBy) {
      order[options.orderBy] = options.orderDirection || 'DESC';
    }

    const deals = await this.makeRequest('crm.deal.list', {
      start: 0,
      filter,
      order: Object.keys(order).length > 0 ? order : { 'OPPORTUNITY': 'DESC' },
      select: options.select || ['*']
    });

    return deals.slice(0, options.limit || 50);
  }

  async filterDealsByStatus(stageIds: string[], pipelineId?: string, options: {
    limit?: number;
    orderBy?: string;
    orderDirection?: string;
    select?: string[];
  } = {}): Promise<BitrixDeal[]> {
    const filter: Record<string, any> = {};

    // Handle multiple stage IDs
    if (stageIds.length === 1) {
      filter['STAGE_ID'] = stageIds[0];
    } else {
      // For multiple stages, we need to use the @STAGE_ID syntax
      stageIds.forEach((stageId, index) => {
        filter[`@STAGE_ID[${index}]`] = stageId;
      });
    }

    // Add pipeline filter if specified
    if (pipelineId) {
      filter['CATEGORY_ID'] = pipelineId;
    }

    const order: Record<string, string> = {};
    if (options.orderBy) {
      order[options.orderBy] = options.orderDirection || 'DESC';
    }

    const deals = await this.makeRequest('crm.deal.list', {
      start: 0,
      filter,
      order: Object.keys(order).length > 0 ? order : { 'DATE_CREATE': 'DESC' },
      select: options.select || ['*']
    });

    return deals.slice(0, options.limit || 50);
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

  // Diagnostic Methods
  async diagnosePermissions(): Promise<any> {
    const results = {
      webhook_valid: false,
      app_info: null,
      permissions: null,
      crm_access: false,
      leads_access: false,
      contacts_access: false,
      deals_access: false,
      error_details: [] as string[]
    };

    try {
      // Test basic webhook
      results.app_info = await this.makeRequest('app.info');
      results.webhook_valid = true;
    } catch (error) {
      results.error_details.push(`app.info failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      // Test permissions endpoint
      results.permissions = await this.makeRequest('user.access');
    } catch (error) {
      results.error_details.push(`user.access failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test CRM access
    try {
      await this.listContacts({ start: 0 });
      results.contacts_access = true;
      results.crm_access = true;
    } catch (error) {
      results.error_details.push(`contacts access failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      await this.listDeals({ start: 0 });
      results.deals_access = true;
    } catch (error) {
      results.error_details.push(`deals access failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test leads access specifically
    try {
      await this.makeRequest('crm.lead.list', { start: 0 });
      results.leads_access = true;
    } catch (error) {
      results.error_details.push(`leads access failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return results;
  }

  async checkCRMSettings(): Promise<any> {
    const results = {
      lead_fields: null,
      lead_statuses: null,
      crm_mode: null,
      error_details: [] as string[]
    };

    try {
      // Get lead fields to check if leads are available
      results.lead_fields = await this.makeRequest('crm.lead.fields');
    } catch (error) {
      results.error_details.push(`crm.lead.fields failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      // Try to get lead statuses
      results.lead_statuses = await this.makeRequest('crm.status.list', { filter: { ENTITY_ID: 'STATUS' } });
    } catch (error) {
      results.error_details.push(`lead statuses failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      // Try to get CRM settings (might not be available via API)
      results.crm_mode = await this.makeRequest('crm.settings.mode.get');
    } catch (error) {
      results.error_details.push(`CRM mode check failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return results;
  }

  async testLeadsAPI(): Promise<any> {
    const results = {
      list_test: null,
      fields_test: null,
      count_test: null as number | string | null,
      simple_list: null,
      error_details: [] as string[]
    };

    // Test 1: Basic list with minimal parameters
    try {
      results.simple_list = await this.makeRequest('crm.lead.list', { start: 0 });
    } catch (error) {
      results.error_details.push(`simple list failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 2: Get lead fields
    try {
      results.fields_test = await this.makeRequest('crm.lead.fields');
    } catch (error) {
      results.error_details.push(`fields test failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 3: List with specific parameters
    try {
      results.list_test = await this.makeRequest('crm.lead.list', {
        select: ['ID', 'TITLE', 'DATE_CREATE'],
        start: 0,
        order: { 'ID': 'DESC' }
      });
    } catch (error) {
      results.error_details.push(`parameterized list failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 4: Try to get count
    try {
      const countResult = await this.makeRequest('crm.lead.list', {
        select: ['ID'],
        start: 0,
        filter: {}
      });
      results.count_test = Array.isArray(countResult) ? countResult.length : 'Not an array';
    } catch (error) {
      results.error_details.push(`count test failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return results;
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
