export interface TableColumn {
  id: string;
  label: string;
  accessor?: string;
  render?: (row: any) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

export interface TableProps {
  id: string;
  name?: string;
  headers: TableColumn[];
  data: any[];
  rowActions?: any[];
  rowsPerPage?: number;
  showRowsPerPage?: boolean,
  totalRows?: number;
  sortable?: boolean;
  showId?: boolean;
  stickyHeader?: boolean;
  selection?: boolean;
  striped?: boolean;
  disabledRows?: string[];
  freezeFirstColumn?: boolean;
  withExpandableData?: boolean;
  expandedRowRender?: (row: any) => React.ReactNode;
  onRowSelect?: (selectedRows: { rowIds: string[], rows: any[] }) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onRowAction?: (action: string, rowId: string) => void;
  rowsPerPageOptions?: number[];
  currentPage?: number;
  showPagination?: boolean;
  hideIfNull?: boolean;
}

export interface TablePaginationProps {
  currentPage: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableHeaderProps {
  headers: TableColumn[];
  sortable: boolean;
  sortConfig: SortConfig | null;
  stickyHeader: boolean;
  selection: boolean;
  showId?: boolean;
  freezeFirstColumn: boolean;
  withExpandableData: boolean;
  handleSort: (columnId: string) => void;
  handleSelectAll: () => void;
  areAllRowsSelected: () => boolean;
}

export interface TableBodyProps {
  headers: TableColumn[];
  displayData: any[];
  selection: boolean;
  striped: boolean;
  showId?: boolean;
  disabledRows: string[];
  freezeFirstColumn: boolean;
  withExpandableData: boolean;
  expandedRowRender?: (row: any) => React.ReactNode;
  selectedRows: string[];
  expandedRows: string[];
  handleRowSelect: (rowId: string, row: any) => void;
  handleRowExpand: (event: React.MouseEvent, rowId: string) => void;
}

export interface TableRowProps {
  row: any;
  rowIndex: number;
  headers: TableColumn[];
  selection: boolean;
  striped: boolean;
  showId?: boolean;
  isRowDisabled: boolean;
  isRowSelected: boolean;
  freezeFirstColumn: boolean;
  withExpandableData: boolean;
  handleRowSelect: (rowId: string, row: any) => void;
  handleRowExpand: (event: React.MouseEvent, rowId: string) => void;
  isRowExpanded: boolean;
}

export interface ExpandedRowProps {
  row: any;
  rowIndex: number;
  headers: TableColumn[];
  expandedRowRender: (row: any) => React.ReactNode;
  striped: boolean;
  isRowSelected: boolean;
  withExpandableData: boolean;
  selection: boolean;
}
