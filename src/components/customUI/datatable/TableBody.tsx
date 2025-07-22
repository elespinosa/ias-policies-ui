import React from 'react';
import TableRow from './TableRow';
import ExpandedRow from './ExpandedRow';
import { useTableContext } from './TableContext';
import { useTranslation } from 'react-i18next';
interface TableBodyProps {
  headers: any[];
  showId?: boolean;
  selection: boolean;
  striped: boolean;
  disabledRows: string[];
  freezeFirstColumn: boolean;
  withExpandableData: boolean;
  expandedRowRender?: (row: any) => React.ReactNode;
  hideIfNull?: boolean;
}

const TableBody: React.FC<TableBodyProps> = ({
  headers,
  showId,
  selection,
  striped,
  disabledRows,
  freezeFirstColumn,
  withExpandableData,
  expandedRowRender,
  hideIfNull = true,
}) => {
  const { 
    displayData, 
    selectedRows, 
    expandedRows,
    rowActions,
    // handleRowSelect,
    // handleRowExpand
  } = useTableContext();
  const { t } = useTranslation();
  if (displayData.length === 0) {
    return (
      <tbody>
        <tr>
          <td 
            colSpan={headers.length + ((selection || withExpandableData) ? 1 : 0)}
            className="p-8 text-center text-muted-foreground"
          >
            {t('table:no_data_available')}
          </td>
        </tr>
      </tbody>
    );
  }
  
  return (
    <tbody>
      {displayData.map((row, rowIndex) => {        
        const rowId = String(row.id ? row.id : row.rowno);
        const isRowDisabled = disabledRows.includes(rowId);
        const isRowSelected = selectedRows.includes(rowId);
        const isRowExpanded = expandedRows.includes(rowId);
        
        return (
          <React.Fragment key={rowId}>
            <TableRow
              row={row}
              rowIndex={rowIndex}
              rowActions={rowActions || []}
              headers={headers}
              selection={selection}
              striped={striped}
              showId={showId}
              isRowDisabled={isRowDisabled}
              isRowSelected={isRowSelected}
              freezeFirstColumn={freezeFirstColumn}
              withExpandableData={withExpandableData}
              isRowExpanded={isRowExpanded}
              hideIfNull={hideIfNull}
            />
            
            {isRowExpanded && expandedRowRender && (
              <ExpandedRow 
                row={row}
                rowIndex={rowIndex}
                headers={headers}
                expandedRowRender={expandedRowRender}
                striped={striped}
                isRowSelected={isRowSelected}
                withExpandableData={withExpandableData}
                selection={selection}
              />
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
};

export default TableBody;