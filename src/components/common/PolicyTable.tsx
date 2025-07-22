
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, MoreHorizontal, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface PolicyTableProps {
  policies: {
    id: string;
    number: string;
    type: string;
    provider: string;
    client: string;
    status: 'active' | 'pending' | 'expired' | 'canceled';
    startDate: string;
    endDate: string;
    premium: number;
  }[];
  onViewPolicy: (policyId: string) => void;
  onFileClaim?: (policyId: string) => void;
  onApplyPayment?: (policyId: string) => void;
}

const PolicyTable: React.FC<PolicyTableProps> = ({ 
  policies, 
  onViewPolicy, 
  onFileClaim,
  onApplyPayment
}) => {
  const statusMap = {
    active: { label: 'Active', class: 'bg-green-100 text-green-800 hover:bg-green-200' },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    expired: { label: 'Expired', class: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    canceled: { label: 'Canceled', class: 'bg-red-100 text-red-800 hover:bg-red-200' },
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy #</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.number}</TableCell>
              <TableCell>{policy.type}</TableCell>
              <TableCell>{policy.provider}</TableCell>
              <TableCell>{policy.client}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusMap[policy.status].class}>
                  {statusMap[policy.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{policy.startDate} - {policy.endDate}</TableCell>
              <TableCell>${policy.premium.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => onViewPolicy(policy.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View policy</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Renew</DropdownMenuItem>
                      {onFileClaim && (
                        <DropdownMenuItem onClick={() => onFileClaim(policy.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          File Claim
                        </DropdownMenuItem>
                      )}
                      {onApplyPayment && (
                        <DropdownMenuItem onClick={() => onApplyPayment(policy.id)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Apply Payment
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PolicyTable;
