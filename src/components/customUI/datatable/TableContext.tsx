import React, { createContext, useContext, useState, useEffect } from 'react';
import { TableColumn, SortConfig } from './TableTypes';

interface TableContextProps {
  // State
  sortConfig: SortConfig | null;
  currentPage: number;
  selectedRows: string[];
  expandedRows: string[];
  localRowsPerPage: number;
  displayData: any[];
  
  // Functions
  handleSort: (columnId: string) => void;
  handlePageChange: (page: number) => void;
  handleRowsPerPageChange: (rowsPerPage: number) => void;
  handleRowSelect: (rowId: string, row: any) => void;
  handleRowExpand: (event: React.MouseEvent, rowId: string) => void;
  handleSelectAll: () => boolean;
  rowActions?: ((row: any) => React.ReactNode)[];
  handleRowAction: (action: string, rowId: string) => { action: string, id: string };
  hideIfNull: boolean;
  areAllRowsSelected: () => boolean;
}

interface TableProviderProps {
  children: React.ReactNode;
  headers: TableColumn[];
  data: any[];
  rowsPerPage: number;
  totalRows?: number;
  sortable: boolean;
  disabledRows: string[];
  onRowSelect?: (selectedRows: { rowIds: string[], rows: any[] }) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  externalCurrentPage?: number;
  rowActions?: ((row: any) => React.ReactNode)[];
  onRowAction?: (action: string, rowId: string) => void;
  hideIfNull: boolean;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};

export const TableProvider: React.FC<TableProviderProps> = ({
  children,
  headers,
  data,
  rowsPerPage,
  // totalRows,
  sortable,
  disabledRows,
  onRowSelect,
  onSort,
  onPageChange,
  onRowsPerPageChange,
  externalCurrentPage,
  rowActions,
  onRowAction,
  hideIfNull,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(externalCurrentPage || 1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [localRowsPerPage, setLocalRowsPerPage] = useState<number>(rowsPerPage);
  const isServerSidePagination = !!onPageChange;

  // const effectiveTotalRows = totalRows || data.length;

  // Update currentPage when externalCurrentPage changes
  useEffect(() => {
    if (externalCurrentPage && externalCurrentPage !== currentPage) {
      setCurrentPage(externalCurrentPage);
    }
  }, [externalCurrentPage]);

  // Process data for display (sorting and pagination)
  useEffect(() => {
    let processedData = [...data];
    
    // Handle sorting
    if (sortConfig && !onSort) {
      const columnToSort = headers.find(header => header.id === sortConfig.key);
      
      processedData.sort((a, b) => {
        const aValue = a[columnToSort?.accessor || sortConfig.key];
        const bValue = b[columnToSort?.accessor || sortConfig.key];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortConfig.direction === 'asc'
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1);
      });
    }
    
    // Handle client-side pagination when onPageChange is not provided
    if (!isServerSidePagination) {
      const start = (currentPage - 1) * localRowsPerPage;
      processedData = processedData.slice(start, start + localRowsPerPage);
    }
    
    setDisplayData(processedData);
  }, [data, sortConfig, currentPage, localRowsPerPage, headers, isServerSidePagination, onSort]);
  
  // Reset to first page when data changes, but only for client-side pagination
  useEffect(() => {
    // Only reset the page when we're not using server-side pagination
    if (!isServerSidePagination) {
      setCurrentPage(1);
    }
  }, [data, isServerSidePagination]);
  
  // Update localRowsPerPage when prop changes
  useEffect(() => {
    setLocalRowsPerPage(rowsPerPage);
  }, [rowsPerPage]);

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!sortable) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === columnId) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    const newSortConfig = { key: columnId, direction };
    setSortConfig(newSortConfig);
    
    if (onSort) {
      onSort(columnId, direction);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setLocalRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };
  
  // Handle row selection
  const handleRowSelect = (rowId: string) => {
    if (disabledRows.includes(rowId)) return;
    
    let newSelectedRows;
    
    if (selectedRows.includes(rowId)) {
      newSelectedRows = selectedRows.filter(id => id !== rowId);
    } else {
      newSelectedRows = [...selectedRows, rowId];
    }
    setSelectedRows(newSelectedRows);
    
    if (onRowSelect) {
      const selectedRowsData = data.filter(row => 
        newSelectedRows.includes(String(row.id))
      );
      onRowSelect({ rowIds: newSelectedRows, rows: selectedRowsData });
    }
  };
  
  // Handle row expansion toggle
  const handleRowExpand = (event: React.MouseEvent, rowId: string) => {
    event.stopPropagation();
    
    let newExpandedRows;
    
    if (expandedRows.includes(rowId)) {
      newExpandedRows = expandedRows.filter(id => id !== rowId);
    } else {
      newExpandedRows = [...expandedRows, rowId];
    }
    
    setExpandedRows(newExpandedRows);
  };
  
  // Handle all rows selection
  const handleSelectAll = (): boolean => {
    if (selectedRows.length === displayData.length) {
      setSelectedRows([]);
      
      if (onRowSelect) {
        onRowSelect({ rowIds: [], rows: [] });
      }
      return false;
    } else {
      const availableRowIds = displayData
        .filter(row => !disabledRows.includes(String(row.id)))
        .map(row => String(row.id));
      
      setSelectedRows(availableRowIds);
      
      if (onRowSelect) {
        const selectedRowsData = displayData.filter(row => 
          availableRowIds.includes(String(row.id))
        );
        onRowSelect({ rowIds: availableRowIds, rows: selectedRowsData });
      }
      return true;
    }
  };
  
  // Check if all rows are selected
  const areAllRowsSelected = () => {
    const selectableRowCount = displayData.filter(
      row => !disabledRows.includes(String(row.id))
    ).length;
    
    return selectedRows.length === selectableRowCount && selectableRowCount > 0;
  };

  // Handle row action
  const handleRowAction = (action: string, rowId: string) => {
    if (onRowAction) {
      onRowAction(action, rowId);
    }
    return { action, id: rowId };
  };

  const value = {
    sortConfig,
    currentPage,
    selectedRows,
    expandedRows,
    localRowsPerPage,
    displayData,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    handleRowSelect,
    handleRowExpand,
    handleSelectAll,
    areAllRowsSelected,
    rowActions,
    handleRowAction,
    hideIfNull,
  };

  return (
    <TableContext.Provider
      value={value}
    >
      {children}
    </TableContext.Provider>
  );
};