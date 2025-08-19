
import React, { useState, useEffect } from 'react';
import { Save, Trash2, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnMapping, DatabaseTable } from '@/types/import';
import type { MappingTemplate } from '@/utils/localStorage';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface TemplateManagerProps {
  selectedTable: DatabaseTable;
  currentMappings: ColumnMapping[];
  onApplyTemplate: (mappings: ColumnMapping[]) => void;
  showSaveOption?: boolean;
  onTemplateSaved?: (template: MappingTemplate) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  selectedTable,
  currentMappings,
  onApplyTemplate,
  showSaveOption = true,
  onTemplateSaved,
}) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<MappingTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shouldSaveAsTemplate, setShouldSaveAsTemplate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const data = await apiService.getTemplatesForTable(selectedTable.name);
        setTemplates(data);
      } catch (error) {
        toast({
          title: 'Error loading templates',
          description: 'Failed to load templates from server.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [selectedTable.name, toast]);

  const handleSaveTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast({
        title: 'Template name required',
        description: 'Please enter a name for the template.',
        variant: 'destructive',
      });
      return;
    }

    const validMappings = currentMappings.filter(mapping => !mapping.skip && mapping.tableColumn);
    if (validMappings.length === 0) {
      toast({
        title: 'No mappings to save',
        description: 'Please create at least one column mapping before saving a template.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const template = await apiService.saveTemplate({
        name: newTemplateName.trim(),
        tableName: selectedTable.name,
        mappings: currentMappings,
      });
      const data = await apiService.getTemplatesForTable(selectedTable.name);
      setTemplates(data);
      setNewTemplateName('');
      setSaveDialogOpen(false);
      if (onTemplateSaved) {
        onTemplateSaved(template);
      }
      toast({
        title: 'Template saved',
        description: `Template "${template.name}" has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    try {
      await apiService.deleteTemplate(templateId);
      const data = await apiService.getTemplatesForTable(selectedTable.name);
      setTemplates(data);
      toast({
        title: 'Template deleted',
        description: `Template "${templateName}" has been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleApplyTemplate = (template: MappingTemplate) => {
    onApplyTemplate(template.mappings);
    toast({
      title: "Template applied",
      description: `Mappings from "${template.name}" have been applied.`,
    });
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setShouldSaveAsTemplate(checked === true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Mapping Templates</CardTitle>
            <CardDescription>
              Save and reuse column mappings for {selectedTable.name}
            </CardDescription>
          </div>
          {showSaveOption && (
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-template"
                  checked={shouldSaveAsTemplate}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="save-template" className="text-sm">
                  Save as template
                </Label>
              </div>
              {shouldSaveAsTemplate && (
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Mapping Template</DialogTitle>
                      <DialogDescription>
                        Save current column mappings as a reusable template for future imports.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          placeholder="e.g., Customer Data Import"
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTemplate()}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveTemplate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Template
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Alert>
            <Plus className="h-4 w-4" />
            <AlertDescription>
              Loading templates...
            </AlertDescription>
          </Alert>
        ) : templates.length === 0 ? (
          <Alert>
            <Plus className="h-4 w-4" />
            <AlertDescription>
              No templates saved for this table yet. Create your first template by mapping columns and clicking "Save Template".
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {template.mappings.filter(m => !m.skip && m.tableColumn).length} mappings • 
                    Created {new Date(template.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyTemplate(template)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
