import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { bitrix24Client, BitrixContact, BitrixDeal, BitrixTask } from '../bitrix24/client.js';

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

// Export all tools
export const allTools = [
  createContactTool,
  getContactTool,
  listContactsTool,
  updateContactTool,
  createDealTool,
  getDealTool,
  listDealsTool,
  updateDealTool,
  createTaskTool,
  getTaskTool,
  listTasksTool,
  updateTaskTool,
  searchCRMTool,
  validateWebhookTool
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
