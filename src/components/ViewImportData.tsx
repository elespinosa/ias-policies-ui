import DataTable from "@/components/customUI/datatable/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getHeaders } from "@/functions/actions";
import { getTotalRows } from "@/services/claimsServices";
import { ImportResult } from "@/types/import";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LOVProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  importResult: ImportResult;
  dataType: "success" | "failed";
}

const ROWS_PER_PAGE = 10;
export const ViewImportData = ({
  className = "",
  importResult,
  isOpen,
  dataType,
  onClose,
}: LOVProps) => {
  const { t } = useTranslation();
  const [lovPage, setLOVPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [dataList, setDataList] = useState([]);
  const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
  const [headers, setHeaders] = useState<
    Array<{
      id: string;
      label: string;
      render?: (row: Record<string, unknown>) => React.ReactNode;
    }>
  >([]);

  useEffect(() => {
    const dataList =
      dataType === "success"
        ? importResult.importedRows
        : importResult.failedRowsData;

    const dataLength = dataList.length;
    const totalPages = Math.ceil(dataLength / rowsPerPage);

    if (totalPages >= lovPage) {
      const firstIndex = rowsPerPage * (lovPage - 1);
      let lastIndex = firstIndex + rowsPerPage;
      if (lastIndex > dataLength) {
        lastIndex = dataLength;
      }

      const dataToDisplay = dataList.slice(firstIndex, lastIndex);
      const tempHeaders = getHeaders(dataToDisplay, t);
      setHeaders(tempHeaders);
      setTotalRows(getTotalRows(dataList));
      setDataList(dataToDisplay);
    }
  }, [rowsPerPage, lovPage, importResult, dataType]);

  return (
    <div className={`space-y-2 ${className}`}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dataType === "success"
                ? t("uploading:imported_data")
                : t("uploading:unimported_data")}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {dataType === "success"
              ? t("uploading:view_imported_data_description")
              : t("uploading:view_unimported_data_description")}
          </DialogDescription>

          <div className="overflow-x-auto">
            <DataTable
              id={`import-data-table`}
              headers={headers}
              data={dataList}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              showPagination={true}
              currentPage={lovPage}
              onPageChange={setLOVPage}
              showRowsPerPage={false}
              sortable={false}
              stickyHeader={true}
              freezeFirstColumn={false}
              onRowsPerPageChange={setRowsPerPage}
              withExpandableData={false}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {t("common:close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
