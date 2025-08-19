import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DataImport } from "@/pages/DataImport";
import { Database } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface PolicyUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolicyUploadModal: React.FC<PolicyUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  // const [fileData, setFileData] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [reading, setReading] = useState(false);

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const selectedFile = e.target.files[0];

  //     // Validate file
  //     const validation = validateFile(selectedFile);
  //     if (!validation.valid) {
  //       setError(validation.error || "Invalid file");
  //       setFile(null);
  //       setFileData(null);
  //       return;
  //     }

  //     setFile(selectedFile);
  //     setError(null);
  //     setReading(true);

  //     try {
  //       // Read file content
  //       const result = await readFile(selectedFile);

  //       if (result.success && result.data) {
  //         setFileData(result.data);
  //         console.log({ data: result.data });
  //         toast({
  //           title: "File read successfully",
  //           description: `Found ${result.data.totalRows} rows with ${result.data.headers.length} columns.`,
  //         });
  //       } else {
  //         setError(result.error || "Failed to read file");
  //         setFile(null);
  //         setFileData(null);
  //       }
  //     } catch (error) {
  //       setError(
  //         `Error reading file: ${
  //           error instanceof Error ? error.message : "Unknown error"
  //         }`
  //       );
  //       setFile(null);
  //       setFileData(null);
  //     } finally {
  //       setReading(false);
  //     }
  //   }
  // };

  // const handleUpload = () => {
  //   if (!file || !fileData) {
  //     setError("Please select a valid file to upload.");
  //     return;
  //   }

  //   setUploading(true);
  //   setError(null);

  //   // Simulate upload process with actual file data
  //   setTimeout(() => {
  //     setUploading(false);
  //     toast({
  //       title: "Upload successful",
  //       description: `${file.name} has been successfully uploaded and processed. ${fileData.totalRows} policies imported.`,
  //     });
  //     onClose();
  //   }, 1500);
  // };

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
      <DialogContent className="sm:max-w-[90vw] min-w-[800px] max-h-[95vh] overflow-y-auto overflow-x-hidden flex flex-col">
        <DialogHeader className="hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <DialogTitle className="text-2xl font-bold tracking-normal">
                {t("uploading:data_import_wizard")}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base" style={{ marginTop: "0px" }}>
            {t("uploading:data_import_wizard_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-w-0">
          <DataImport />
        </div>

        {/* <DialogFooter className="flex sm:justify-between">
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
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default PolicyUploadModal;
