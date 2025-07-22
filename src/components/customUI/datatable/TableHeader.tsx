import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableHeaderProps } from './TableTypes';
import { useTableContext } from './TableContext';
import { useTranslation } from 'react-i18next';

const TableHeader: React.FC<Omit<TableHeaderProps, 'handleSort' | 'handleSelectAll' | 'areAllRowsSelected' | 'sortConfig'>> = ({
  headers,
  sortable,
  stickyHeader,
  selection,
  showId,
  freezeFirstColumn,
  withExpandableData,
}) => {
  const { sortConfig, handleSort, handleSelectAll, areAllRowsSelected, rowActions } = useTableContext();
  const { t } = useTranslation();
  return (
    <thead className={cn(
      "bg-muted",
      stickyHeader && "sticky top-0 z-10"
    )}>
      <tr>
        {(selection || withExpandableData) && (
          <th className={cn(
            "p-3 border-b font-medium text-left align-middle",
            freezeFirstColumn && "sticky left-0 z-20 bg-muted"
          )}>
            {selection && (
              <Checkbox 
                checked={areAllRowsSelected()} 
                onCheckedChange={handleSelectAll}
                aria-label="Select all rows"
              />
            )}
          </th>
        )}
        
        {headers.map((header, index) => {
          const isFirstCol = index === 0;
          const isSortable = header.sortable !== undefined ? header.sortable : sortable;
          if(!showId && (header.id.toLowerCase() === 'id' || header.id.toLowerCase() === 'rowno')) {
            return null;
          }
          return (
            <th 
              key={header.id}
              className={cn(
                "p-3 border-b font-medium text-left align-middle text-muted-foreground",
                isSortable && "cursor-pointer select-none",
                freezeFirstColumn && isFirstCol && !withExpandableData && !selection && "sticky left-0 z-20 bg-muted",
                header.width && `w-[${header.width}]`
              )}
              onClick={() => isSortable && handleSort(header.id)}
              style={{ minWidth: header.width || 'auto' }}
            >
              <div className="flex items-left justify-left gap-1">
                {header.label}
                
                {isSortable && sortConfig && sortConfig.key === header.id && (
                  sortConfig.direction === 'asc' 
                    ? <ArrowUp className="h-4 w-4" /> 
                    : <ArrowDown className="h-4 w-4" />
                )}
              </div>
            </th>
          );
        })}
        
        {/* Add Actions header if rowActions exist */}
        {rowActions && rowActions.length > 0 && (
          <th className="p-3 border-b font-medium text-center align-middle text-muted-foreground">
            {t('table:actions')}
          </th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;