import { DatabaseColumn, ValidationError, ColumnMapping } from '@/types/import';

export const validateData = (
  data: (string | number | null)[][],
  mappings: ColumnMapping[],
  columns: DatabaseColumn[]
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  data.forEach((row, rowIndex) => {
    mappings.forEach((mapping, mappingIndex) => {
      if (mapping.skip || !mapping.tableColumn) return;
      
      const column = columns.find(col => col.name === mapping.tableColumn);
      if (!column) return;
      
      const fileHeaderIndex = data.length > 0 && mappings.findIndex(m => m.fileHeader === mapping.fileHeader);
      const cellValue = fileHeaderIndex >= 0 && fileHeaderIndex < row.length ? row[fileHeaderIndex] : null;
      
      // Use default value if specified and cell is empty
      const actualValue = (cellValue === null || cellValue === undefined || String(cellValue).trim() === '') && mapping.useDefaultValue
        ? mapping.defaultValue || column.defaultValue
        : cellValue;
      
      // Check required fields
      if (column.required && (actualValue === null || actualValue === undefined || String(actualValue).trim() === '')) {
        errors.push({
          row: rowIndex + 1,
          column: column.displayName,
          error: 'This field is required',
          value: actualValue
        });
        return;
      }
      
      // Skip validation if value is empty and field is not required
      if (actualValue === null || actualValue === undefined || String(actualValue).trim() === '') {
        return;
      }
      
      // Validate data types
      const valueStr = String(actualValue).trim();
      
      switch (column.dataType) {
        case 'INT':
          if (!isValidInteger(valueStr)) {
            errors.push({
              row: rowIndex + 1,
              column: column.displayName,
              error: 'Must be a valid integer',
              value: actualValue
            });
          }
          break;
          
        case 'DECIMAL':
          if (!isValidDecimal(valueStr)) {
            errors.push({
              row: rowIndex + 1,
              column: column.displayName,
              error: 'Must be a valid decimal number',
              value: actualValue
            });
          }
          break;
          
        case 'DATE':
          if (!isValidDate(valueStr)) {
            errors.push({
              row: rowIndex + 1,
              column: column.displayName,
              error: 'Must be a valid date (YYYY-MM-DD)',
              value: actualValue
            });
          }
          break;
          
        case 'DATETIME':
          if (!isValidDateTime(valueStr)) {
            errors.push({
              row: rowIndex + 1,
              column: column.displayName,
              error: 'Must be a valid datetime',
              value: actualValue
            });
          }
          break;
          
        case 'BOOLEAN':
          if (!isValidBoolean(valueStr)) {
            errors.push({
              row: rowIndex + 1,
              column: column.displayName,
              error: 'Must be true/false, yes/no, 1/0',
              value: actualValue
            });
          }
          break;
          
        case 'VARCHAR':
        case 'TEXT':
          if (column.maxLength && valueStr.length > column.maxLength) {
            errors.push({
              row: rowIndex + 1,
              column: column.displayName,
              error: `Maximum length is ${column.maxLength} characters`,
              value: actualValue
            });
          }
          break;
      }
    });
  });
  
  return errors;
};

const isValidInteger = (value: string): boolean => {
  return /^-?\d+$/.test(value);
};

const isValidDecimal = (value: string): boolean => {
  return /^-?\d*\.?\d+$/.test(value) && !isNaN(parseFloat(value));
};

const isValidDate = (value: string): boolean => {
  // Check YYYY-MM-DD format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // Try other common formats
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isValidDateTime = (value: string): boolean => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

const isValidBoolean = (value: string): boolean => {
  const lowerValue = value.toLowerCase();
  return ['true', 'false', 'yes', 'no', '1', '0', 'y', 'n'].includes(lowerValue);
};