import { ColumnMapping, ImportResult, DatabaseTable } from '@/types/import';

export interface MappingTemplate {
  id: string;
  name: string;
  tableName: string;
  mappings: ColumnMapping[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  fileName: string;
  fileSize: number;
  tableName: string;
  templateUsed?: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: Array<{
    row: number;
    column: string;
    error: string;
    value: any;
  }>;
  duration: number; // in milliseconds
}

const TEMPLATES_KEY = 'data-import-templates';
const AUDIT_LOGS_KEY = 'data-import-audit-logs';

// Mapping Templates
export const saveTemplate = (name: string, tableName: string, mappings: ColumnMapping[]): MappingTemplate => {
  const templates = getTemplates();
  const template: MappingTemplate = {
    id: Date.now().toString(),
    name,
    tableName,
    mappings,
    createdAt: new Date().toISOString(),
  };
  
  templates.push(template);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  return template;
};

export const updateTemplate = (templateId: string, name: string, tableName: string, mappings: ColumnMapping[]): MappingTemplate => {
  const templates = getTemplates();
  const templateIndex = templates.findIndex(t => t.id === templateId);
  
  if (templateIndex === -1) {
    throw new Error('Template not found');
  }
  
  const updatedTemplate: MappingTemplate = {
    ...templates[templateIndex],
    name,
    tableName,
    mappings,
  };
  
  templates[templateIndex] = updatedTemplate;
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  return updatedTemplate;
};

export const getTemplates = (): MappingTemplate[] => {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getTemplatesForTable = (tableName: string): MappingTemplate[] => {
  return getTemplates().filter(template => template.tableName === tableName);
};

export const deleteTemplate = (templateId: string): void => {
  const templates = getTemplates().filter(template => template.id !== templateId);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

// Audit Logs
export const saveAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog => {
  const logs = getAuditLogs();
  const auditLog: AuditLog = {
    ...logData,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  
  logs.unshift(auditLog); // Add to beginning for newest first
  
  // Keep only last 100 logs to prevent localStorage bloat
  const trimmedLogs = logs.slice(0, 100);
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(trimmedLogs));
  return auditLog;
};

export const getAuditLogs = (): AuditLog[] => {
  try {
    const stored = localStorage.getItem(AUDIT_LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearAuditLogs = (): void => {
  localStorage.removeItem(AUDIT_LOGS_KEY);
};
