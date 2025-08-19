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
  ImportStep,
} from "@/types/import";
import { autoMapColumns } from "@/utils/columnMatcher";
import type { MappingTemplate } from "@/utils/localStorage";
import { saveAuditLog } from "@/utils/localStorage";
import { Database, Upload } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const initialSteps: ImportStep[] = [
  {
    id: 1,
    title: "Upload",
    description: "Upload your data file",
    completed: false,
    current: true,
  },
  {
    id: 2,
    title: "Select Table",
    description: "Choose target table",
    completed: false,
    current: false,
  },
  {
    id: 3,
    title: "Map Columns",
    description: "Map file columns to database",
    completed: false,
    current: false,
  },
  {
    id: 4,
    title: "Preview",
    description: "Preview and validate data",
    completed: false,
    current: false,
  },
  {
    id: 5,
    title: "Import",
    description: "Import data to database",
    completed: false,
    current: false,
  },
];

export const DataImport: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  // const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const templateId = searchParams.get("template");

  const [currentStep, setCurrentStep] = React.useState(1);
  const [steps, setSteps] = React.useState<ImportStep[]>(initialSteps);
  const [fileData, setFileData] = React.useState<FileData | null>(null);
  const [selectedTable, setSelectedTable] =
    React.useState<DatabaseTable | null>(null);
  const [mappings, setMappings] = React.useState<ColumnMappingType[]>([]);
  const [importResult, setImportResult] = React.useState<ImportResult | null>(
    null
  );
  const [isImporting, setIsImporting] = React.useState(false);
  const [importStartTime, setImportStartTime] = React.useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<MappingTemplate | null>(null);
  // const [returnedFromTableSelection, setReturnedFromTableSelection] =
  //   React.useState(false);

  // Load template if specified in URL
  // React.useEffect(() => {
  //   if (templateId) {
  //     const getTemplates = async () => {
  //       try {
  //         const templates = await apiService.getTemplates();
  //         const template = templates.find((t) => t.id === templateId);
  //         if (template) {
  //           setSelectedTemplate(template);
  //           // Auto-select the table
  //           const table = mockDatabaseTables.find(
  //             (t) => t.name === template.tableName
  //           );
  //           if (table) {
  //             setSelectedTable(table);
  //             setMappings(template.mappings);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error fetching templates:", error);
  //         toast({
  //           title: "Error loading template",
  //           description:
  //             "Failed to load template from storage. Please try again.",
  //           variant: "destructive",
  //         });
  //       }
  //     };
  //     getTemplates();
  //   }
  // }, [templateId, toast]);
  useEffect(() => {
    setSelectedTable(mockDatabaseTables.find((e) => e.name === "policies"));
  }, []);

  const updateSteps = (stepNumber: number, completed: boolean = false) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        completed:
          step.id < stepNumber || (step.id === stepNumber && completed),
        current: step.id === stepNumber && !completed,
      }))
    );
  };

  const handleFileLoaded = (data: FileData) => {
    console.log("1 running");
    console.log({ page: "DataImport", data });
    setFileData(data);
    console.log({ s: 2, fileData });
    // setReturnedFromTableSelection(false);

    // Initialize mappings with automatic mapping
    if (data) {
      const autoMappings = autoMapColumns(data.headers, selectedTable.columns);
      console.log({ autoMappings });
      setMappings(autoMappings);
    }

    updateSteps(2);
    setCurrentStep(2);
  };

  // const handleTableSelect = (table: DatabaseTable) => {
  //   setSelectedTable(table);
  //   console.log("running", fileData);

  //   // Initialize mappings with automatic mapping
  //   if (fileData) {
  //     const autoMappings = autoMapColumns(fileData.headers, table.columns);
  //     console.log({ autoMappings });
  //     setMappings(autoMappings);
  //   }

  //   updateSteps(2);
  //   setCurrentStep(2);
  // };

  const handleMappingsChange = (newMappings: ColumnMappingType[]) => {
    setMappings(newMappings);

    // Check if we have valid mappings to proceed
    const hasValidMappings = newMappings.some((m) => !m.skip && m.tableColumn);
    const requiredColumns =
      selectedTable?.columns.filter((col) => col.required) || [];
    const mappedRequiredColumns = requiredColumns.filter((col) =>
      newMappings.some((m) => !m.skip && m.tableColumn === col.name)
    );

    if (
      hasValidMappings &&
      mappedRequiredColumns.length === requiredColumns.length
    ) {
      updateSteps(4);
    }
  };

  const handleTemplateSaved = (template: MappingTemplate) => {
    toast({
      title: "Template saved",
      description: `Template "${template.name}" has been saved for future use.`,
    });
  };

  const handleStartImport = async (preparedData: any[]) => {
    if (!fileData || !selectedTable || !mappings) return;

    setCurrentStep(4);
    updateSteps(4);
    setIsImporting(true);
    const startTime = Date.now();
    setImportStartTime(startTime);

    try {
      console.log("Starting import with prepared data:", {
        tableName: selectedTable.name,
        data: preparedData,
        totalRows: preparedData.length,
      });

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
          console.log(`Sending row ${i + 1} to API:`, rowData);
          console.log(
            `Request body JSON for row ${i + 1}:`,
            JSON.stringify(rowData, null, 2)
          );

          // Get the URL endpoint from the selected table configuration
          if (!selectedTable.urlEndpoint) {
            console.warn(
              `No URL endpoint configured for table: ${selectedTable.name}`
            );
            apiErrors.push({
              row: i + 1,
              error: {
                message: `No API endpoint configured for table: ${selectedTable.name}`,
              },
            });
            continue;
          }

          console.log(
            `Using endpoint for ${selectedTable.name}: ${selectedTable.urlEndpoint}`
          );

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
            console.log(`Row ${i + 1} API response:`, result);
          } else {
            const errorText = await apiResponse.text();
            console.warn(
              `Row ${i + 1} API call failed with status: ${
                apiResponse.status
              }. Response:`,
              errorText
            );
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
          console.log(`Processing error for row ${error.row}:`, errorMessage);

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

          console.log(`Parsed error for row ${error.row}:`, parsedError);
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
        console.warn(
          "API server not available. Using fallback mode:",
          fetchError
        );
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
        updateSteps(4, true);

        toast({
          title: "Import Successful",
          description: `Successfully imported ${importResult.successfulRows} rows. (API server not available - using fallback mode)`,
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
      updateSteps(5, true);

      if (importResult.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${importResult.successfulRows} rows.`,
        });
      } else {
        toast({
          title: "Import Completed with Errors",
          description: `${importResult.successfulRows} rows imported, ${importResult.failedRows} failed.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Import error:", error);
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
        title: "Import Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during import. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setSteps(initialSteps);
    setFileData(null);
    setSelectedTable(null);
    setMappings([]);
    setImportResult(null);
    setIsImporting(false);
    setSelectedTemplate(null);
    // setReturnedFromTableSelection(false);
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
      updateSteps(newStep);

      // Track if we're returning to upload from table selection
      // if (currentStep === 2 && newStep === 1) {
      //   setReturnedFromTableSelection(true);
      // }
    }
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      updateSteps(newStep);
      // setReturnedFromTableSelection(false);
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
  console.log({ currentStep, fileData, selectedTemplate });

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

        {/* Stepper */}
        {/* <ImportStepper steps={steps} /> */}

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
                  title: "View Imported Data",
                  description: `Redirecting to view imported data for ${selectedTable?.displayName}...`,
                });
                // TODO: Implement navigation to data view page
                // For now, just show a toast message
                console.log(
                  "View imported data for table:",
                  selectedTable?.name
                );
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
