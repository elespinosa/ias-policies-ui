import { ColumnMapping } from "@/components/ColumnMapping";
import { DataPreview } from "@/components/DataPreview";
import { FileUpload } from "@/components/FileUpload";
import { ImportResults } from "@/components/ImportResults";
import { Button } from "@/components/ui/button";
import { mockDatabaseTables } from "@/data/mockDatabase";
import { useToast } from "@/hooks/use-toast";
import {
  ColumnMapping as ColumnMappingType,
  DatabaseTable,
  FileData,
  ImportResult,
} from "@/types/import";
import { autoMapColumns } from "@/utils/columnMatcher";
import type { MappingTemplate } from "@/utils/localStorage";
import { saveAuditLog } from "@/utils/localStorage";
import { Database, Upload } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const DataImport: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = React.useState(1);
  const [fileData, setFileData] = React.useState<FileData | null>(null);
  const [selectedTable, setSelectedTable] =
    React.useState<DatabaseTable | null>(null);
  const [mappings, setMappings] = React.useState<ColumnMappingType[]>([]);
  const [importResult, setImportResult] = React.useState<ImportResult | null>(
    null
  );
  const [isImporting, setIsImporting] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<MappingTemplate | null>(null);

  useEffect(() => {
    setSelectedTable(mockDatabaseTables.find((e) => e.name === "policies"));
  }, []);

  const handleFileLoaded = (data: FileData) => {
    setFileData(data);

    // Initialize mappings with automatic mapping
    if (data) {
      const autoMappings = autoMapColumns(data.headers, selectedTable.columns);
      setMappings(autoMappings);
    }

    setCurrentStep(2);
  };

  const handleMappingsChange = (newMappings: ColumnMappingType[]) => {
    setMappings(newMappings);

    // Check if we have valid mappings to proceed
    const hasValidMappings = newMappings.some((m) => !m.skip && m.tableColumn);
    const requiredColumns =
      selectedTable?.columns.filter((col) => col.required) || [];
    const mappedRequiredColumns = requiredColumns.filter((col) =>
      newMappings.some((m) => !m.skip && m.tableColumn === col.name)
    );
  };

  const handleStartImport = async (preparedData: any[]) => {
    if (!fileData || !selectedTable || !mappings) return;

    setCurrentStep(4);
    setIsImporting(true);
    const startTime = Date.now();

    try {
      // Try to call the local API endpoint to create client
      let apiResult = null;
      let useFallback = false;

      let importResult: ImportResult;

      try {
        // Send each row individually to the API
        const results = [];
        const apiErrors = [];

        for (let i = 0; i < preparedData.length; i++) {
          const rowData = preparedData[i];

          // Get the URL endpoint from the selected table configuration
          if (!selectedTable.urlEndpoint) {
            apiErrors.push({
              row: i + 1,
              error: {
                message: `No API endpoint configured for table: ${selectedTable.name}`,
              },
            });
            continue;
          }

          const apiResponse = await fetch(selectedTable.urlEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(rowData),
          });

          if (apiResponse.ok) {
            const result = await apiResponse.json();
            results.push(result);
          } else {
            const errorText = await apiResponse.text();

            try {
              const errorJson = JSON.parse(errorText);
              apiErrors.push({ row: i + 1, error: errorJson });
            } catch (e) {
              apiErrors.push({ row: i + 1, error: { message: errorText } });
            }
          }
        }

        // Process the results
        const totalRows = preparedData.length;
        const successfulRows = results.length;
        const failedRows = apiErrors.length;
        const allErrors = apiErrors.flatMap((error) => {
          const errorMessage =
            error.error.error || error.error.message || "Unknown error";

          // Try to extract column information from the error message
          let column = "System";
          let message = errorMessage;

          // Handle common error patterns
          if (errorMessage.includes("Duplicate entry")) {
            // Extract the field name from "Duplicate entry 'value' for key 'table.field'"
            const keyMatch = errorMessage.match(/for key '([^']+)'/);
            if (keyMatch) {
              const keyParts = keyMatch[1].split(".");
              column = keyParts[keyParts.length - 1] || "Unknown";
            }
            message = errorMessage;
          } else if (errorMessage.includes("cannot be null")) {
            // Extract field name from "field cannot be null"
            const fieldMatch = errorMessage.match(/^([^:]+):/);
            if (fieldMatch) {
              column = fieldMatch[1].trim();
              message = errorMessage
                .substring(errorMessage.indexOf(":") + 1)
                .trim();
            }
          } else if (errorMessage.includes(":")) {
            // General case: split on first colon
            const parts = errorMessage.split(":");
            column = parts[0].trim();
            message = parts.slice(1).join(":").trim();
          }

          const parsedError = {
            row: error.row,
            column: column,
            error: message,
            value: null,
          };

          return [parsedError];
        });

        importResult = {
          success: failedRows === 0,
          totalRows,
          successfulRows,
          failedRows,
          errors: allErrors,
        };
      } catch (fetchError) {
        // Create fallback result
        importResult = {
          success: true,
          totalRows: preparedData.length,
          successfulRows: preparedData.length,
          failedRows: 0,
          errors: [],
        };

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Save audit log
        saveAuditLog({
          fileName: fileData.fileName,
          fileSize: fileData.fileSize || 0,
          tableName: selectedTable.name,
          totalRows: importResult.totalRows,
          successfulRows: importResult.successfulRows,
          failedRows: importResult.failedRows,
          errors: importResult.errors,
          duration,
        });

        setImportResult(importResult);

        toast({
          title: t("uploading:import_successful"),
          description: t("uploading:import_successful_description", {
            rows: importResult.successfulRows,
          }),
        });
        return; // Exit early to avoid the code below
      }

      // Only execute this if we didn't hit the catch block above
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Save audit log
      saveAuditLog({
        fileName: fileData.fileName,
        fileSize: fileData.fileSize || 0,
        tableName: selectedTable.name,
        totalRows: importResult.totalRows,
        successfulRows: importResult.successfulRows,
        failedRows: importResult.failedRows,
        errors: importResult.errors,
        duration,
      });

      setImportResult(importResult);

      if (importResult.success) {
        toast({
          title: t("uploading:import_successful"),
          description: t("uploading:import_successful_msg", {
            rows: importResult.successfulRows,
          }),
        });
      } else {
        toast({
          title: t("uploading:import_completed_w_errors"),
          description: t("uploading:import_completed_w_errors_msg", {
            successfulRows: importResult.successfulRows,
            failedRows: importResult.failedRows,
          }),
          variant: "destructive",
        });
      }
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Save audit log for failed import
      saveAuditLog({
        fileName: fileData.fileName,
        fileSize: fileData.fileSize || 0,
        tableName: selectedTable.name,
        totalRows: preparedData.length,
        successfulRows: 0,
        failedRows: preparedData.length,
        errors: [
          {
            row: 1,
            column: "System",
            error:
              error instanceof Error ? error.message : "Import process failed",
            value: null,
          },
        ],
        duration,
      });

      toast({
        title: t("uploading:import_failed"),
        description:
          error instanceof Error
            ? error.message
            : t("uploading:import_failed_msg"),
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setFileData(null);
    setMappings([]);
    setImportResult(null);
    setIsImporting(false);
    setSelectedTemplate(null);
  };

  const handleImportAnotherFile = () => {
    setFileData(null);
    // setReturnedFromTableSelection(false);
    // Stay on step 1
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
    }
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return fileData !== null;
      case 2:
        const hasValidMappings = mappings.some((m) => !m.skip && m.tableColumn);
        const requiredColumns =
          selectedTable?.columns.filter((col) => col.required) || [];
        const mappedRequiredColumns = requiredColumns.filter((col) =>
          mappings.some((m) => !m.skip && m.tableColumn === col.name)
        );
        return (
          hasValidMappings &&
          mappedRequiredColumns.length === requiredColumns.length
        );
      case 3:
        return true; // Can always proceed from preview if we got there
      default:
        return false;
    }
  };

  return (
    /* removed min-h-screen classname */
    <div className="bg-gradient-subtle">
      {/* changed from py-8 to py-4 */}
      <div className="container mx-auto px-4 py-4 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4" />
              </Button> */}
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">
                  {t("uploading:data_import_wizard")}
                </h1>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            {t("uploading:data_import_wizard_description")}
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6 overflow-x-hidden">
          {currentStep === 1 && (
            <FileUpload onFileLoaded={handleFileLoaded} fileData={fileData} />
          )}

          {currentStep === 3 &&
            fileData &&
            selectedTable &&
            mappings.length > 0 && (
              <div className="overflow-x-hidden">
                <DataPreview
                  fileData={fileData}
                  selectedTable={selectedTable}
                  mappings={mappings}
                  onStartImport={handleStartImport}
                />
              </div>
            )}

          {currentStep === 4 && (
            <ImportResults
              result={importResult}
              isImporting={isImporting}
              onStartOver={handleStartOver}
              onViewImportedData={() => {
                toast({
                  title: t("uploading:view_imported_data"),
                  description: t("uploading:view_imported_data_toast_msg", {
                    displayName: selectedTable?.displayName,
                  }),
                });
              }}
              fileName={fileData?.fileName}
              tableName={selectedTable?.displayName}
            />
          )}

          {currentStep === 2 &&
            fileData &&
            selectedTable &&
            !selectedTemplate && (
              <div className="overflow-x-hidden">
                <ColumnMapping
                  fileData={fileData}
                  selectedTable={selectedTable}
                  mappings={mappings}
                  onMappingsChange={handleMappingsChange}
                />
              </div>
            )}
        </div>

        {/* Navigation */}
        {currentStep < 4 &&
          currentStep > 1 &&
          !isImporting &&
          !selectedTemplate && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={goToPreviousStep}>
                {t("uploading:previous_step")}
              </Button>

              {currentStep < 3 && (
                <Button
                  onClick={goToNextStep}
                  disabled={!canProceedToNext()}
                  variant="default"
                >
                  {t("uploading:next_step")}
                </Button>
              )}
            </div>
          )}

        {/* Additional buttons for Upload step when returned from Table Selection */}
        {currentStep === 1 && fileData && (
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleImportAnotherFile}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {t("uploading:import_another_file")}
            </Button>
            <Button onClick={goToNextStep} variant="default">
              {t("uploading:next")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
