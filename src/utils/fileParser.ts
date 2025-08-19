import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { FileData } from '@/types/import';

export const parseFile = (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcelFile(file, resolve, reject);
    } else if (fileExtension === 'csv') {
      parseCSVFile(file, resolve, reject);
    } else {
      reject(new Error('Unsupported file format. Please upload .xlsx or .csv files only.'));
    }
  });
};

const parseExcelFile = (file: File, resolve: (value: FileData) => void, reject: (reason: any) => void) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        reject(new Error('The Excel file appears to be empty.'));
        return;
      }
      
      const headers = (jsonData[0] as any[]).map(h => String(h || '').trim()).filter(h => h);
      const rows = jsonData.slice(1).filter((row: any) => {
        // Filter out completely empty rows
        return Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
      }).map((row: any) => {
        // Ensure each row has the same length as headers
        const processedRow = new Array(headers.length).fill(null);
        for (let i = 0; i < Math.min(row.length, headers.length); i++) {
          processedRow[i] = row[i] !== null && row[i] !== undefined ? row[i] : null;
        }
        return processedRow;
      });
      
      resolve({
        headers,
        rows,
        fileName: file.name,
        fileType: 'xlsx',
        fileSize: file.size
      });
    } catch (error) {
      reject(new Error(`Error parsing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  };
  
  reader.onerror = () => {
    reject(new Error('Error reading the Excel file.'));
  };
  
  reader.readAsArrayBuffer(file);
};

const parseCSVFile = (file: File, resolve: (value: FileData) => void, reject: (reason: any) => void) => {
  Papa.parse(file, {
    header: false,
    skipEmptyLines: 'greedy',
    complete: (results) => {
      try {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          return;
        }
        
        if (results.data.length === 0) {
          reject(new Error('The CSV file appears to be empty.'));
          return;
        }
        
        const headers = (results.data[0] as any[]).map(h => String(h || '').trim()).filter(h => h);
        const rows = results.data.slice(1).filter((row: any) => {
          // Filter out completely empty rows
          return Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
        }).map((row: any) => {
          // Ensure each row has the same length as headers
          const processedRow = new Array(headers.length).fill(null);
          for (let i = 0; i < Math.min(row.length, headers.length); i++) {
            const cell = row[i];
            processedRow[i] = (cell !== null && cell !== undefined && String(cell).trim() !== '') ? cell : null;
          }
          return processedRow;
        });
        
        resolve({
          headers,
          rows,
          fileName: file.name,
          fileType: 'csv',
          fileSize: file.size
        });
      } catch (error) {
        reject(new Error(`Error processing CSV data: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    },
    error: (error) => {
      reject(new Error(`Error parsing CSV file: ${error.message}`));
    }
  });
};