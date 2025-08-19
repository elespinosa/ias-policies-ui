import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  readFile,
  validateFile,
  type FileData,
  type FileReadResult,
} from "@/lib/fileUtils";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useCallback, useState } from "react";

interface FileReaderProps {
  onFileRead: (data: FileData) => void;
  onError?: (error: string) => void;
  acceptedFormats?: string[];
  maxSize?: number;
  showPreview?: boolean;
  className?: string;
}

const FileReader: React.FC<FileReaderProps> = ({
  onFileRead,
  onError,
  acceptedFormats = [".csv", ".xlsx"],
  maxSize = 10 * 1024 * 1024, // 10MB
  showPreview = true,
  className = "",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      // Reset states
      setError(null);
      setFileData(null);
      setProgress(0);

      // Validate file
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        const errorMsg = validation.error || "Invalid file";
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      setFile(selectedFile);
      setIsReading(true);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Read file
        const result: FileReadResult = await readFile(selectedFile);

        clearInterval(progressInterval);
        setProgress(100);

        if (result.success && result.data) {
          setFileData(result.data);
          onFileRead(result.data);
        } else {
          const errorMsg = result.error || "Failed to read file";
          setError(errorMsg);
          onError?.(errorMsg);
          setFile(null);
        }
      } catch (err) {
        const errorMsg = `Error reading file: ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        setError(errorMsg);
        onError?.(errorMsg);
        setFile(null);
      } finally {
        setIsReading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [onFileRead, onError]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setFileData(null);
    setError(null);
    setProgress(0);
  }, []);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension === "csv" ? (
      <FileText className="h-8 w-8" />
    ) : (
      <FileSpreadsheet className="h-8 w-8" />
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: {acceptedFormats.join(", ")}
              </p>
              <p className="text-xs text-gray-400">
                Maximum file size: {formatFileSize(maxSize)}
              </p>
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept={acceptedFormats.join(",")}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={clearFile}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              {isReading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reading file...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* File Data Summary */}
              {fileData && !isReading && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">
                      File read successfully
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {fileData.totalRows}
                      </p>
                      <p className="text-sm text-blue-600">Total Rows</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {fileData.headers.length}
                      </p>
                      <p className="text-sm text-green-600">Columns</p>
                    </div>
                  </div>

                  {/* Column Headers */}
                  <div>
                    <p className="text-sm font-medium mb-2">Columns:</p>
                    <div className="flex flex-wrap gap-1">
                      {fileData.headers.map((header, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {header}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Preview Toggle */}
                  {showPreview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewVisible(!previewVisible)}
                      className="flex gap-2"
                    >
                      {previewVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {previewVisible ? "Hide Preview" : "Show Preview"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* File Preview */}
      {fileData && previewVisible && showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">File Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Headers */}
                <div
                  className="grid gap-1 mb-2"
                  style={{
                    gridTemplateColumns: `repeat(${fileData.headers.length}, minmax(150px, 1fr))`,
                  }}
                >
                  {fileData.headers.map((header, index) => (
                    <div
                      key={index}
                      className="font-semibold text-sm p-3 bg-primary/10 rounded border"
                    >
                      {header}
                    </div>
                  ))}
                </div>

                {/* Data Rows */}
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {fileData.rows.slice(0, 10).map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid gap-1"
                      style={{
                        gridTemplateColumns: `repeat(${fileData.headers.length}, minmax(150px, 1fr))`,
                      }}
                    >
                      {row.map((cell, cellIndex) => (
                        <div
                          key={cellIndex}
                          className="text-sm p-3 bg-background rounded border"
                        >
                          {cell || "-"}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {fileData.rows.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Showing first 10 rows of {fileData.totalRows} total rows
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileReader;
