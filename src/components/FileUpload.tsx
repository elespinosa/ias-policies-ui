import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileData } from "@/types/import";
import { parseFile } from "@/utils/fileParser";
import { CheckCircle, FileSpreadsheet, Upload } from "lucide-react";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface FileUploadProps {
  onFileLoaded: (fileData: FileData) => void;
  fileData: FileData | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileLoaded,
  fileData,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!["xlsx", "xls", "csv"].includes(fileExtension || "")) {
        toast({
          title: t("uploading:invalid_file_type"),
          description: t("uploading:invalid_file_type_description"),
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        const parsedData = await parseFile(file);
        onFileLoaded(parsedData);
        toast({
          title: t("uploading:file_uploaded_successfully"),
          description: t("uploading:file_uploaded_successfully_description", {
            rows: parsedData.rows.length,
            columns: parsedData.headers.length,
          }),
        });
      } catch (error) {
        toast({
          title: t("uploading:file_parse_error"),
          description:
            error instanceof Error
              ? error.message
              : t("uploading:file_parse_error_msg"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [onFileLoaded, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          {t("uploading:upload_data_file")}
        </CardTitle>
        <CardDescription>
          {t("uploading:upload_data_file_description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!fileData ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-4">
              <Upload
                className={`h-12 w-12 ${
                  isDragOver ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragOver
                    ? t("uploading:drop_your_file_here")
                    : t("uploading:drag_and_drop_file")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("uploading:drag_file_description")}
                </p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInputChange}
                  disabled={isLoading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button variant="default" disabled={isLoading} className="px-6">
                  {isLoading
                    ? t("uploading:processing")
                    : t("uploading:choose_file")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Alert className="border-success/20 bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              <div className="space-y-1">
                <p className="font-medium">{fileData.fileName}</p>
                <p className="text-sm">
                  {t("uploading:rows_columns", {
                    rows: fileData.rows.length,
                    columns: fileData.headers.length,
                  })}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {fileData && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              {t("uploading:file_preview")}
            </h4>
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-xs border rounded-lg min-w-max">
                <thead>
                  <tr className="bg-muted/50">
                    {fileData.headers.map((header, index) => (
                      <th
                        key={index}
                        className="p-2 text-left border-r last:border-r-0 font-medium"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fileData.rows.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="p-2 border-r last:border-r-0"
                        >
                          {cell?.toString() || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {fileData.rows.length > 5 && (
              <p className="text-xs text-muted-foreground">
                {t("uploading:and_n_more_rows", {
                  rows: fileData.rows.length - 5,
                })}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
