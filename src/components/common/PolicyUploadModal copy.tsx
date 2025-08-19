import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { readFile, validateFile, type FileData } from "@/lib/fileUtils";
import { Check, Download, FileType, Upload } from "lucide-react";
import React, { useState } from "react";

interface PolicyUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolicyUploadModal: React.FC<PolicyUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [reading, setReading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        setFile(null);
        setFileData(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setReading(true);

      try {
        // Read file content
        const result = await readFile(selectedFile);

        if (result.success && result.data) {
          setFileData(result.data);
          console.log({ data: result.data });
          toast({
            title: "File read successfully",
            description: `Found ${result.data.totalRows} rows with ${result.data.headers.length} columns.`,
          });
        } else {
          setError(result.error || "Failed to read file");
          setFile(null);
          setFileData(null);
        }
      } catch (error) {
        setError(
          `Error reading file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setFile(null);
        setFileData(null);
      } finally {
        setReading(false);
      }
    }
  };

  const handleUpload = () => {
    if (!file || !fileData) {
      setError("Please select a valid file to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    // Simulate upload process with actual file data
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Upload successful",
        description: `${file.name} has been successfully uploaded and processed. ${fileData.totalRows} policies imported.`,
      });
      onClose();
    }, 1500);
  };

  const downloadTemplate = (format: "csv" | "xlsx") => {
    // In a real app, this would generate and download the actual template file
    // For now, we'll just show a toast notification
    toast({
      title: "Template Downloaded",
      description: `Policy template in ${format.toUpperCase()} format has been downloaded.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Legacy Policies</DialogTitle>
          <DialogDescription>
            Import your policies from legacy systems using CSV or XLSX files.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="file-upload">Upload Policy File</Label>
            <div className="grid gap-2">
              <div className="border rounded-md p-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileType size={18} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {file ? file.name : "No file selected"}
                  </span>
                  {reading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                </div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground text-xs py-1 px-2 rounded-sm hover:bg-primary/90 transition-colors">
                    <Upload size={12} />
                    Browse
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="text-xs text-muted-foreground">
                Supported formats: CSV, XLSX (Max size: 10MB)
              </div>
            </div>
          </div>

          {/* File Preview Section */}
          {/* Put here is you want preview */}

          <div className="flex flex-col space-y-2">
            <Label>Need a Template?</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1"
                onClick={() => downloadTemplate("csv")}
              >
                <Download size={14} />
                CSV Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1"
                onClick={() => downloadTemplate("xlsx")}
              >
                <Download size={14} />
                XLSX Template
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleUpload}
            disabled={!file || !fileData || uploading || reading}
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Upload Policies
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyUploadModal;
