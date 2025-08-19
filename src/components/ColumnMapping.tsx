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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnMapping as ColumnMappingType,
  DatabaseTable,
  FileData,
} from "@/types/import";
import { autoMapColumns } from "@/utils/columnMatcher";
import { AlertTriangle, Check, Settings, Zap } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface ColumnMappingProps {
  fileData: FileData;
  selectedTable: DatabaseTable;
  mappings: ColumnMappingType[];
  onMappingsChange: (mappings: ColumnMappingType[]) => void;
}

export const ColumnMapping: React.FC<ColumnMappingProps> = ({
  fileData,
  selectedTable,
  mappings,
  onMappingsChange,
}) => {
  const { t } = useTranslation();

  const updateMapping = (
    index: number,
    updates: Partial<ColumnMappingType>
  ) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], ...updates };
    onMappingsChange(newMappings);
  };

  const handleAutoMap = () => {
    const autoMappings = autoMapColumns(
      fileData.headers,
      selectedTable.columns
    );
    onMappingsChange(autoMappings);
  };

  const getAvailableColumns = (currentMapping: string | null) => {
    const usedColumns = mappings
      .filter(
        (m) => !m.skip && m.tableColumn && m.tableColumn !== currentMapping
      )
      .map((m) => m.tableColumn);

    return selectedTable.columns.filter(
      (col) => !usedColumns.includes(col.name)
    );
  };

  const getMappingStatus = () => {
    const mapped = mappings.filter((m) => !m.skip && m.tableColumn).length;
    const unmapped = mappings.filter((m) => !m.skip && !m.tableColumn).length;
    const required = selectedTable.columns.filter((col) => col.required).length;
    const mappedRequired = mappings.filter((m) => {
      if (m.skip || !m.tableColumn) return false;
      const column = selectedTable.columns.find(
        (col) => col.name === m.tableColumn
      );
      return column?.required || false;
    }).length;

    return {
      mapped,
      unmapped,
      total: mappings.length,
      required,
      mappedRequired,
    };
  };

  const status = getMappingStatus();

  return (
    <div className="space-y-6">
      {/* <TemplateManager
        selectedTable={selectedTable}
        currentMappings={mappings}
        onApplyTemplate={onMappingsChange}
      /> */}

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {t("uploading:column_mapping")}
              </CardTitle>
              <CardDescription>
                {t("uploading:column_mapping_description")}{" "}
              </CardDescription>
            </div>
            <Button onClick={handleAutoMap} variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              {t("uploading:auto_map")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">
              {t("uploading:n_of_x_columns_mapped", {
                mapped: status.mapped,
                total: status.total,
              })}
            </Badge>
            {status.unmapped > 0 && (
              <Badge variant="destructive">
                {t("uploading:n_unmapped_columns_remaining", {
                  unmapped: status.unmapped,
                })}
              </Badge>
            )}
            <Badge
              variant={
                status.mappedRequired >= status.required
                  ? "default"
                  : "destructive"
              }
            >
              {t("uploading:n_of_x_required_fields_covered", {
                mappedRequired: status.mappedRequired,
                required: status.required,
              })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status.mappedRequired < status.required && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t("uploading:column_mapping_alert_description")}
              </AlertDescription>
            </Alert>
          )}

          <div className="border rounded-lg overflow-x-auto max-w-full">
            <Table className="min-w-max">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">
                    {t("uploading:file_column")}
                  </TableHead>
                  <TableHead className="w-1/3">
                    {t("uploading:database_column")}
                  </TableHead>
                  <TableHead className="w-20">{t("uploading:skip")}</TableHead>
                  <TableHead className="w-16">
                    {t("uploading:status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping, index) => {
                  const availableColumns = getAvailableColumns(
                    mapping.tableColumn
                  );
                  const selectedColumn = selectedTable.columns.find(
                    (col) => col.name === mapping.tableColumn
                  );
                  const isUnmapped = !mapping.skip && !mapping.tableColumn;
                  const isRequiredUnmapped =
                    isUnmapped &&
                    selectedTable.columns.some(
                      (col) =>
                        col.required &&
                        !mappings.some(
                          (m) => !m.skip && m.tableColumn === col.name
                        )
                    );

                  return (
                    <TableRow
                      key={mapping.fileHeader}
                      className={
                        isUnmapped
                          ? "bg-amber-50 border-l-4 border-l-amber-400"
                          : ""
                      }
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {mapping.fileHeader}
                          {isUnmapped && (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={mapping.tableColumn || "none"}
                          onValueChange={(value) =>
                            updateMapping(index, {
                              tableColumn: value === "none" ? null : value,
                              useDefaultValue: false,
                            })
                          }
                        >
                          <SelectTrigger
                            className={`h-8 ${
                              isUnmapped ? "border-amber-400" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              {t("uploading:no_mapping")}
                            </SelectItem>
                            {availableColumns.map((column) => (
                              <SelectItem key={column.name} value={column.name}>
                                <div className="flex items-center gap-1">
                                  {column.displayName}
                                  {column.required && (
                                    <span className="text-red-500">*</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={mapping.skip}
                          onCheckedChange={(checked) =>
                            updateMapping(index, { skip: !!checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {mapping.skip ? (
                            <Badge variant="secondary" className="text-xs">
                              {t("uploading:skipped")}
                            </Badge>
                          ) : mapping.tableColumn ? (
                            <div className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-green-600" />
                              <Badge variant="default" className="text-xs">
                                {t("uploading:mapped")}
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              {t("uploading:unmapped")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">
                {t("uploading:unmapped_required_columns")}
              </h4>
              <div className="space-y-2">
                {selectedTable.columns
                  .filter((col) => {
                    const isMapped = mappings.some(
                      (m) => !m.skip && m.tableColumn === col.name
                    );
                    return col.required && !isMapped;
                  })
                  .map((column) => (
                    <div
                      key={column.name}
                      className="flex items-center justify-between p-2 bg-card rounded border"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {column.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {column.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          {t("uploading:required")}
                        </Badge>
                        {column.defaultValue && (
                          <Badge variant="outline" className="text-xs">
                            {t("uploading:default_value", {
                              value: column.defaultValue,
                            })}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                {selectedTable.columns.filter((col) => {
                  const isMapped = mappings.some(
                    (m) => !m.skip && m.tableColumn === col.name
                  );
                  return col.required && !isMapped;
                }).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {t("uploading:all_required_columns_mapped")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
