import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTableContext } from './TableContext';

interface TablePaginationProps {
  totalRows: number;
  showRowsPerPage?: boolean;
  rowsPerPageOptions?: number[];
}

const TablePagination: React.FC<TablePaginationProps> = ({
  totalRows,
  showRowsPerPage = false,
  rowsPerPageOptions = [10, 20, 30, 50, 100]
}) => {
  const { t } = useTranslation();
  const { 
    currentPage, 
    localRowsPerPage, 
    handlePageChange, 
    handleRowsPerPageChange 
  } = useTableContext();

  const totalPages = Math.ceil(totalRows / localRowsPerPage);
  
  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page if more than one page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  const startRange = ((currentPage - 1) * localRowsPerPage) + 1;
  const endRange = Math.min(currentPage * localRowsPerPage, totalRows);
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {t('common:showing', { start: startRange, end: endRange, total: totalRows })}
        </div>
        
        {showRowsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('common:rows_per_page')}</span>
            <Select
              value={String(localRowsPerPage)}
              onValueChange={(value) => handleRowsPerPageChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={localRowsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {rowsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === 'number' ? (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-8",
                    currentPage === page ? "bg-primary text-primary-foreground" : ""
                  )}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ) : (
                <span className="px-2">...</span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;