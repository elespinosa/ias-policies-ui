import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTableContext } from './TableContext';
import TableAction from './TableAction';

interface TableRowProps {
  row: any;
  rowActions: any[];
  rowIndex: number;
  headers: any[];
  selection: boolean;
  striped: boolean;
  showId?: boolean;
  isRowDisabled: boolean;
  isRowSelected: boolean;
  freezeFirstColumn: boolean;
  withExpandableData: boolean;
  isRowExpanded: boolean;
  hideIfNull: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  rowIndex,
  rowActions,
  headers,
  selection,
  striped,
  showId,
  isRowDisabled,
  isRowSelected,
  freezeFirstColumn,
  withExpandableData,
  isRowExpanded,
  hideIfNull
}) => {
  const { handleRowSelect, handleRowExpand } = useTableContext();
  
  const rowId = String(row.id);

  const getAlignment = (val: any) => {
    if (!val || !val.align) return "";
    
    switch (val.align) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "";
    }
  }

  return (
    <tr 
      className={cn(
        striped && rowIndex % 2 === 1 ? "bg-muted/50" : "",
        isRowSelected ? "bg-primary/20 hover:bg-primary/30" : "hover:bg-muted/30",
        isRowDisabled ? "opacity-50 bg-muted/30" : "",
        "transition-colors cursor-pointer"
      )}
      onClick={() => selection && !isRowDisabled && handleRowSelect(rowId, row)}
    >
      {(selection || withExpandableData) && (
        <td className={cn(
          "p-3 border-b align-middle",
          freezeFirstColumn && "sticky left-0 z-10",
          striped && rowIndex % 2 === 1 && !isRowSelected ? "bg-muted/50" : "bg-background",
          isRowSelected ? "bg-primary/20" : ""
        )}>
          <div className="flex items-center gap-2">
            {selection && (
              <Checkbox 
                checked={isRowSelected}
                disabled={isRowDisabled}
                onCheckedChange={() => handleRowSelect(rowId, row)}
                aria-label={`Select row ${rowId}`}
              />
            )}
            {withExpandableData && (
              <button 
                className="p-1 rounded-full hover:bg-muted-foreground/20 focus:outline-none"
                onClick={(e) => handleRowExpand(e, rowId)}
                aria-label={isRowExpanded ? "Collapse row" : "Expand row"}
              >
                {isRowExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </td>
      )}
      
      {headers.map((header, colIndex) => {
        const isFirstCol = colIndex === 0;
        let cellContent;
        
        if (header.render) {
          cellContent = header.render(row);
        } else if (header.accessor) {
          const keys = typeof header.accessor === 'string' ? header.accessor.split('.') : [];
          let value = row;
          
          for (const key of keys) {
            value = value?.[key];
            if (value === undefined) break;
          }
          
          cellContent = value !== undefined && value !== null ? String(value) : hideIfNull ? '' : value;
        } else {
          cellContent = row[header.id] !== undefined ? String(row[header.id]) : '';
        }

        if(!showId && (header.id.toLowerCase() === 'id' || header.id.toLowerCase() === 'rowno')) {
          return null;
        }
        // console.log(header.id, getAlignment(header));
        return (
          <td 
            key={`${rowId}-${header.id}`}
            className={cn(
              "p-3 border-b",
              getAlignment(header),
              freezeFirstColumn && isFirstCol && !withExpandableData && !selection && "sticky left-0 z-10",
              freezeFirstColumn && isFirstCol && !withExpandableData && !selection && striped && rowIndex % 2 === 1 && !isRowSelected
                ? "bg-muted/50" 
                : freezeFirstColumn && isFirstCol && !withExpandableData && !selection && !isRowSelected ? "bg-background" : "",
              freezeFirstColumn && isFirstCol && !withExpandableData && !selection && isRowSelected ? "bg-primary/20" : ""
            )}
          >
            <div className={cn(
              "whitespace-pre-wrap break-words hyphens-auto overflow-hidden text-ellipsis min-w-[100px] max-w-[300px]",
              header.id.toLowerCase() === 'status' ? "w-fit whitespace-nowrap" : "",
              header.id.toLowerCase().includes('date') ? "min-w-[120px] whitespace-nowrap" : ""
            )}>
              {cellContent}
            </div> 
          </td>
        );
      })}
      {rowActions && rowActions.length > 0 && (
        <td className="px-4 py-3">
          <TableAction actions={rowActions} row={row} />
        </td>
      )}
    </tr>
  );
};export default TableRow;

