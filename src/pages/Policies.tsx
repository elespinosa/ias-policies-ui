import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, FileText, Table as TableIcon, Upload, Download, MoreHorizontal, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PolicyCard from '@/components/common/PolicyCard';
import PolicyTable from '@/components/common/PolicyTable';
import PolicyView from '@/components/common/PolicyView';
import PolicyUploadModal from '@/components/common/PolicyUploadModal';
import PolicyCreationModal from '@/components/common/PolicyCreationModal';
import MetricCard from '@/components/customUI/MetricCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { getTableOptions, getTotalPolicies } from '@/services/policyServices';
import { PolicyListing } from '@/lib/types';
import { SearchBox } from '@/components/customUI/SearchBox';
import DataTable from '@/components/customUI/datatable';
import { getHeaders } from '@/functions/actions';
import { TableSkeleton } from '@/components/customUI/datatable/TableSkeleton';
import { MetricCardSkeleton } from '@/components/customUI/MetricCardSkeleton';
import { Badge } from '@/components/ui/badge';
import { policyStatusMap } from '@/functions/commonLists';
import PolicyDetailView from '@/components/common/PolicyDetailView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePolicyDetailQuery, usePolicyListingQuery, usePolicyMetricsQuery, usePolicyProvidersQuery, usePolicyStatusQuery } from '@/hooks/queries/policiesQueries';
import PolicyMetricCards from '@/components/common/PolicyMetricCards';



const Policies: React.FC = () => {
  const [action, setAction] = useState<Array<{id: string, label: string}>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProvider, setFilterProvider] = useState('');
  const [headers, setHeaders] = useState<Array<{id: string, label: string, render?: (row: any) => React.ReactNode}>>([]);
  const [openPolicyDetail, setOpenPolicyDetail] = useState(false);
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [policyListing, setPolicyListing] = useState<PolicyListing[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedPolicy, setSelectedPolicy] = useState<typeof policyListing[0] | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPolicyForAction, setSelectedPolicyForAction] = useState<string | null>(null);
  
  const {data: policyList, isPending: isPolicyListPending, isFetched: isPolicyListFetched, isError: isPolicyListError } = usePolicyListingQuery(searchValue, status, filterProvider, currentPage, rowsPerPage);
  const {data: policyStatusList} = usePolicyStatusQuery();
  const {data: policyDetail} = usePolicyDetailQuery(policyId);
  const {data: policyMetrics, isPending: isPolicyMetricsPending, isError: isPolicyMetricsError } = usePolicyMetricsQuery();
  const {data: policyProviders, isPending: isPolicyProvidersPending, isError: isPolicyProvidersError } = usePolicyProvidersQuery();

  const updateHeaders = useCallback((headers) => {  
    console.log("headers", headers);
    const updatedHeaders = headers.map((col) =>
      col.id === "status"
        ? {
            ...col,
            render: (row) => {
              const status = row.status;   
              const statusMap = policyStatusMap(t);
              return (
                <Badge variant="outline" className={statusMap[status]?.class ?? ''}>
                  {statusMap[status]?.label ?? status}
                </Badge>
              );
            }
          }
        :  col.id === "type"
        ? {
            ...col,
            render: (row) => {
              return (
                <div>
                  {t(`policyTypes:${row.type}`)}
                </div>
              );
            }
          }
        :col
    );
    return updatedHeaders;
  }, [policyStatusMap, t]);

  
  // Process data from the query when it's fetched
  useEffect(() => {
    let isMounted = true;

    if (isPolicyListFetched && policyList && isMounted) {
      const tempHeaders = getHeaders(policyList, t);
      const tempActions = getTableOptions(t);
      setHeaders(updateHeaders(tempHeaders));
      setTotalRows(getTotalPolicies(policyList));
      setPolicyListing(policyList);      
      setAction(tempActions.actions);
    }

    return () => {
      isMounted = false;
    };
  }, [isPolicyListFetched, policyList, updateHeaders]);

  // useEffect(() => {
  //   let isMounted = true;

  //   if (isPolicyDetailFetched && policyDetail && isMounted) {
  //     setOpenPolicyDetail(true);
  //   }

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [isPolicyDetailFetched, policyDetail]);



  const handleClosePolicyDetail = () => {
    setOpenPolicyDetail(false);
    setPolicyId(null);
  }

  const handleRowAction = (action: string, rowId: string) => {
    // console.log("Action triggered:", action, "for policy:", rowId);
    
    // Handle different actions based on the action type
    switch (action) {
      case "#view":
        setPolicyId(rowId);
        setOpenPolicyDetail(true);
        break;
      case "#renew":
        handleRenew(rowId);
        break;
      case "#fileClaim":
        handleFileClaim(rowId);
        break;
      case "#applyPayment":
        handleApplyPayment(rowId);
        break;
      default:
        console.log("Unknown action:", action);
    }
  }

  const handleRenew = (policyId: string) => {
    console.log("Renewing policy:", policyId);
    setSelectedPolicyForAction(policyId);
    // setIsRenewModalOpen(true);
  };

  const handleFileClaim = (policyId: string) => {
    setSelectedPolicyForAction(policyId);
    setIsClaimModalOpen(true);
  };

  const handleApplyPayment = (policyId: string) => {
    setSelectedPolicyForAction(policyId);
    setIsPaymentModalOpen(true);
  };
  
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset page when search term changes
  }, [setSearchValue, setCurrentPage]);


  const handleSelectProvider = useCallback((value: string) => {
    if (value === "all") {
      setFilterProvider("");
    } else {
      setFilterProvider(value);
    }
    setCurrentPage(1); // Reset page when search term changes
  }, [setFilterProvider, setCurrentPage]);
  
  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset page when status changes
    if (value !== "all") {
      const selectedStatus = policyStatusList.find(status => status.description === value);
      if (selectedStatus) {
        setStatus(selectedStatus.description);
      }
    } else {
      setStatus("");
    }
  };

  const downloadTemplate = (format: 'csv' | 'xlsx') => {
    toast({
      title: 'Template Downloaded',
      description: `Policy template in ${format.toUpperCase()} format has been downloaded.`,
    });
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{t('common:policies')}</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <MoreHorizontal className="h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Legacy Policies
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadTemplate('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadTemplate('xlsx')}>
                <Download className="mr-2 h-4 w-4" />
                Download XLSX Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      {isPolicyMetricsPending ? (
        <>
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </>
      ) : isPolicyMetricsError ? (
        <div className="col-span-3 p-4 text-center text-red-500">
          {t('pages:policies.error_loading_metrics')}
        </div>
      ) : (        
        <PolicyMetricCards 
          metrics={policyMetrics}
          namespace="metrics"
        />
      )}
      
      {/* <div className="flex flex-col items-start gap-4 md:flex-row md:items-end"> */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">{t('common:search')}</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchBox
                placeholder={t('pages:policies.search_placeholder')}
                searchFunction={handleSearch}
                value={searchValue}
              />
            </div>
          </div>
        </div>
        
        <div className="flex  gap-2">          
          <div className="w-full sm:w-[250px] md:w-[300px] space-y-2">
            <label className="text-sm font-medium">{t('common:provider')}</label>
            {isPolicyProvidersPending ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : isPolicyProvidersError ? (
              <div className="p-4 text-center text-red-500">
                {t('pages:policies.error_loading_providers')}
              </div>
            ) : (
            <Select value={filterProvider} onValueChange={handleSelectProvider}>
              <SelectTrigger>
                <SelectValue placeholder={t('common:all_providers')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common:all_providers')}</SelectItem>
                {policyProviders && policyProviders.length > 0 && 
                  policyProviders.map((provider, colIndex) => (
                    <SelectItem key={colIndex} value={provider.partner_id}>{provider.partner_name}</SelectItem>
                  ))
                }
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <div className="w-full border-b">
        <Tabs value={filterStatus} defaultValue="all">
          <TabsList className={`grid w-full grid-cols-${policyStatusList?.length + 1 || 4} max-w-3xl`}>
            <TabsTrigger value="all" onClick={() => handleStatusChange('all')}>
              {t('common:all')}
            </TabsTrigger>
            {policyStatusList && policyStatusList.length > 0 && 
              policyStatusList.map((polStatus, colIndex) => (
                <TabsTrigger
                  key={colIndex}
                  value={polStatus.description}
                  onClick={() => handleStatusChange(polStatus.description)}
                >
                  {polStatus.description}
                </TabsTrigger>
              ))
            }
          </TabsList>
        </Tabs>
      </div>
      

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isPolicyListPending ? t('common:loading_policies') :          
            t('common:records_found', { count: totalRows ?? 0 })}
        </p>
      </div>
      
      <div className="animate-fade-in">
        {isPolicyListPending ? (
          <TableSkeleton columns={5} rows={10}/>
        ) : isPolicyListError ? (
          <div className="p-4 text-center text-red-500">
            {t('pages:policies.error_loading_policies')}
          </div>
        ) : (
          <DataTable
            id="policyListing-table"
            freezeFirstColumn={true}
            headers={headers}
            data={policyListing}
            rowActions={action}
            onRowAction={handleRowAction}
            totalRows={totalRows}
            sortable={true}
            stickyHeader={true}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            currentPage={currentPage}
            showRowsPerPage={true}
            onRowsPerPageChange={row => setRowsPerPage(row)}
          />
        )}
      </div>
          
      {policyListing.length === 0 && (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t('common:no_policies_found')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('common:no_items_found_description')}
          </p>
        </div>
      )}


      <PolicyDetailView
        policy={policyDetail}
        isOpen={openPolicyDetail}
        action={handleRowAction}
        policyId={policyId}
        onClose={handleClosePolicyDetail}
      />

      <PolicyUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <PolicyCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* This section is for the claim and payment modals and will be revised later */}

      <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Claim</DialogTitle>
            <DialogDescription>
              File a new claim for policy {selectedPolicyForAction}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClaimModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsClaimModalOpen(false)}>
              Submit Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Payment</DialogTitle>
            <DialogDescription>
              Apply payment for policy {selectedPolicyForAction}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPaymentModalOpen(false)}>
              Submit Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Policies;
