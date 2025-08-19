import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ColumnMapping,
  DatabaseTable,
  FileData,
  ValidationError,
} from "@/types/import";
import { validateData } from "@/utils/validation";
import { AlertTriangle, CheckCircle, Eye, XCircle } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface DataPreviewProps {
  fileData: FileData;
  selectedTable: DatabaseTable;
  mappings: ColumnMapping[];
  onStartImport: (preparedData: any[]) => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({
  fileData,
  selectedTable,
  mappings,
  onStartImport,
}) => {
  const { t } = useTranslation();

  const [editedData, setEditedData] = React.useState<
    (string | number | null)[][]
  >(fileData.rows);
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationError[]
  >([]);

  // Validate data whenever mappings or edited data changes
  React.useEffect(() => {
    const errors = validateData(editedData, mappings, selectedTable.columns);
    setValidationErrors(errors);
  }, [editedData, mappings, selectedTable.columns]);

  const updateCellValue = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newData = [...editedData];
    newData[rowIndex] = [...newData[rowIndex]];
    newData[rowIndex][colIndex] = value.trim() === "" ? null : value;
    setEditedData(newData);
  };

  const getErrorsForCell = (rowIndex: number, colIndex: number) => {
    const mapping = mappings[colIndex];
    if (!mapping || mapping.skip || !mapping.tableColumn) return [];

    const column = selectedTable.columns.find(
      (col) => col.name === mapping.tableColumn
    );
    if (!column) return [];

    return validationErrors.filter(
      (error) =>
        error.row === rowIndex + 1 && error.column === column.displayName
    );
  };

  const getMappedColumns = () => {
    return mappings.filter((m) => !m.skip && m.tableColumn);
  };

  const getPreviewData = () => {
    const mappedColumns = getMappedColumns();
    return editedData.map((row) => {
      return mappedColumns.map((mapping) => {
        const fileHeaderIndex = mappings.findIndex(
          (m) => m.fileHeader === mapping.fileHeader
        );
        const cellValue = fileHeaderIndex >= 0 ? row[fileHeaderIndex] : null;

        // Use default value if specified and cell is empty
        return (cellValue === null ||
          cellValue === undefined ||
          String(cellValue).trim() === "") &&
          mapping.useDefaultValue
          ? mapping.defaultValue ||
              selectedTable.columns.find(
                (col) => col.name === mapping.tableColumn
              )?.defaultValue
          : cellValue;
      });
    });
  };

  const prepareDataForSubmission = () => {
    const mappedColumns = getMappedColumns();
    const preparedData = editedData.map((row) => {
      const rowData: Record<string, any> = {};

      // First, add all mapped columns
      mappedColumns.forEach((mapping) => {
        const fileHeaderIndex = mappings.findIndex(
          (m) => m.fileHeader === mapping.fileHeader
        );
        const cellValue = fileHeaderIndex >= 0 ? row[fileHeaderIndex] : null;
        const column = selectedTable.columns.find(
          (col) => col.name === mapping.tableColumn
        );

        if (!column) return;

        // Use default value if specified and cell is empty
        let finalValue: string | number | boolean =
          (cellValue === null ||
            cellValue === undefined ||
            String(cellValue).trim() === "") &&
          mapping.useDefaultValue
            ? mapping.defaultValue || column.defaultValue
            : cellValue;

        // Convert data types appropriately
        if (
          finalValue !== null &&
          finalValue !== undefined &&
          String(finalValue).trim() !== ""
        ) {
          const valueStr = String(finalValue).trim();

          switch (column.dataType) {
            case "INT":
              finalValue = parseInt(valueStr, 10);
              break;
            case "DECIMAL":
              finalValue = parseFloat(valueStr);
              break;
            case "BOOLEAN":
              const lowerValue = valueStr.toLowerCase();
              finalValue = ["true", "yes", "1", "y"].includes(lowerValue);
              break;
            case "DATE":
              // Format as YYYY-MM-DD for DATE type
              finalValue = new Date(valueStr).toISOString().split("T")[0];
              break;
            case "DATETIME":
            case "TIMESTAMP":
              console.log({ valueStr, name: column.name });
              finalValue = new Date(valueStr).toISOString();
              break;
            default:
              finalValue = valueStr;
          }
        } else if (column.required) {
          // This should have been caught by validation, but ensure required fields have values
          finalValue = column.defaultValue || null;
        } else {
          finalValue = null;
        }

        // Ensure finalValue is the correct type for the rowData object
        if (finalValue !== null) {
          rowData[column.name] = finalValue as any;
        }
      });

      // Then, add all required columns that are not mapped (with default values)
      selectedTable.columns.forEach((column) => {
        if (column.required && !rowData.hasOwnProperty(column.name)) {
          // Use default value for unmapped required fields
          let defaultValue = column.defaultValue;

          // Handle special default values
          if (column.name === "status" && !defaultValue) {
            defaultValue = "active";
          } else if (column.name === "created_at" && !defaultValue) {
            defaultValue = new Date().toISOString();
          } else if (column.name === "updated_at" && !defaultValue) {
            defaultValue = new Date().toISOString();
          } else if (column.name === "email" && !defaultValue) {
            // Generate a placeholder email based on first_name and last_name if available
            const firstName = rowData.first_name || "user";
            const lastName = rowData.last_name || "unknown";
            defaultValue = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
          } else if (column.name === "mobile_phone" && !defaultValue) {
            defaultValue = "+1234567890";
          } else if (column.name === "risk_profile" && !defaultValue) {
            defaultValue = "low";
          }

          rowData[column.name] = defaultValue || null;
        }
      });

      return rowData;
    });

    return preparedData;
  };

  const handleStartImport = () => {
    const preparedData = prepareDataForSubmission();
    console.log("Prepared data for submission:", preparedData);
    onStartImport(preparedData);
  };

  const previewData = getPreviewData();
  const mappedColumns = getMappedColumns();
  const totalErrors = validationErrors.length;
  const errorRows = new Set(validationErrors.map((e) => e.row));
  const canImport = totalErrors === 0 && mappedColumns.length > 0;

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          {t("uploading:data_preview_validation")}
        </CardTitle>
        <CardDescription>
          {t("uploading:data_preview_validation_description")}
        </CardDescription>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline">
            {t("uploading:n_rows_to_import", {
              rows: previewData.length,
            })}
          </Badge>
          <Badge variant="outline">
            {t("uploading:n_columns_mapped", {
              columns: mappedColumns.length,
            })}
          </Badge>
          <Badge variant={totalErrors === 0 ? "default" : "destructive"}>
            {t("uploading:n_validation_errors", {
              errors: totalErrors,
            })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalErrors > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  {t("uploading:validation_error_found_message", {
                    totalErrors: totalErrors,
                    totalRows: errorRows.size,
                  })}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {validationErrors.slice(0, 5).map((error, index) => (
                    <div key={index} className="bg-destructive/10 p-2 rounded">
                      Row {error.row}, {error.column}: {error.error}
                    </div>
                  ))}
                  {validationErrors.length > 5 && (
                    <p className="text-muted-foreground col-span-full">
                      {t("uploading:and_n_more_errors", {
                        rows: validationErrors.length - 5,
                      })}
                    </p>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {mappedColumns.length === 0 && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {t("uploading:no_columns_mapped_message")}
            </AlertDescription>
          </Alert>
        )}

        {mappedColumns.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {t("uploading:preview_data", { rows: 10 })}
              </h4>
              {/* <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Preview
              </Button> */}
            </div>

            <div className="overflow-x-auto border rounded-lg max-w-full">
              <table className="w-full text-sm min-w-max">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="p-2 text-left font-medium w-12">#</th>
                    {mappedColumns.map((mapping, index) => {
                      const column = selectedTable.columns.find(
                        (col) => col.name === mapping.tableColumn
                      );
                      return (
                        <th key={index} className="p-2 text-left border-l">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {column?.displayName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {column?.dataType}
                              </Badge>
                              {column?.required && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {t("uploading:required")}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("uploading:from_column", {
                                column: mapping.fileHeader,
                              })}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((row, rowIndex) => {
                    const hasRowErrors = validationErrors.some(
                      (e) => e.row === rowIndex + 1
                    );

                    return (
                      <tr
                        key={rowIndex}
                        className={`border-b ${
                          hasRowErrors
                            ? "bg-destructive/5"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            {hasRowErrors ? (
                              <XCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                            <span className="ml-1">{rowIndex + 1}</span>
                          </div>
                        </td>
                        {row.map((cell, cellIndex) => {
                          const originalFileHeaderIndex = mappings.findIndex(
                            (m) =>
                              m.fileHeader ===
                              mappedColumns[cellIndex].fileHeader
                          );
                          const cellErrors = getErrorsForCell(
                            rowIndex,
                            originalFileHeaderIndex
                          );
                          const hasErrors = cellErrors.length > 0;

                          return (
                            <td key={cellIndex} className="p-1 border-l">
                              <div className="relative">
                                <Input
                                  value={cell?.toString() || ""}
                                  onChange={(e) =>
                                    updateCellValue(
                                      rowIndex,
                                      originalFileHeaderIndex,
                                      e.target.value
                                    )
                                  }
                                  className={`text-xs h-8 ${
                                    hasErrors
                                      ? "border-destructive focus:border-destructive"
                                      : "border-transparent focus:border-primary"
                                  }`}
                                  placeholder="—"
                                />
                                {hasErrors && (
                                  <div className="absolute -top-1 -right-1">
                                    <AlertTriangle className="h-3 w-3 text-destructive" />
                                  </div>
                                )}
                              </div>
                              {hasErrors && (
                                <div className="mt-1 space-y-1">
                                  {cellErrors.map((error, errorIndex) => (
                                    <p
                                      key={errorIndex}
                                      className="text-xs text-destructive"
                                    >
                                      {error.error}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {previewData.length > 10 && (
              <p className="text-xs text-muted-foreground">
                {t("uploading:and_n_more_rows_will_be_imported", {
                  rows: previewData.length - 10,
                })}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {t("uploading:ready_to_import")}
            </p>
            <p className="text-xs text-muted-foreground">
              {canImport
                ? t("uploading:n_rows_will_be_imported", {
                    rows: previewData.length,
                    tableName: selectedTable.displayName,
                  })
                : t("uploading:fix_validation_error_to_proceed")}
            </p>
          </div>
          <Button
            onClick={handleStartImport}
            disabled={!canImport}
            variant="default"
            className="gap-2"
          >
            {canImport ? (
              <>
                <CheckCircle className="h-4 w-4" />
                {t("uploading:start_import")}
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                {t("uploading:fix_error_first")}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
