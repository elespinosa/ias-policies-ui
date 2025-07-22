
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileType, Download, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PolicyUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolicyUploadModal: React.FC<PolicyUploadModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'csv' && fileExtension !== 'xlsx') {
        setError('Invalid file format. Please upload a CSV or XLSX file.');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast({
        title: 'Upload successful',
        description: `${file.name} has been successfully uploaded and processed.`,
      });
      onClose();
    }, 1500);
  };

  const downloadTemplate = (format: 'csv' | 'xlsx') => {
    // In a real app, this would generate and download the actual template file
    // For now, we'll just show a toast notification
    toast({
      title: 'Template Downloaded',
      description: `Policy template in ${format.toUpperCase()} format has been downloaded.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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
                    {file ? file.name : 'No file selected'}
                  </span>
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
                Supported formats: CSV, XLSX
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Need a Template?</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1"
                onClick={() => downloadTemplate('csv')}
              >
                <Download size={14} />
                CSV Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1"
                onClick={() => downloadTemplate('xlsx')}
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
          <Button onClick={handleUpload} disabled={!file || uploading}>
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
