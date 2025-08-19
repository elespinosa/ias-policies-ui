export interface DatabaseTable {
  name: string;
  displayName: string;
  description?: string;
  urlEndpoint?: string;
  columns: DatabaseColumn[];
}

export interface DatabaseColumn {
  name: string;
  displayName: string;
  dataType: 'VARCHAR' | 'INT' | 'DATE' | 'BOOLEAN' | 'DECIMAL' | 'TEXT' | 'DATETIME' | 'ENUM' | 'TIMESTAMP';
  required: boolean;
  maxLength?: number;
  defaultValue?: string;
  description?: string;
}

export interface FileData {
  headers: string[];
  rows: (string | number | null)[][];
  fileName: string;
  fileType: 'csv' | 'xlsx';
  fileSize: number;
}

export interface ColumnMapping {
  fileHeader: string;
  tableColumn: string | null;
  useDefaultValue: boolean;
  defaultValue?: string;
  skip: boolean;
}

export interface ValidationError {
  row: number;
  column: string;
  error: string;
  value: any;
}

export interface ImportStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: ValidationError[];
}
