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
import { Progress } from "@/components/ui/progress";
import { showToastWithDescription } from "@/lib/toast";
import { ImportResult } from "@/types/import";
import { downloadErrorReport, ErrorReportData } from "@/utils/errorReport";
import {
  CheckCircle,
  Download,
  RotateCcw,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface ImportResultsProps {
  result: ImportResult | null;
  isImporting: boolean;
  onStartOver: () => void;
  onViewImportedData?: (type: "success" | "failed") => void;
  fileName?: string;
  tableName?: string;
}

export const ImportResults: React.FC<ImportResultsProps> = ({
  result,
  isImporting,
  onStartOver,
  onViewImportedData,
  fileName,
  tableName,
}) => {
  const { t } = useTranslation();

  if (isImporting) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
            {t("uploading:importing_data")}
          </CardTitle>
          <CardDescription>
            {t("uploading:importing_data_description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("uploading:processing_rows")}</span>
              <span>{t("uploading:processing_rows_description")}</span>
            </div>
            <Progress value={undefined} className="h-2" />
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const successRate =
    result.totalRows > 0 ? (result.successfulRows / result.totalRows) * 100 : 0;

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-success" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
          {result.success
            ? t("uploading:import_completed")
            : t("uploading:import_completed_w_errors")}
        </CardTitle>
        <CardDescription>
          {result.success
            ? t("uploading:import_completed_description")
            : t("uploading:import_completed_w_errors_description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {result.totalRows}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("uploading:total_rows")}
            </div>
          </div>
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <div className="text-2xl font-bold text-success">
              {result.successfulRows}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("uploading:successful")}
            </div>
          </div>
          <div className="text-center p-4 bg-destructive/10 rounded-lg">
            <div className="text-2xl font-bold text-destructive">
              {result.failedRows}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("uploading:failed")}
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {t("uploading:success_rate")}
            </span>
            <Badge
              variant={
                successRate === 100
                  ? "default"
                  : successRate >= 80
                  ? "secondary"
                  : "destructive"
              }
            >
              {successRate.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>

        {/* Error Details */}
        {result.errors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-destructive">
                {t("uploading:import_errors")}
              </h4>
              <Badge variant="outline" className="text-xs">
                {t("uploading:n_errors", { n: result.errors.length })}
              </Badge>
            </div>
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    {t("uploading:download_errors", {
                      n: result.errors.length,
                    })}
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {result.errors.slice(0, 10).map((error, index) => (
                      <div
                        key={index}
                        className="text-xs bg-destructive/5 p-2 rounded"
                      >
                        <span className="font-medium">
                          {t("uploading:row_n", { n: error.row })}
                        </span>{" "}
                        {error.error}
                        {error.column && (
                          <span className="text-muted-foreground">
                            {" "}
                            {t("uploading:column_column", {
                              column: error.column,
                            })}
                          </span>
                        )}
                      </div>
                    ))}
                    {result.errors.length > 10 && (
                      <p className="text-xs text-muted-foreground">
                        {t("uploading:and_n_more_errors", {
                          rows: result.errors.length - 10,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Success Message */}
        {result.success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="space-y-1">
                <p className="font-medium">
                  {t("uploading:import_completed_successfully")}
                </p>
                <p className="text-sm">
                  {t("uploading:import_completed_successfully_description", {
                    n: result.successfulRows,
                  })}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button onClick={onStartOver} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {t("uploading:import_another_file")}
          </Button>

          {result.errors.length > 0 && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                const errorReportData: ErrorReportData = {
                  fileName: fileName || "Unknown File",
                  tableName: tableName || "Unknown Table",
                  importDate: new Date().toLocaleString(),
                  totalRows: result.totalRows,
                  successfulRows: result.successfulRows,
                  failedRows: result.failedRows,
                  errors: result.errors,
                };
                downloadErrorReport(errorReportData);
                showToastWithDescription(
                  t("uploading:error_report_downloaded"),
                  t("uploading:error_report_downloaded_msg", {
                    fileName: fileName,
                  })
                );
              }}
            >
              <Download className="h-4 w-4" />
              {t("uploading:download_error_report")}{" "}
            </Button>
          )}

          {result.successfulRows > 0 && (
            <Button
              variant="default"
              className="gap-2"
              onClick={() => onViewImportedData?.("success")}
            >
              <CheckCircle className="h-4 w-4" />
              {t("uploading:view_imported_data")}
            </Button>
          )}

          {result.failedRows > 0 && (
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => onViewImportedData?.("failed")}
            >
              <XCircle className="h-4 w-4" />
              {t("uploading:view_unimported_data")}
            </Button>
          )}
        </div>

        {/* Import Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">
              {t("uploading:import_summary")}
            </h4>
            <div className="text-sm space-y-1">
              <p>
                •{" "}
                {t("uploading:n_rows_successfully_imported", {
                  n: result.successfulRows,
                })}
              </p>
              {result.failedRows > 0 && (
                <p>
                  •{" "}
                  {t("uploading:n_rows_failed_to_import", {
                    n: result.failedRows,
                  })}
                </p>
              )}
              <p>
                •{" "}
                {t("uploading:import_completed_at_date", {
                  date: new Date().toLocaleString(),
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
