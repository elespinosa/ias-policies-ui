import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockDatabaseTables } from "@/data/mockDatabase";
import { DatabaseTable } from "@/types/import";
import { ArrowRight, Database, Info, Table } from "lucide-react";
import React from "react";

interface TableSelectionProps {
  selectedTable: DatabaseTable | null;
  onTableSelect: (table: DatabaseTable) => void;
}

export const TableSelection: React.FC<TableSelectionProps> = ({
  selectedTable,
  onTableSelect,
}) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Select Target Table
        </CardTitle>
        <CardDescription>
          Choose the database table where you want to import your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {mockDatabaseTables.map((table) => (
            <div
              key={table.name}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                selectedTable?.name === table.name
                  ? "border-primary bg-primary/5 shadow-medium"
                  : "border-border hover:border-primary/50 hover:shadow-soft"
              }`}
              onClick={() => {
                console.log({ table });
                onTableSelect(table);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">{table.displayName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {table.columns.length} columns
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {table.description}
                  </p>
                  {table.urlEndpoint && (
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        API: {table.urlEndpoint.split("/").pop()}
                      </Badge>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {table.columns.slice(0, 5).map((column) => (
                      <Badge
                        key={column.name}
                        variant="secondary"
                        className="text-xs"
                      >
                        {column.displayName}
                      </Badge>
                    ))}
                    {table.columns.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{table.columns.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  {selectedTable?.name === table.name ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
                      <ArrowRight className="h-4 w-4 text-primary-foreground" />
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTable && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-4 w-4" />
                {selectedTable.displayName} Schema
              </CardTitle>
              {selectedTable.urlEndpoint && (
                <CardDescription>
                  API Endpoint:{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {selectedTable.urlEndpoint}
                  </code>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Column</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-left py-2 font-medium">Required</th>
                      <th className="text-left py-2 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {selectedTable.columns.map((column) => (
                      <tr
                        key={column.name}
                        className="border-b border-border/50"
                      >
                        <td className="py-2">
                          <div>
                            <p className="font-medium">{column.displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              {column.name}
                            </p>
                          </div>
                        </td>
                        <td className="py-2">
                          <Badge variant="outline" className="text-xs">
                            {column.dataType}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <Badge
                            variant={
                              column.required ? "destructive" : "secondary"
                            }
                            className="text-xs"
                          >
                            {column.required ? "Required" : "Optional"}
                          </Badge>
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          <div className="space-y-1">
                            {column.maxLength && (
                              <p>Max: {column.maxLength} chars</p>
                            )}
                            {column.defaultValue && (
                              <p>Default: {column.defaultValue}</p>
                            )}
                            {column.description && <p>{column.description}</p>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
