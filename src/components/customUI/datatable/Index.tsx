import React, { useState } from 'react';
import DataTable from './DataTable';
import { TableColumn } from './TableTypes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Eye, Trash } from 'lucide-react';

const Index = () => {
  const [selectedRows, setSelectedRows] = useState<{ rowIds: string[], rows: any[] }>({ rowIds: [], rows: [] });

  // Sample data
  const sampleData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', age: 32, location: 'New York', department: 'Engineering', additionalInfo: { joinDate: '2020-05-12', projects: ['Dashboard', 'API Integration'], manager: 'Alice Smith', performance: 'Excellent' } },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', age: 28, location: 'San Francisco', department: 'Marketing', additionalInfo: { joinDate: '2019-08-23', projects: ['Brand Campaign', 'Market Research'], manager: 'Bob Johnson', performance: 'Good' } },
    { id: '3', name: 'Robert Johnson', email: 'robert@example.com', status: 'active', age: 45, location: 'Chicago', department: 'Sales', additionalInfo: { joinDate: '2017-02-15', projects: ['Enterprise Sales', 'Partner Program'], manager: 'Carol Williams', performance: 'Outstanding' } },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', status: 'pending', age: 31, location: 'Boston', department: 'Product', additionalInfo: { joinDate: '2021-03-08', projects: ['Mobile App', 'Web Portal'], manager: 'David Brown', performance: 'Good' } },
    { id: '5', name: 'Michael Brown', email: 'michael@example.com', status: 'active', age: 36, location: 'Seattle', department: 'Engineering', additionalInfo: { joinDate: '2018-11-19', projects: ['Cloud Migration', 'DevOps'], manager: 'Alice Smith', performance: 'Good' } },
    { id: '6', name: 'Sarah Wilson', email: 'sarah@example.com', status: 'inactive', age: 29, location: 'Austin', department: 'HR', additionalInfo: { joinDate: '2020-01-06', projects: ['Recruitment', 'Training Program'], manager: 'Eric Davis', performance: 'Average' } },
    { id: '7', name: 'David Lee', email: 'david@example.com', status: 'active', age: 41, location: 'Denver', department: 'Finance', additionalInfo: { joinDate: '2016-07-22', projects: ['Budget Planning', 'Financial Reports'], manager: 'Frank Miller', performance: 'Excellent' } },
    { id: '8', name: 'Lisa Anderson', email: 'lisa@example.com', status: 'pending', age: 27, location: 'Portland', department: 'Marketing', additionalInfo: { joinDate: '2022-02-14', projects: ['Social Media', 'Content Strategy'], manager: 'Bob Johnson', performance: 'Good' } },
    { id: '9', name: 'Thomas Martinez', email: 'thomas@example.com', status: 'active', age: 34, location: 'Miami', department: 'Sales', additionalInfo: { joinDate: '2019-05-30', projects: ['Retail Sales', 'Customer Retention'], manager: 'Carol Williams', performance: 'Average' } },
    { id: '10', name: 'Jessica Taylor', email: 'jessica@example.com', status: 'inactive', age: 39, location: 'Los Angeles', department: 'Product', additionalInfo: { joinDate: '2018-08-11', projects: ['Product Roadmap', 'User Testing'], manager: 'David Brown', performance: 'Good' } },
    { id: '11', name: 'Daniel White', email: 'daniel@example.com', status: 'active', age: 33, location: 'Atlanta', department: 'Engineering', additionalInfo: { joinDate: '2020-09-17', projects: ['Backend Services', 'Database Optimization'], manager: 'Alice Smith', performance: 'Outstanding' } },
    { id: '12', name: 'Jennifer Clark', email: 'jennifer@example.com', status: 'pending', age: 30, location: 'Dallas', department: 'Finance', additionalInfo: { joinDate: '2021-04-25', projects: ['Audit', 'Tax Planning'], manager: 'Frank Miller', performance: 'Excellent' } },
  ];

  // Define columns
  const columns: TableColumn[] = [
    { id: 'name', label: 'Name', accessor: 'name' },
    { id: 'email', label: 'Email', accessor: 'email' },
    { 
      id: 'status', 
      label: 'Status', 
      accessor: 'status',
      render: (row) => {
        const status = row.status;
        let badgeVariant = 'secondary';
        
        if (status === 'active') badgeVariant = 'success';
        else if (status === 'inactive') badgeVariant = 'destructive';
        else if (status === 'pending') badgeVariant = 'warning';
        
        return (
          <Badge
            variant={badgeVariant as any}
            className={`
              ${status === 'active' ? 'bg-green-100 text-green-800' : ''}
              ${status === 'inactive' ? 'bg-red-100 text-red-800' : ''}
              ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
            `}
          >
            {status}
          </Badge>
        );
      }
    },
    { id: 'age', label: 'Age', accessor: 'age' },
    { id: 'location', label: 'Location', accessor: 'location' },
    { id: 'department', label: 'Department', accessor: 'department' },
    { 
      id: 'actions', 
      label: 'Actions', 
      sortable: false,
      render: (row) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ];

  // Table action handlers
  const handleRowSelect = (selected: { rowIds: string[], rows: any[] }) => {
    setSelectedRows(selected);
  };
  
  const handleView = (row: any) => {
    toast({
      title: "View User",
      description: `Viewing details for ${row.name}`,
    });
  };
  
  const handleDelete = (row: any) => {
    toast({
      variant: "destructive",
      title: "Delete User",
      description: `${row.name} would be deleted (demo only)`,
    });
  };
  
  const handleDeleteSelected = () => {
    if (selectedRows.rows.length > 0) {
      const names = selectedRows.rows.map(row => row.name).join(', ');
      toast({
        variant: "destructive",
        title: "Delete Selected",
        description: `Selected users would be deleted: ${names} (demo only)`,
      });
    }
  };
  
  // Render expanded content
  const renderExpandedContent = (row: any) => {
    const { additionalInfo } = row;
    
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Employee Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Join Date:</span> {additionalInfo.joinDate}</p>
            <p><span className="font-medium">Manager:</span> {additionalInfo.manager}</p>
            <p><span className="font-medium">Performance:</span> {additionalInfo.performance}</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Current Projects</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {additionalInfo.projects.map((project: string, index: number) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Advanced React Table Component</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Users Table</h2>
          
          {selectedRows.rows.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedRows.rows.length})
            </Button>
          )}
        </div>
        
        <DataTable
          id="users-table"
          headers={columns}
          data={sampleData}
          rowsPerPage={5}
          totalRows={sampleData.length}
          sortable={true}
          stickyHeader={true}
          selection={true}
          striped={true}
          disabledRows={['2', '6']}
          freezeFirstColumn={true}
          withExpandableData={true}
          expandedRowRender={renderExpandedContent}
          onRowSelect={handleRowSelect}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Table Features</h2>
        
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><span className="font-medium">Sortable Columns:</span> Click on column headers to sort data</li>
          <li><span className="font-medium">Row Selection:</span> Select individual rows or all rows at once</li>
          <li><span className="font-medium">Pagination:</span> Navigate through pages of data</li>
          <li><span className="font-medium">Sticky Header:</span> Header remains visible when scrolling</li>
          <li><span className="font-medium">Frozen First Column:</span> First column stays visible when scrolling horizontally</li>
          <li><span className="font-medium">Striped Rows:</span> Alternating row colors for better readability</li>
          <li><span className="font-medium">Disabled Rows:</span> Some rows are disabled (users 2 and 6)</li>
          <li><span className="font-medium">Custom Column Rendering:</span> Status column shows badges</li>
          <li><span className="font-medium">Action Buttons:</span> View and delete actions for each row</li>
          <li><span className="font-medium">Expandable Rows:</span> Click the chevron icon to show additional details</li>
        </ul>
      </div>
    </div>
  );
}
  export default Index;