
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, MoreVertical, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface PolicyCardProps {
  policy: {
    id: string;
    number: string;
    type: string;
    provider: string;
    client: string;
    status: 'active' | 'pending' | 'expired' | 'canceled';
    startDate: string;
    endDate: string;
    premium: number;
  };
  className?: string;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, className }) => {
  const statusMap = {
    active: { label: 'Active', class: 'bg-green-100 text-green-800 hover:bg-green-200' },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    expired: { label: 'Expired', class: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    canceled: { label: 'Canceled', class: 'bg-red-100 text-red-800 hover:bg-red-200' },
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1.5 bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-medium">{policy.type}</CardTitle>
          </div>
          <Badge variant="outline" className={statusMap[policy.status].class}>
            {statusMap[policy.status].label}
          </Badge>
        </div>
        <CardDescription className="text-xs mt-1">
          Policy #{policy.number}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1.5">
          <p className="text-sm"><span className="text-muted-foreground">Client:</span> {policy.client}</p>
          <p className="text-sm flex items-center gap-1">
            <span className="text-muted-foreground">Provider:</span> 
            <span className="flex items-center gap-1">
              <Building className="h-3 w-3 text-muted-foreground" /> 
              {policy.provider}
            </span>
          </p>
          <p className="text-sm"><span className="text-muted-foreground">Period:</span> {policy.startDate} - {policy.endDate}</p>
          <p className="text-sm font-medium">Premium: ${policy.premium.toLocaleString()}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs h-8">
          View Details
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Renew</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default PolicyCard;
