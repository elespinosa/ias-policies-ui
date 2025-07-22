import React from 'react';
import { cn } from '@/lib/utils';
import { ExpandedRowProps } from './TableTypes';

const ExpandedRow: React.FC<ExpandedRowProps> = ({
  row,
  rowIndex,
  headers,
  expandedRowRender,
  striped,
  isRowSelected,
  withExpandableData,
  selection
}) => {
  if (!expandedRowRender || !withExpandableData) return null;
  
  return (
    <tr className={cn(
      striped && rowIndex % 2 === 1 ? "bg-muted/50" : "bg-background", 
      isRowSelected ? "bg-primary/10" : ""
    )}>
      <td colSpan={headers.length + (selection || withExpandableData ? 1 : 0)} className="p-0">
        <div className="px-4 py-3 border-b">
          {expandedRowRender(row)}
        </div>
      </td>
    </tr>
  );
};

export default ExpandedRow;
