import React, { useRef } from "react";
import TableBody from "./TableBody";
import { TableProvider } from "./TableContext";
import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";
import { TableProps } from "./TableTypes";

const DataTable: React.FC<TableProps> = ({
  id,
  name,
  headers,
  data = [],
  rowActions = [],
  rowsPerPage = 10,
  showRowsPerPage = false,
  totalRows,
  sortable = true,
  showId = false,
  stickyHeader = false,
  selection = false,
  striped = true,
  disabledRows = [],
  freezeFirstColumn = false,
  withExpandableData = false,
  expandedRowRender,
  onRowSelect,
  onSort,
  onPageChange,
  onRowsPerPageChange,
  onRowAction,
  rowsPerPageOptions,
  currentPage: externalCurrentPage,
  showPagination = true,
  hideIfNull = true,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const effectiveTotalRows = totalRows || data.length;

  return (
    <TableProvider
      headers={headers}
      data={data}
      rowActions={rowActions}
      rowsPerPage={rowsPerPage}
      totalRows={effectiveTotalRows}
      sortable={sortable}
      disabledRows={disabledRows}
      onRowSelect={onRowSelect}
      onSort={onSort}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      externalCurrentPage={externalCurrentPage}
      onRowAction={onRowAction}
      hideIfNull={hideIfNull}
    >
      <div className=" here w-full" data-testid={`table-${id}`}>
        {name && <h2 className="text-xl font-semibold mb-4">{name}</h2>}

        <div
          ref={tableRef}
          className="notsricky relative overflow-auto border rounded-md"
          style={{ maxHeight: stickyHeader ? "40vh" : "auto" }}
        >
          <table className="w-full border-collapse text-sm">
            <TableHeader
              headers={headers}
              sortable={sortable}
              stickyHeader={stickyHeader}
              selection={selection}
              showId={showId}
              freezeFirstColumn={freezeFirstColumn}
              withExpandableData={withExpandableData}
            />

            <TableBody
              headers={headers}
              showId={showId}
              selection={selection}
              striped={striped}
              disabledRows={disabledRows}
              freezeFirstColumn={freezeFirstColumn}
              withExpandableData={withExpandableData}
              expandedRowRender={expandedRowRender}
            />
          </table>
        </div>

        {showPagination && rowsPerPage > 0 && effectiveTotalRows > 0 && (
          <TablePagination
            totalRows={effectiveTotalRows}
            showRowsPerPage={showRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        )}
      </div>
    </TableProvider>
  );
};

export default DataTable;
