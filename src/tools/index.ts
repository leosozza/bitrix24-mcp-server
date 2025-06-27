import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { bitrix24Client, BitrixContact, BitrixDeal, BitrixTask, BitrixLead } from '../bitrix24/client.js';

// Contact Management Tools
export const createContactTool: Tool = {
  name: 'bitrix24_create_contact',
  description: 'Create a new contact in Bitrix24 CRM',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'First name' },
      lastName: { type: 'string', description: 'Last name' },
      phone: { type: 'string', description: 'Phone number' },
      email: { type: 'string', description: 'Email address' },
      company: { type: 'string', description: 'Company name' },
      position: { type: 'string', description: 'Job position' },
      comments: { type: 'string', description: 'Additional comments' }
    },
    required: ['name', 'lastName']
  }
};

export const getContactTool: Tool = {
  name: 'bitrix24_get_contact',
  description: 'Retrieve contact information by ID',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Contact ID' }
    },
    required: ['id']
  }
};

export const listContactsTool: Tool = {
  name: 'bitrix24_list_contacts',
  description: 'List contacts with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Maximum number of contacts to return', default: 20 },
      filter: { type: 'object', description: 'Filter criteria (e.g., {"NAME": "John"})' }
    }
  }
};

export const getLatestContactsTool: Tool = {
  name: 'bitrix24_get_latest_contacts',
  description: 'Get the most recent contacts ordered by creation date',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Maximum number of contacts to return', default: 20 }
    }
  }
};

export const updateContactTool: Tool = {
  name: 'bitrix24_update_contact',
  description: 'Update an existing contact in Bitrix24 CRM',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Contact ID' },
      name: { type: 'string', description: 'First name' },
      lastName: { type: 'string', description: 'Last name' },
      phone: { type: 'string', description: 'Phone number' },
      email: { type: 'string', description: 'Email address' },
      company: { type: 'string', description: 'Company name' },
      position: { type: 'string', description: 'Job position' },
      comments: { type: 'string', description: 'Additional comments' }
    },
    required: ['id']
  }
};

// Deal Management Tools
export const createDealTool: Tool = {
  name: 'bitrix24_create_deal',
  description: 'Create a new deal in Bitrix24 CRM',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Deal title' },
      amount: { type: 'string', description: 'Deal amount' },
      currency: { type: 'string', description: 'Currency code (e.g., EUR, USD)', default: 'EUR' },
      contactId: { type: 'string', description: 'Associated contact ID' },
      stageId: { type: 'string', description: 'Deal stage ID' },
      comments: { type: 'string', description: 'Deal comments' }
    },
    required: ['title']
  }
};

export const getDealTool: Tool = {
  name: 'bitrix24_get_deal',
  description: 'Retrieve deal information by ID',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Deal ID' }
    },
    required: ['id']
  }
};

export const listDealsTool: Tool = {
  name: 'bitrix24_list_deals',
  description: 'List deals with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Maximum number of deals to return', default: 20 },
      filter: { type: 'object', description: 'Filter criteria (e.g., {"TITLE": "Project"})' }
    }
  }
};

export const updateDealTool: Tool = {
  name: 'bitrix24_update_deal',
  description: 'Update an existing deal in Bitrix24 CRM',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Deal ID' },
      title: { type: 'string', description: 'Deal title' },
      amount: { type: 'string', description: 'Deal amount' },
      currency: { type: 'string', description: 'Currency code (e.g., EUR, USD)' },
      contactId: { type: 'string', description: 'Associated contact ID' },
      stageId: { type: 'string', description: 'Deal stage ID' },
      comments: { type: 'string', description: 'Deal comments' }
    },
    required: ['id']
  }
};

// Lead Management Tools
export const createLeadTool: Tool = {
  name: 'bitrix24_create_lead',
  description: 'Create a new lead in Bitrix24 CRM',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Lead title' },
      name: { type: 'string', description: 'First name' },
      lastName: { type: 'string', description: 'Last name' },
      company: { type: 'string', description: 'Company name' },
      phone: { type: 'string', description: 'Phone number' },
      email: { type: 'string', description: 'Email address' },
      sourceId: { type: 'string', description: 'Lead source ID (e.g., CALL, EMAIL, WEB)' },
      statusId: { type: 'string', description: 'Lead status ID' },
      opportunity: { type: 'string', description: 'Expected deal amount' },
      currency: { type: 'string', description: 'Currency code (e.g., EUR, USD)', default: 'EUR' },
      comments: { type: 'string', description: 'Additional comments' }
    },
    required: ['title']
  }
};

export const getLeadTool: Tool = {
  name: 'bitrix24_get_lead',
  description: 'Retrieve lead information by ID',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Lead ID' }
    },
    required: ['id']
  }
};

export const listLeadsTool: Tool = {
  name: 'bitrix24_list_leads',
  description: 'List leads with optional filtering and ordering',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Maximum number of leads to return', default: 20 },
      filter: { type: 'object', description: 'Filter criteria (e.g., {"STATUS_ID": "NEW"})' },
      orderBy: { 
        type: 'string', 
        enum: ['DATE_CREATE', 'DATE_MODIFY', 'ID', 'TITLE'],
        description: 'Field to order by',
        default: 'DATE_CREATE'
      },
      orderDirection: {
        type: 'string',
        enum: ['ASC', 'DESC'],
        description: 'Order direction',
        default: 'DESC'
      }
    }
  }
};

export const getLatestLeadsTool: Tool = {
  name: 'bitrix24_get_latest_leads',
  description: 'Get the most recent leads ordered by creation date',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Maximum number of leads to return', default: 20 }
    }
  }
};

export const getLeadsFromDateRangeTool: Tool = {
  name: 'bitrix24_get_leads_from_date_range',
  description: 'Get leads created within a specific date range',
  inputSchema: {
    type: 'object',
    properties: {
      startDate: { type: 'string', description: 'Start date in YYYY-MM-DD format' },
      endDate: { type: 'string', description: 'End date in YYYY-MM-DD format (optional)' },
      limit: { type: 'number', description: 'Maximum number of leads to return', default: 50 }
    },
    required: ['startDate']
  }
};

export const updateLeadTool: Tool = {
  name: 'bitrix24_update_lead',
  description: 'Update an existing lead in Bitrix24 CRM',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Lead ID' },
      title: { type: 'string', description: 'Lead title' },
      name: { type: 'string', description: 'First name' },
      lastName: { type: 'string', description: 'Last name' },
      company: { type: 'string', description: 'Company name' },
      phone: { type: 'string', description: 'Phone number' },
      email: { type: 'string', description: 'Email address' },
      sourceId: { type: 'string', description: 'Lead source ID' },
      statusId: { type: 'string', description: 'Lead status ID' },
      opportunity: { type: 'string', description: 'Expected deal amount' },
      currency: { type: 'string', description: 'Currency code' },
      comments: { type: 'string', description: 'Additional comments' }
    },
    required: ['id']
  }
};

// Task Management Tools
export const createTaskTool: Tool = {
  name: 'bitrix24_create_task',
  description: 'Create a new task in Bitrix24',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Task title' },
      description: { type: 'string', description: 'Task description' },
      responsibleId: { type: 'string', description: 'Responsible user ID' },
      deadline: { type: 'string', description: 'Deadline in YYYY-MM-DD format' },
      priority: { 
        type: 'string', 
        enum: ['0', '1', '2'],
        description: 'Priority: 0=Low, 1=Normal, 2=High'
      },
      crmEntities: { 
        type: 'array',
        items: { type: 'string' },
        description: 'CRM entity IDs to link (e.g., ["C_123", "D_456"])'
      }
    },
    required: ['title']
  }
};

export const getTaskTool: Tool = {
  name: 'bitrix24_get_task',
  description: 'Retrieve task information by ID',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Task ID' }
    },
    required: ['id']
  }
};

export const listTasksTool: Tool = {
  name: 'bitrix24_list_tasks',
  description: 'List tasks with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Maximum number of tasks to return', default: 20 },
      filter: { type: 'object', description: 'Filter criteria (e.g., {"TITLE": "Project"})' },
      responsibleId: { type: 'string', description: 'Filter by responsible user ID' }
    }
  }
};

export const updateTaskTool: Tool = {
  name: 'bitrix24_update_task',
  description: 'Update an existing task in Bitrix24',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Task ID' },
      title: { type: 'string', description: 'Task title' },
      description: { type: 'string', description: 'Task description' },
      responsibleId: { type: 'string', description: 'Responsible user ID' },
      deadline: { type: 'string', description: 'Deadline in YYYY-MM-DD format' },
      priority: { 
        type: 'string', 
        enum: ['0', '1', '2'],
        description: 'Priority: 0=Low, 1=Normal, 2=High'
      },
      status: {
        type: 'string',
        enum: ['1', '2', '3', '4', '5'],
        description: 'Status: 1=New, 2=Pending, 3=In Progress, 4=Completed, 5=Deferred'
      }
    },
    required: ['id']
  }
};

// Search and Utility Tools
export const searchCRMTool: Tool = {
  name: 'bitrix24_search_crm',
  description: 'Search across CRM entities (contacts, companies, deals, leads)',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query (email, phone, name)' },
      entityTypes: {
        type: 'array',
        items: { type: 'string', enum: ['contact', 'company', 'deal', 'lead'] },
        description: 'Entity types to search',
        default: ['contact', 'company', 'deal', 'lead']
      }
    },
    required: ['query']
  }
};


export const validateWebhookTool: Tool = {
  name: 'bitrix24_validate_webhook',
  description: 'Validate the Bitrix24 webhook connection',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

// Diagnostic Tools
export const diagnosePermissionsTool: Tool = {
  name: 'bitrix24_diagnose_permissions',
  description: 'Diagnose webhook permissions and access to different CRM entities',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

export const checkCRMSettingsTool: Tool = {
  name: 'bitrix24_check_crm_settings',
  description: 'Check CRM settings including lead fields, statuses, and mode',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

export const testLeadsAPITool: Tool = {
  name: 'bitrix24_test_leads_api',
  description: 'Test various leads API endpoints to identify specific issues',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

// Export all tools
export const allTools = [
  createContactTool,
  getContactTool,
  listContactsTool,
  getLatestContactsTool,
  updateContactTool,
  createDealTool,
  getDealTool,
  listDealsTool,
  updateDealTool,
  createLeadTool,
  getLeadTool,
  listLeadsTool,
  getLatestLeadsTool,
  getLeadsFromDateRangeTool,
  updateLeadTool,
  createTaskTool,
  getTaskTool,
  listTasksTool,
  updateTaskTool,
  searchCRMTool,
  validateWebhookTool,
  diagnosePermissionsTool,
  checkCRMSettingsTool,
  testLeadsAPITool
];

// Tool execution handlers
export async function executeToolCall(name: string, args: any): Promise<any> {
  try {
    switch (name) {
      case 'bitrix24_create_contact':
        const contact: BitrixContact = {
          NAME: args.name,
          LAST_NAME: args.lastName,
          PHONE: args.phone ? [{ VALUE: args.phone, VALUE_TYPE: 'WORK' }] : undefined,
          EMAIL: args.email ? [{ VALUE: args.email, VALUE_TYPE: 'WORK' }] : undefined,
          COMPANY_TITLE: args.company,
          POST: args.position,
          COMMENTS: args.comments
        };
        const contactId = await bitrix24Client.createContact(contact);
        return { success: true, contactId, message: `Contact created with ID: ${contactId}` };

      case 'bitrix24_get_contact':
        const contactData = await bitrix24Client.getContact(args.id);
        return { success: true, contact: contactData };

      case 'bitrix24_list_contacts':
        const contacts = await bitrix24Client.listContacts({
          start: 0,
          filter: args.filter
        });
        return { success: true, contacts: contacts.slice(0, args.limit || 20) };

      case 'bitrix24_get_latest_contacts':
        const latestContacts = await bitrix24Client.getLatestContacts(args.limit || 20);
        return { success: true, contacts: latestContacts };

      case 'bitrix24_update_contact':
        const updateContact: Partial<BitrixContact> = {};
        if (args.name) updateContact.NAME = args.name;
        if (args.lastName) updateContact.LAST_NAME = args.lastName;
        if (args.phone) updateContact.PHONE = [{ VALUE: args.phone, VALUE_TYPE: 'WORK' }];
        if (args.email) updateContact.EMAIL = [{ VALUE: args.email, VALUE_TYPE: 'WORK' }];
        if (args.company) updateContact.COMPANY_TITLE = args.company;
        if (args.position) updateContact.POST = args.position;
        if (args.comments) updateContact.COMMENTS = args.comments;
        
        const contactUpdated = await bitrix24Client.updateContact(args.id, updateContact);
        return { success: true, updated: contactUpdated, message: `Contact ${args.id} updated successfully` };

      case 'bitrix24_create_deal':
        const deal: BitrixDeal = {
          TITLE: args.title,
          OPPORTUNITY: args.amount,
          CURRENCY_ID: args.currency || 'EUR',
          CONTACT_ID: args.contactId,
          STAGE_ID: args.stageId,
          COMMENTS: args.comments
        };
        const dealId = await bitrix24Client.createDeal(deal);
        return { success: true, dealId, message: `Deal created with ID: ${dealId}` };

      case 'bitrix24_get_deal':
        const dealData = await bitrix24Client.getDeal(args.id);
        return { success: true, deal: dealData };

      case 'bitrix24_list_deals':
        const deals = await bitrix24Client.listDeals({
          start: 0,
          filter: args.filter
        });
        return { success: true, deals: deals.slice(0, args.limit || 20) };

      case 'bitrix24_update_deal':
        const updateDeal: Partial<BitrixDeal> = {};
        if (args.title) updateDeal.TITLE = args.title;
        if (args.amount) updateDeal.OPPORTUNITY = args.amount;
        if (args.currency) updateDeal.CURRENCY_ID = args.currency;
        if (args.contactId) updateDeal.CONTACT_ID = args.contactId;
        if (args.stageId) updateDeal.STAGE_ID = args.stageId;
        if (args.comments) updateDeal.COMMENTS = args.comments;
        
        const dealUpdated = await bitrix24Client.updateDeal(args.id, updateDeal);
        return { success: true, updated: dealUpdated, message: `Deal ${args.id} updated successfully` };

      case 'bitrix24_create_lead':
        const lead: BitrixLead = {
          TITLE: args.title,
          NAME: args.name,
          LAST_NAME: args.lastName,
          COMPANY_TITLE: args.company,
          PHONE: args.phone ? [{ VALUE: args.phone, VALUE_TYPE: 'WORK' }] : undefined,
          EMAIL: args.email ? [{ VALUE: args.email, VALUE_TYPE: 'WORK' }] : undefined,
          SOURCE_ID: args.sourceId,
          STATUS_ID: args.statusId,
          OPPORTUNITY: args.opportunity,
          CURRENCY_ID: args.currency || 'EUR',
          COMMENTS: args.comments
        };
        const leadId = await bitrix24Client.createLead(lead);
        return { success: true, leadId, message: `Lead created with ID: ${leadId}` };

      case 'bitrix24_get_lead':
        const leadData = await bitrix24Client.getLead(args.id);
        return { success: true, lead: leadData };

      case 'bitrix24_list_leads':
        const order: Record<string, string> = {};
        order[args.orderBy || 'DATE_CREATE'] = args.orderDirection || 'DESC';
        
        const leads = await bitrix24Client.listLeads({
          start: 0,
          filter: args.filter,
          order,
          select: ['*']
        });
        return { success: true, leads: leads.slice(0, args.limit || 20) };

      case 'bitrix24_get_latest_leads':
        const latestLeads = await bitrix24Client.getLatestLeads(args.limit || 20);
        return { success: true, leads: latestLeads };

      case 'bitrix24_get_leads_from_date_range':
        const dateRangeLeads = await bitrix24Client.getLeadsFromDateRange(
          args.startDate,
          args.endDate,
          args.limit || 50
        );
        return { success: true, leads: dateRangeLeads };

      case 'bitrix24_update_lead':
        const updateLead: Partial<BitrixLead> = {};
        if (args.title) updateLead.TITLE = args.title;
        if (args.name) updateLead.NAME = args.name;
        if (args.lastName) updateLead.LAST_NAME = args.lastName;
        if (args.company) updateLead.COMPANY_TITLE = args.company;
        if (args.phone) updateLead.PHONE = [{ VALUE: args.phone, VALUE_TYPE: 'WORK' }];
        if (args.email) updateLead.EMAIL = [{ VALUE: args.email, VALUE_TYPE: 'WORK' }];
        if (args.sourceId) updateLead.SOURCE_ID = args.sourceId;
        if (args.statusId) updateLead.STATUS_ID = args.statusId;
        if (args.opportunity) updateLead.OPPORTUNITY = args.opportunity;
        if (args.currency) updateLead.CURRENCY_ID = args.currency;
        if (args.comments) updateLead.COMMENTS = args.comments;
        
        const leadUpdated = await bitrix24Client.updateLead(args.id, updateLead);
        return { success: true, updated: leadUpdated, message: `Lead ${args.id} updated successfully` };

      case 'bitrix24_create_task':
        const task: BitrixTask = {
          TITLE: args.title,
          DESCRIPTION: args.description,
          RESPONSIBLE_ID: args.responsibleId,
          DEADLINE: args.deadline,
          PRIORITY: args.priority || '1',
          UF_CRM_TASK: args.crmEntities
        };
        const taskId = await bitrix24Client.createTask(task);
        return { success: true, taskId, message: `Task created with ID: ${taskId}` };

      case 'bitrix24_get_task':
        const taskData = await bitrix24Client.getTask(args.id);
        return { success: true, task: taskData };

      case 'bitrix24_list_tasks':
        const taskFilter: any = args.filter || {};
        if (args.responsibleId) {
          taskFilter.RESPONSIBLE_ID = args.responsibleId;
        }
        
        const tasks = await bitrix24Client.listTasks({
          filter: taskFilter,
          start: 0
        });
        return { success: true, tasks: tasks.slice(0, args.limit || 20) };

      case 'bitrix24_update_task':
        const updateTask: Partial<BitrixTask> = {};
        if (args.title) updateTask.TITLE = args.title;
        if (args.description) updateTask.DESCRIPTION = args.description;
        if (args.responsibleId) updateTask.RESPONSIBLE_ID = args.responsibleId;
        if (args.deadline) updateTask.DEADLINE = args.deadline;
        if (args.priority) updateTask.PRIORITY = args.priority;
        if (args.status) updateTask.STATUS = args.status;
        
        const taskUpdated = await bitrix24Client.updateTask(args.id, updateTask);
        return { success: true, updated: taskUpdated, message: `Task ${args.id} updated successfully` };

      case 'bitrix24_search_crm':
        const searchResults = await bitrix24Client.searchCRM(args.query, args.entityTypes);
        return { success: true, results: searchResults };

      case 'bitrix24_validate_webhook':
        const isValid = await bitrix24Client.validateWebhook();
        return { success: true, valid: isValid, message: isValid ? 'Webhook is valid' : 'Webhook validation failed' };

      case 'bitrix24_diagnose_permissions':
        const permissionResults = await bitrix24Client.diagnosePermissions();
        return { success: true, diagnosis: permissionResults };

      case 'bitrix24_check_crm_settings':
        const crmSettings = await bitrix24Client.checkCRMSettings();
        return { success: true, settings: crmSettings };

      case 'bitrix24_test_leads_api':
        const leadsTest = await bitrix24Client.testLeadsAPI();
        return { success: true, tests: leadsTest };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`Tool execution error [${name}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
