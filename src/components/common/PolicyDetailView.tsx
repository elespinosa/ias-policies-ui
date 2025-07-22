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
import { FileText, Calendar, User, DollarSign, Tag, Building, Shield, FileType, FileCheck, ClipboardList, Printer, PhilippinePeso } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultCurrency, getClientTypes, getDateHeaders, getMonetaryHeaders, getPaymentTerms, getPolicyTypes, policyStatusMap } from '@/functions/commonLists';
import Modal from '../customUI/Modal';
import { useTranslation } from 'react-i18next';
import { getTranslationKey } from '@/lib/translationUtils';
import { isTranslatableValue } from '@/lib/translationUtils';
import { Icons } from '../customUI/Icons';
import { formatDateOnly } from '@/functions/actions';


interface PolicyDetailData {
  [key: string]: any | null;
}

const PolicyDetailView = ({ 
  policy,
  isOpen, 
  action,
  policyId,
  onClose
}: {
  policy: PolicyDetailData[] | null;
  isOpen: boolean;
  action: (action: string, rowId: string) => void;
  policyId: string;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState('details');
  const [documents, setDocuments] = React.useState<Document[]>([]);
  if (!policy || !policy[0]) return null;

  const policyDetail = policy[0];
  const currency = defaultCurrency(t)["peso"]; // TODO: make this dynamic

  console.log("policyDetail::::>", policyDetail);
  console.log("policyId::::>", policyId);

  const handlePrint = () => {
    window.print();
  };
  

  const formatValue = (key: string, value: any) => {
    // console.log("key::::>", key , '=', value);    
    if (getMonetaryHeaders().includes(key)) {
      return defaultCurrency(t)[currency.id].symbol + Number(value).toLocaleString();
    }
    if (getDateHeaders().includes(key)) {
      return formatDateOnly(value);
    }
    if (key === 'type') {
      // console.log("value::::>", value.toLowerCase());
      return getPolicyTypes(t)[value.toLowerCase()].label;
    }
    if (key === 'client_type') {
      // console.log("value::::>", value.toLowerCase());
      return getClientTypes(t).find(item => item.id === value)?.label;
    }
    if (key === 'payment_terms') {
      console.log("payment_term::::>", value.toLowerCase());
      return getPaymentTerms(t)[value.toLowerCase()].label;
    }
    return value as string;
  };


  const additionalInfo = (
    <Badge variant="outline" className={policyStatusMap[policyDetail.status]?.class || ''}>
      {policyStatusMap[policyDetail.status]?.label || policyDetail.status}
    </Badge>
  );

  const body = (
    <div className="space-y-4">
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">{t('common:details')}</TabsTrigger>
          <TabsTrigger value="coverage">{t('common:coverage')}</TabsTrigger>
          <TabsTrigger value="documents">{t('common:documents')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="space-y-4 mt-4">
            {Object.entries(policyDetail).map(([key, value], index, array) => {
              // Skip rendering if value is undefined or null
              if (!value || typeof value === 'object') return null;
              
              // Create pairs of entries
              if (index % 2 === 0) {
                const nextEntry = array[index + 1];
                
                return (
                  <React.Fragment key={key}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">
                          {t(`headers:${key.toLowerCase()}`)}
                        </h4>
                        <p>
                        {isTranslatableValue('policies.' + key) 
                            ? t(getTranslationKey(value as string)!)
                            : formatValue(key, value) }
                        </p>
                      </div>

                      {nextEntry && (
                        <div>
                          <h4 className="text-sm font-medium capitalize">
                            {t(`headers:${nextEntry[0].toLowerCase()}`)}
                          </h4>
                          <p>
                          {isTranslatableValue('policies.' + nextEntry[0]) 
                            ? t(getTranslationKey(nextEntry[1].toLowerCase() as string)!)
                            : formatValue(nextEntry[0], nextEntry[1]) }
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Add separator if not last pair */}
                    {index < array.length - 2 && <Separator />}
                  </React.Fragment>
                );
              }
              return null;
            })}
            <Separator />
          </div>
        </TabsContent>

        <TabsContent value="coverage">
          <div className="mt-10"></div>
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="mt-10"></div>
          {/* <div className="mt-4">
            <DocumentUpload 
              documents={documents}
              onDocumentAdd={handleAddDocument}
              onDocumentDelete={handleDeleteDocument}
              title={t('common:documents')}
              description={t('pages:quotes.quote_details_description')}
            />
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
                
  const footer = (
    <div className="flex gap-4">
    <Button variant="outline" size="sm" onClick={handlePrint}>
      {Icons('print')}
      {t('rowButtons:print')}
    </Button>
    <Button variant="outline" size="sm" onClick={() => action('#renew', policyId)}>
      {Icons('renew')}
      {t('rowButtons:renew')}
    </Button>
      <Button variant="outline" size="sm" onClick={() => action('#fileClaim', policyId)}>
        {Icons('fileClaim')}
        {t('rowButtons:fileClaim')}
      </Button>
      <Button variant="outline" size="sm" onClick={() => action('#applyPayment', policyId)}>
        {Icons('applyPayment')}
        {t('rowButtons:applyPayment')}
      </Button>
      <Button variant="default" size="sm" onClick={onClose}>
        {t('common:close')}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('policy_details')}
      description={t('policy_no_value', { policyNo: policyDetail.policy_number })}
      additionalInfo={additionalInfo}
      content={body}
      footer={footer}
      // size="lg"
    />
  );
};

export default PolicyDetailView;
