import { ValidationError } from '@/types/import';

export interface ErrorReportData {
  fileName: string;
  tableName: string;
  importDate: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: ValidationError[];
}

/**
 * Generates a CSV string from error report data
 */
export const generateErrorReportCSV = (data: ErrorReportData): string => {
  const { fileName, tableName, importDate, totalRows, successfulRows, failedRows, errors } = data;
  
  // Create CSV header
  const csvRows = [
    // Summary section
    ['Error Report Summary'],
    [''],
    ['File Name', fileName],
    ['Target Table', tableName],
    ['Import Date', importDate],
    ['Total Rows', totalRows.toString()],
    ['Successful Rows', successfulRows.toString()],
    ['Failed Rows', failedRows.toString()],
    ['Success Rate', `${((successfulRows / totalRows) * 100).toFixed(1)}%`],
    [''],
    [''],
    // Error details section
    ['Error Details'],
    [''],
    ['Row', 'Column', 'Error Message', 'Value'],
  ];

  // Add error rows
  errors.forEach(error => {
    csvRows.push([
      error.row.toString(),
      error.column || 'Unknown',
      error.error || 'Unknown error',
      error.value !== null && error.value !== undefined ? String(error.value) : ''
    ]);
  });

  // Convert to CSV string
  return csvRows.map(row => 
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const escaped = String(cell).replace(/"/g, '""');
      if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')) {
        return `"${escaped}"`;
      }
      return escaped;
    }).join(',')
  ).join('\n');
};

/**
 * Downloads a CSV file with the given content and filename
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download link
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Fallback for older browsers
    window.open(`data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
  }
};

/**
 * Generates and downloads an error report CSV file
 */
export const downloadErrorReport = (data: ErrorReportData): void => {
  const csvContent = generateErrorReportCSV(data);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `error-report-${data.tableName}-${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
}; 