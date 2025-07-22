import React from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';
import { useTableContext } from "./TableContext";
import { Icons } from "../Icons";

interface TableActionProps {
  actions: Array<{
    id: string;
    type?: 'icon' | 'button';
    label?: string;
    icon?: string;
    withIcon?: boolean;
    destructive?: boolean;
    action?: string;
  }>;
  row: any;
}

const TableAction: React.FC<TableActionProps> = ({ actions, row }) => {
  const { handleRowAction } = useTableContext();
  
  // Separate icon and button actions from dropdown actions
  const iconActions = actions.filter(action => action?.type === 'icon');
  const buttonActions = actions.filter(action => action?.type === 'button');
  const dropdownActions = actions.filter(action => !action?.type || (action.type !== 'icon' && action.type !== 'button'));

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Render icon actions */}
      {iconActions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleRowAction(action.action || action.id, row.id)}
        >
          {action.withIcon && action.icon ? Icons(action.icon) : Icons(action.id)}
          {action.label && <span className="sr-only">{action.label}</span>}
        </Button>
      ))}

      {/* Render button actions */}
      {buttonActions.map((action, index) => (
        <Button 
          key={index}
          variant="outline" 
          size="sm"
          onClick={() => handleRowAction(action.action || action.id, row.id)}
        >
          {action.withIcon && action.icon ? Icons(action.icon) : Icons(action.id)}
          {action.label && <span className="sr-only">{action.label}</span>}
        </Button>
      ))}

      {/* Render a single dropdown menu for all other actions */}
      {dropdownActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dropdownActions.map((action, index) => (
              <DropdownMenuItem 
                key={index}
                onClick={() => handleRowAction(action.action || action.id, row.id)}
                className={action.destructive ? "text-destructive" : ""}
              >
                {action.withIcon && action.icon ? Icons(action.icon) : Icons(action.id)}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default TableAction;