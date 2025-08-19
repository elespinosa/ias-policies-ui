
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { FileUp, FileText, Trash, Download, Eye } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  dateUploaded: string;
  url?: string; // In a real app, this would be a URL to the file
}

interface DocumentUploadProps {
  documents: Document[];
  onDocumentAdd: (document: Document) => void;
  onDocumentDelete: (documentId: string) => void;
  title?: string;
  description?: string;
  maxHeight?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents = [],
  onDocumentAdd,
  onDocumentDelete,
  title = "Documents",
  description = "Upload and manage documents",
  maxHeight = "300px"
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // In a real app, you would upload the file to a server here
    // For this demo, we'll simulate an upload delay
    setTimeout(() => {
      const newDocuments = Array.from(files).map(file => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        dateUploaded: new Date().toISOString(),
        url: URL.createObjectURL(file) // This creates a temporary URL for preview
      }));
      
      newDocuments.forEach(doc => onDocumentAdd(doc));
      
      toast.success(`${newDocuments.length} document${newDocuments.length !== 1 ? 's' : ''} uploaded successfully`);
      setIsUploading(false);
      
      // Reset the input
      e.target.value = '';
    }, 1000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getDocumentTypeIcon = (type: string) => {
    if (type.includes('image')) return 'image';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('word') || type.includes('document')) return 'doc';
    if (type.includes('sheet') || type.includes('excel')) return 'sheet';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'presentation';
    return 'generic';
  };

  const getDocumentTypeColor = (type: string) => {
    if (type.includes('image')) return 'bg-blue-100 text-blue-800';
    if (type.includes('pdf')) return 'bg-red-100 text-red-800';
    if (type.includes('word') || type.includes('document')) return 'bg-indigo-100 text-indigo-800';
    if (type.includes('sheet') || type.includes('excel')) return 'bg-green-100 text-green-800';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="flex-1"
              id="document-upload"
              disabled={isUploading}
            />
            <label htmlFor="document-upload">
              <Button asChild disabled={isUploading}>
                <span>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload
                </span>
              </Button>
            </label>
          </div>
          
          {documents.length > 0 ? (
            <ScrollArea className="rounded-md border" style={{ maxHeight }}>
              <div className="p-4 space-y-3">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getDocumentTypeColor(doc.type)}>
                            {getDocumentTypeIcon(doc.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.dateUploaded).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.url && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = doc.url!;
                              a.download = doc.name;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          onDocumentDelete(doc.id);
                          toast.success(`Document "${doc.name}" deleted`);
                        }}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 rounded-md border border-dashed">
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No documents uploaded</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload documents using the button above
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
