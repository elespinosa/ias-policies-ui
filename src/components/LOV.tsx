import DataTable from "@/components/customUI/datatable/DataTable";
import { TableSkeleton } from "@/components/customUI/datatable/TableSkeleton";
import { SearchBox } from "@/components/customUI/SearchBox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getHeaders } from "@/functions/actions";
import { createValidations } from "@/lib/validations";
import { getTotalRows } from "@/services/claimsServices";
import { UseQueryResult } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface LOVProps {
  className?: string;
  lovId: string;
  lovLabel: string;
  lovPlaceholder: string;
  lovDialogTitle: string;
  lovDialogDescription: string;
  lovDialogSearchPlaceholder: string;
  lovRequired: boolean;
  lovDisabled: boolean;
  form: UseFormReturn<any>;
  rowsPerPage: number;
  renderFnMap: any[];
  useLOVQuery: (
    search: string,
    page: number,
    rowsPerPage: number
  ) => UseQueryResult<any, Error>;
  mapLOVData?: (data: any) => any;
  handleSelectLOV: (row: any) => void;
}

export const LOV = ({
  className = "",
  lovId,
  lovLabel,
  lovPlaceholder,
  lovDialogTitle,
  lovDialogDescription,
  lovDialogSearchPlaceholder,
  lovRequired,
  lovDisabled,
  form,
  rowsPerPage,
  renderFnMap,
  useLOVQuery,
  mapLOVData,
  handleSelectLOV,
}: LOVProps) => {
  const { t } = useTranslation();
  const validations = createValidations(t);
  const [lovModalOpen, setLovModalOpen] = useState(false);
  const [lovSearch, setLOVSearch] = useState("");
  const [lovPage, setLOVPage] = useState(1);
  const [lovRowsPerPage, setLOVRowsPerPage] = useState(rowsPerPage);
  const [lovDataList, setLOVDataList] = useState([]);
  const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
  const [headers, setHeaders] = useState<
    Array<{
      id: string;
      label: string;
      render?: (row: Record<string, unknown>) => React.ReactNode;
    }>
  >([]);

  const {
    data: lovData,
    isPending: isLOVPending,
    isFetched: isLOVFetched,
  } = useLOVQuery(lovSearch, lovPage, lovRowsPerPage);

  const handleLOVSearch = useCallback((value: string) => {
    setLOVSearch(value);
    setLOVPage(1);
  }, []);

  const handleLOVSelect = useCallback(
    (row) => {
      handleSelectLOV(row);
      setLovModalOpen(false);
      setLOVSearch("");
      setLOVPage(1);
    },
    [handleSelectLOV]
  );

  const updateHeaders = useCallback(
    (tbheaders: any[]) => {
      for (const header of renderFnMap) {
        const index = tbheaders.findIndex((el) => el.id === header.id);
        if (index != -1) {
          const col = tbheaders[index];
          tbheaders[index] = {
            ...col,
            render: header.render,
          };
        }
      }

      tbheaders.push({
        id: "actions",
        label: t("common:actions"),
        render: (row) => {
          return (
            <Button
              size="sm"
              variant="default"
              onClick={() => handleLOVSelect(row)}
            >
              {t("common:select")}
            </Button>
          );
        },
      });

      return tbheaders;
    },
    [t, handleLOVSelect]
  );

  useEffect(() => {
    if (isLOVFetched && lovData) {
      const uLOVData = mapLOVData
        ? lovData.map((data) => mapLOVData(data))
        : lovData;

      const tempHeaders = getHeaders(uLOVData, t);
      setHeaders(updateHeaders(tempHeaders));
      setTotalRows(getTotalRows(lovData));
      setLOVDataList(lovData);
    }
  }, [isLOVFetched, lovData, t, mapLOVData, updateHeaders]);

  return (
    <div className={`space-y-2 ${className}`}>
      <FormField
        control={form.control}
        name={lovId}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {lovLabel}
              {/* {lovRequired ? " *" : ""} */}
            </FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input placeholder={lovPlaceholder} readOnly {...field} />
                <Button
                  disabled={lovDisabled}
                  type="button"
                  variant="outline"
                  onClick={() => setLovModalOpen(true)}
                  size="icon"
                  aria-label={lovDialogTitle}
                >
                  <SearchIcon className="w-4 h-4" />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Policy Search Modal */}
      <Dialog open={lovModalOpen} onOpenChange={setLovModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{lovDialogTitle}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{lovDialogDescription}</DialogDescription>
          <div className="mb-2">
            <SearchBox
              placeholder={lovDialogSearchPlaceholder}
              searchFunction={handleLOVSearch}
              value={lovSearch}
              type="instant"
            />
          </div>
          <div className="overflow-x-auto">
            {isLOVPending ? (
              <TableSkeleton columns={4} rows={rowsPerPage} />
            ) : (
              <DataTable
                id={`${lovId}-table`}
                headers={headers}
                data={lovDataList}
                rowsPerPage={rowsPerPage}
                totalRows={totalRows}
                showPagination={true}
                currentPage={lovPage}
                onPageChange={setLOVPage}
                showRowsPerPage={false}
                sortable={false}
                stickyHeader={true}
                freezeFirstColumn={false}
                onRowsPerPageChange={setLOVRowsPerPage}
                withExpandableData={false}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLovModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
