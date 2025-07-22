
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User, DollarSign, Tag, Building, Shield, FileType, FileCheck, ClipboardList, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PolicyViewProps {
  isOpen: boolean;
  onClose: () => void;
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
    coverage?: number;
    deductible?: number;
    beneficiaries?: string[];
    documents?: string[];
    notes?: string;
  } | null;
  onFileClaim?: (policyId: string) => void;
  onApplyPayment?: (policyId: string) => void;
}

const PolicyView: React.FC<PolicyViewProps> = ({ 
  isOpen, 
  onClose, 
  policy,
  onFileClaim,
  onApplyPayment 
}) => {
  if (!policy) return null;

  const statusMap = {
    active: { label: 'Active', class: 'bg-green-100 text-green-800 hover:bg-green-200' },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    expired: { label: 'Expired', class: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    canceled: { label: 'Canceled', class: 'bg-red-100 text-red-800 hover:bg-red-200' },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">Policy Details</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Policy #{policy.number}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={statusMap[policy.status].class}>
              {statusMap[policy.status].label}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Tag className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  Type
                </h4>
                <p>{policy.type}</p>
              </div>
              
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Building className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  Provider
                </h4>
                <p>{policy.provider}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium flex items-center">
                <User className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Client
              </h4>
              <p>{policy.client}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  Start Date
                </h4>
                <p>{policy.startDate}</p>
              </div>
              
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  End Date
                </h4>
                <p>{policy.endDate}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium flex items-center">
                <DollarSign className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Premium
              </h4>
              <p className="text-lg font-bold">${policy.premium.toLocaleString()}</p>
            </div>
            
            {policy.notes && (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium flex items-center">
                    <ClipboardList className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                    Notes
                  </h4>
                  <p className="text-sm">{policy.notes}</p>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="coverage" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Shield className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  Coverage Amount
                </h4>
                <p className="text-lg font-bold">${policy.coverage?.toLocaleString() || 'N/A'}</p>
              </div>
              
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <DollarSign className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  Deductible
                </h4>
                <p>${policy.deductible?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium flex items-center">
                <User className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Beneficiaries
              </h4>
              {policy.beneficiaries && policy.beneficiaries.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {policy.beneficiaries.map((beneficiary, index) => (
                    <li key={index} className="text-sm">{beneficiary}</li>
                  ))}
                </ul>
              ) : (
                <p>No beneficiaries listed</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            {policy.documents && policy.documents.length > 0 ? (
              <div className="space-y-3">
                {policy.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <span>{document}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileCheck className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <FileType className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2">No documents available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-1.5 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              Renew
            </Button>
          </div>
          <div className="flex gap-2">
            {onFileClaim && (
              <Button variant="outline" size="sm" onClick={() => onFileClaim(policy.id)}>
                <FileText className="mr-1.5 h-4 w-4" />
                File Claim
              </Button>
            )}
            {onApplyPayment && (
              <Button variant="outline" size="sm" onClick={() => onApplyPayment(policy.id)}>
                <DollarSign className="mr-1.5 h-4 w-4" />
                Apply Payment
              </Button>
            )}
            <Button variant="default" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyView;
