import DataTable from "@/components/customUI/datatable/DataTable";
import { TableSkeleton } from "@/components/customUI/datatable/TableSkeleton";
import { SearchBox } from "@/components/customUI/SearchBox";
import { getHeaders } from "@/functions/actions";
import { quoteStatusMap } from "@/functions/commonLists";
import { useQuotesLovQuery } from "@/hooks/queries/policiesQueries";
import { formatCurrency } from "@/lib/utils";
import { getTotalRows } from "@/services/claimsServices";
import { IQuoteLov } from "@/services/policyServices";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SelectQuoteProps {
  handleSelectQuote: (row: any) => void;
}

const ROWS_PER_PAGE = 5;

export const SelectQuote = ({ handleSelectQuote }: SelectQuoteProps) => {
  const { t } = useTranslation();
  const [selectedQuote, setSelectedQuote] = useState<IQuoteLov | null>(null);

  const [quoteSearch, setQuoteSearch] = useState("");
  const [quotePage, setQuotePage] = useState(1);
  const [quoteRowsPerPage, setQuoteRowsPerPage] = useState(ROWS_PER_PAGE);
  const [quoteDataList, setQuoteDataList] = useState([]);
  const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
  const [headers, setHeaders] = useState<
    Array<{
      id: string;
      label: string;
      render?: (row: Record<string, unknown>) => React.ReactNode;
    }>
  >([]);

  const {
    data: quotesData,
    isPending: isQuotesPending,
    isFetched: isQuotesFetched,
  } = useQuotesLovQuery(quoteSearch, quotePage, quoteRowsPerPage);

  const handleQuoteSearch = useCallback((value: string) => {
    setSelectedQuote(null);
    setQuoteSearch(value);
    setQuotePage(1);
  }, []);

  const onSelectButtonPress = useCallback(
    (quote: IQuoteLov) => {
      if (quote) {
        handleSelectQuote(quote);
        setQuoteSearch("");
        setQuotePage(1);
      } else {
        setSelectedQuote(null);
      }
    },
    [handleSelectQuote, quotesData]
  );

  const updateHeaders = useCallback(
    (tbheaders: any[], selectedQuote: IQuoteLov | null) => {
      tbheaders.unshift({
        id: "select",
        label: t("headers:select"),
        render: (row: IQuoteLov) => {
          return (
            <Input
              id={`quote-${row.id}`}
              type="radio"
              className="w-4 h-4"
              name="quote"
              value={row.id}
              onChange={() => {
                // This satisfies React's requirement for controlled components
                if (selectedQuote?.id !== row.id) {
                  const quote = quotesData?.find(
                    (quote) => quote.id === row.id
                  );
                  if (quote) {
                    setSelectedQuote(quote);
                  } else {
                    setSelectedQuote(null);
                  }
                }
              }}
              onClick={() => {
                if (selectedQuote && row.id === selectedQuote.id) {
                  setSelectedQuote(null);
                } else {
                  const quote = quotesData?.find((q) => q.id === row.id);
                  setSelectedQuote(quote);
                }
              }}
              checked={selectedQuote?.id === row.id}
            />
          );
        },
      });

      const updatedHeaders = tbheaders.map((header) => {
        if (header.id === "status") {
          return {
            ...header,
            render: (row: IQuoteLov) => {
              const status = row.status;
              const statusMap = quoteStatusMap(t);
              return (
                <Badge
                  variant="outline"
                  className={statusMap[status]?.class ?? ""}
                >
                  {statusMap[status]?.label ?? status}
                </Badge>
              );
            },
          };
        } else if (header.id === "policy_type") {
          return {
            ...header,
            render: (row: IQuoteLov) => {
              return (
                <label htmlFor={`quote-${row.id}`}>
                  {t(`quoteTypes:${row.policy_type}_insurance`)}
                </label>
              );
            },
          };
        } else if (header.id !== "select") {
          return {
            ...header,
            render: (row: IQuoteLov) => {
              return (
                <label htmlFor={`quote-${row.id}`}>{row[header.id]}</label>
              );
            },
          };
        }

        return header;
      });

      return updatedHeaders;
    },
    [t, onSelectButtonPress]
  );

  const prepareTableDataForList = (dataList: IQuoteLov[]) => {
    const moneyColumns = ["amount"];
    const includedColumns = [
      "id",
      "quote_number",
      "client_name",
      "policy_type",
      "amount",
      "status",
      "total_records",
    ];

    const data = dataList?.map((el) => {
      const clonedData = { ...el };
      for (const column of moneyColumns) {
        const value = clonedData[column];
        if (value) {
          clonedData[column] = formatCurrency(value, {
            withSymbol: true,
          });
        }
      }

      const objKeys = Object.keys(clonedData);
      for (const key of objKeys) {
        if (!includedColumns.includes(key)) {
          delete clonedData[key];
        }
      }

      return clonedData;
    });

    return data;
  };

  useEffect(() => {
    if (isQuotesFetched && quotesData) {
      const dataToDisplay = prepareTableDataForList(quotesData);
      const tempHeaders = getHeaders(dataToDisplay, t);
      setHeaders(updateHeaders(tempHeaders, selectedQuote));
      setTotalRows(getTotalRows(quotesData));
      setQuoteDataList(dataToDisplay);
    }
  }, [isQuotesFetched, quotesData, t, updateHeaders, selectedQuote]);

  return (
    <div className="space-y-4">
      <div className="mb-2 flex gap-2">
        <SearchBox
          className="flex-grow"
          placeholder={t("common:search_quote")}
          searchFunction={handleQuoteSearch}
          value={quoteSearch}
          type="instant"
        />
        <Button
          size="sm"
          onClick={() => onSelectButtonPress(selectedQuote)}
          disabled={selectedQuote === null}
        >
          {t("common:use_selected_quote")}
        </Button>
      </div>
      <div className="overflow-x-auto">
        {isQuotesPending ? (
          <TableSkeleton columns={4} rows={ROWS_PER_PAGE} />
        ) : (
          <DataTable
            id={`quotes-table`}
            headers={headers}
            data={quoteDataList}
            rowsPerPage={ROWS_PER_PAGE}
            totalRows={totalRows}
            showPagination={true}
            currentPage={quotePage}
            onPageChange={setQuotePage}
            showRowsPerPage={false}
            sortable={false}
            stickyHeader={true}
            freezeFirstColumn={false}
            onRowsPerPageChange={setQuoteRowsPerPage}
            withExpandableData={false}
          />
        )}
      </div>
    </div>
  );
};
