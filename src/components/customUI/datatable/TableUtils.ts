import { SortConfig } from './TableTypes';

// Sort data based on sort configuration
export const sortData = (data: any[], sortConfig: SortConfig, accessor?: string | ((row: any) => any)) => {
  if (!sortConfig) return data;

  return [...data].sort((a, b) => {
    // Get values to compare using accessor
    let aValue, bValue;

    if (typeof accessor === 'function') {
      aValue = accessor(a);
      bValue = accessor(b);
    } else if (accessor) {
      aValue = a[accessor];
      bValue = b[accessor];
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    // Handle undefined and null values
    if (aValue === undefined || aValue === null) return sortConfig.direction === 'asc' ? -1 : 1;
    if (bValue === undefined || bValue === null) return sortConfig.direction === 'asc' ? 1 : -1;

    // Compare based on data type
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
  });
};

// Paginate data
export const paginateData = (data: any[], page: number, rowsPerPage: number) => {
  if (rowsPerPage <= 0) return data;
  
  const startIndex = (page - 1) * rowsPerPage;
  return data.slice(startIndex, startIndex + rowsPerPage);
};

export const getUniqueId = () => {
  return Math.random().toString(36).substring(2, 9);
};