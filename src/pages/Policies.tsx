import ClaimCreationModal from "@/components/common/ClaimCreationModal";
import DocumentUpload, { Document } from "@/components/common/DocumentUpload";
import EditPolicyModal from "@/components/common/EditPolicyModal";
import PolicyDetailView from "@/components/common/PolicyDetailView";
import PolicyMetricCards from "@/components/common/PolicyMetricCards";
import PolicyUploadModal from "@/components/common/PolicyUploadModal";
import DataTable from "@/components/customUI/datatable";
import { TableSkeleton } from "@/components/customUI/datatable/TableSkeleton";
import { MetricCardSkeleton } from "@/components/customUI/MetricCardSkeleton";
import { SearchBox } from "@/components/customUI/SearchBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHeaders } from "@/functions/actions";
import { policyStatusMap } from "@/functions/commonLists";
import { useAddClaimMutation } from "@/hooks/mutations/claimsMutations";
import {
  usePolicyDetailQuery,
  usePolicyListingQuery,
  usePolicyMetricsQuery,
  usePolicyProvidersQuery,
  usePolicyStatusQuery,
  usePolicyTypesQuery,
} from "@/hooks/queries/policiesQueries";
import { Claim } from "@/interfaces/claim-interfaces";
import { showToast } from "@/lib/toast";
import { PolicyListing } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { fetchPaymentByPolicy, markPayment } from "@/services/paymentServices";
import {
  cancelPolicy,
  generateCSVExcel,
  getTableOptions,
  getTotalPolicies,
  renewPolicy,
} from "@/services/policyServices";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Download,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Upload,
} from "lucide-react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface EditPaymentDetails {
  payment_id?: number;
  policy_id: number;
  policy_no: string;
  amount?: string;
  reference_no?: string;
  date: string;
  documents?: Array<Document>;
}

const Policies: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [action, setAction] = useState<Array<{ id: string; label: string }>>(
    []
  );
  const [headers, setHeaders] = useState<
    Array<{ id: string; label: string; render?: (row: any) => React.ReactNode }>
  >([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterProvider, setFilterProvider] = useState("");
  const [openPolicyDetail, setOpenPolicyDetail] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const [policyListing, setPolicyListing] = useState<PolicyListing[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [editPaymentTab, setEditPaymentTab] = useState("payment_details");
  const [paymentDetails, setPaymentDetails] =
    useState<EditPaymentDetails>(null);
  const [isCancelPolicyOpen, setIsCancelPolicyOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const [claimAction, setClaimAction] = useState<
    "view" | "edit" | "delete" | "create"
  >("create");
  const [isAddClaimOpen, setIsAddClaimOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyListing | null>(
    null
  );
  const [pendingEditPolicyId, setPendingEditPolicyId] = useState<number | null>(
    null
  );

  const {
    data: policyList,
    isPending: isPolicyListPending,
    isFetched: isPolicyListFetched,
    isError: isPolicyListError,
  } = usePolicyListingQuery(
    searchValue,
    status,
    filterProvider,
    currentPage,
    rowsPerPage
  );

  const {
    data: policyStatusList,
    isPending: isPolicyStatusPending,
    isError: isPolicyStatusError,
  } = usePolicyStatusQuery();

  const {
    data: policyMetrics,
    isPending: isPolicyMetricsPending,
    isError: isPolicyMetricsError,
  } = usePolicyMetricsQuery();

  const {
    data: policyProviders,
    isPending: isPolicyProvidersPending,
    isError: isPolicyProvidersError,
  } = usePolicyProvidersQuery();

  const { data: policyDetail } = usePolicyDetailQuery(selectedPolicyId);
  const { data: policyTypes } = usePolicyTypesQuery();

  const updateHeaders = useCallback(
    (headers) => {
      const updatedHeaders = headers.map((col) =>
        col.id === "status"
          ? {
              ...col,
              render: (row) => {
                const status = row.status;
                const statusMap = policyStatusMap(t);
                return (
                  <Badge
                    variant="outline"
                    className={statusMap[status]?.class ?? ""}
                  >
                    {statusMap[status]?.label ?? status}
                  </Badge>
                );
              },
            }
          : col.id === "type"
          ? {
              ...col,
              render: (row) => {
                return <div>{t(`policyTypes:${row.type}`)}</div>;
              },
            }
          : col
      );
      return updatedHeaders;
    },
    [policyStatusMap, t]
  );

  const prepareTableDataForList = (dataList: PolicyListing[]) => {
    const moneyColumns = ["premium"];
    const excludedColumns = ["currency_code"];
    const data = dataList?.map((el) => {
      const clonedData = { ...el };
      for (const column of moneyColumns) {
        const value = clonedData[column];
        if (value) {
          clonedData[column] = formatCurrency(value, {
            withSymbol: true,
            currencyCode: clonedData.currency_code,
          });
        }
      }

      for (const column of excludedColumns) {
        delete clonedData[column];
      }

      return clonedData;
    });

    return data;
  };

  // Process data from the query when it's fetched
  useEffect(() => {
    let isMounted = true;
    if (isPolicyListFetched && policyList && isMounted) {
      const dataToDisplay = prepareTableDataForList(policyList);
      const tempHeaders = getHeaders(dataToDisplay, t);
      const tempActions = getTableOptions(t);
      setHeaders(updateHeaders(tempHeaders));
      setTotalRows(getTotalPolicies(dataToDisplay));
      setPolicyListing(dataToDisplay);
      setAction(tempActions.actions);
    }

    return () => {
      isMounted = false;
    };
  }, [isPolicyListFetched, policyList, updateHeaders]);

  // Handle automatic opening of edit modal when policy detail data becomes available
  useEffect(() => {
    if (pendingEditPolicyId && policyDetail && policyDetail.length > 0) {
      // setSelectedPolicy(policyDetail[0]);
      setIsEditModalOpen(true);
      setPendingEditPolicyId(null);
    }
  }, [pendingEditPolicyId, policyDetail]);

  // Fallback: if policy detail query takes too long, use policyList data
  useEffect(() => {
    if (pendingEditPolicyId && policyList) {
      const timeoutId = setTimeout(() => {
        if (pendingEditPolicyId) {
          const policy = policyList.find((p) => p.id === pendingEditPolicyId);
          if (policy) {
            setSelectedPolicy(policy);
            setIsEditModalOpen(true);
            setPendingEditPolicyId(null);
          }
        }
      }, 2000); // Wait 2 seconds for the query to complete

      return () => clearTimeout(timeoutId);
    }
  }, [pendingEditPolicyId, policyList]);

  const handleClosePolicyDetail = () => {
    setOpenPolicyDetail(false);
    setSelectedPolicyId(null);
    setPendingEditPolicyId(null);
    setSelectedPolicy(null);
  };

  const handleRowAction = (action: string, rowId: string | number) => {
    let policyId = typeof rowId === "string" ? Number.parseInt(rowId) : rowId;
    setSelectedPolicyId(policyId);
    // Handle different actions based on the action type
    switch (action) {
      case "#edit":
        handleEdit(policyId);
        break;
      case "#view":
        setOpenPolicyDetail(true);
        break;
      case "#renew":
        handleRenew(policyId);
        break;
      case "#fileClaim":
        handleFileClaim(policyId);
        break;
      case "#applyPayment":
        handleApplyPayment(policyId);
        break;
      case "#cancel":
        handleCancel(policyId);
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const handleEdit = (policyId: number) => {
    // Set the pending edit policy ID to trigger the useEffect when data becomes available
    setPendingEditPolicyId(policyId);
  };

  const handleRenew = async (policyId: number) => {
    await renewPolicy(policyId);
    showToast(
      t("renewals:status_updated_description", {
        status: t("renewals:for_renewal"),
      })
    );
  };

  const handleFileClaim = (policyId: number) => {
    const policyDetail = policyList.find((p) => p.id === policyId);
    if (policyDetail) {
      setSelectedClaim({
        policy_id: policyDetail.id,
        policy_number: policyDetail.policy_number,
        claim_type: policyDetail.type,
      });
    }

    setIsAddClaimOpen(true);
    setClaimAction("create");
  };

  const handleApplyPayment = async (policyId: number) => {
    const payments = await fetchPaymentByPolicy(policyId);

    let payment = payments.find(
      (p) => p.status.toLocaleLowerCase() === "current"
    );

    if (!payment && payments.length > 0) {
      payment = payments[0];
    } else if (!payment && payments.length === 0) {
      const policyDetail = policyList.find((p) => p.id === policyId);
      if (!policyDetail) return;

      payment = {
        policy_id: policyDetail.id,
        payment_id: null,
        policy_number: policyDetail.policy_number,
        client: policyDetail.client,
        provider: policyDetail.provider,
        type: policyDetail.type,
        premium: policyDetail.premium,
        status: "current",
        reference_no: null,
        due_date: null,
        date: null,
      };
    }

    setPaymentDetails({
      payment_id: payment.payment_id,
      policy_id: payment.policy_id,
      policy_no: payment["policy_#"],
      reference_no: payment.reference_no,
      date: payment.date,
      documents: [
        {
          id: "id",
          name: "name",
          type: "pdf",
          size: 100000,
          dateUploaded: "2025-01-01",
          url: "https://www.google.com",
        },
      ],
    });

    setIsEditPaymentOpen(true);
  };

  const handleCancel = async (policyId: number) => {
    const policy = policyList.find((p) => p.id === policyId);
    if (policy) {
      setSelectedPolicy(policy);
      setIsCancelPolicyOpen(true);
    }
  };

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      setCurrentPage(1); // Reset page when search term changes
    },
    [setSearchValue, setCurrentPage]
  );

  const handleSelectProvider = useCallback(
    (value: string) => {
      if (value === "all") {
        setFilterProvider("");
      } else {
        setFilterProvider(value);
      }
      setCurrentPage(1); // Reset page when search term changes
    },
    [setFilterProvider, setCurrentPage]
  );

  const handleStatusChange = (value: string) => {
    setCurrentPage(1); // Reset page when status changes
    if (value !== "all") {
      const selectedStatus = policyStatusList.find(
        (status) => status.id === value
      );
      if (selectedStatus) {
        setStatus(selectedStatus.id);
      }
    } else {
      setStatus("");
    }
  };
  const addClaimMutation = useAddClaimMutation();

  const handleAddClaim = (data: Claim) => {
    addClaimMutation.mutate(data, {
      onSuccess: () => {
        showToast(t("common:claim_added_success"));
        setIsAddClaimOpen(false);
        return true;
      },
      onError: (error: any) => {
        showToast(error.message || t("common:error"), "error");
        return false;
      },
    });
  };

  const markAsPaid = async () => {
    if (paymentDetails?.payment_id) {
      await markPayment(
        paymentDetails.payment_id,
        "for_remittance",
        paymentDetails.reference_no
      );
    }

    setIsEditPaymentOpen(false);
  };

  const handleCancelPolicy = async () => {
    if (selectedPolicy) {
      if (!cancellationReason) {
        showToast(t("policies:cancellation_reason_required"), "error");
        return;
      }

      await cancelPolicy(selectedPolicy.id, cancellationReason);
      showToast(t("policies:policy_cancelled"));
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({
        queryKey: ["policyDetail", selectedPolicy.id],
      });
      queryClient.invalidateQueries({ queryKey: ["policiesMetrics"] });
    }
    setCancellationReason("");
    setSelectedPolicy(null);
    setIsCancelPolicyOpen(false);
  };

  const handleCsvExcelDownload = async (type: String) => {
    try {
      showToast(
        t("policies:toast.exporting.description", {
          type: type === "xlsx" ? "EXCEL" : "CSV",
        })
      );

      const endpoint = `get-all-policies?p_search=${encodeURIComponent(
        searchValue || ""
      )}&p_status=${encodeURIComponent(
        status || ""
      )}&p_partner_id=${encodeURIComponent(filterProvider || "")}`;

      const blob = await generateCSVExcel(type, endpoint);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `policies.${type}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(
        t("policies:toast.success_exporting.description", {
          type: type === "xlsx" ? "EXCEL" : "CSV",
        })
      );
    } catch (e) {
      showToast(t("policies:toast.error_exporting.description"), "error");
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">{t("common:policies")}</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <MoreHorizontal className="h-4 w-4" />
                {t("common:actions")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                {t("common:upload_policies")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCsvExcelDownload("csv")}>
                <Download className="mr-2 h-4 w-4" />
                {t("common:download_policies")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("policies:new_policy")}
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
          {t("pages:policies.error_loading_metrics")}
        </div>
      ) : (
        <PolicyMetricCards metrics={policyMetrics} namespace="metrics" />
      )}

      {/* <div className="flex flex-col items-start gap-4 md:flex-row md:items-end"> */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">{t("common:search")}</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchBox
                placeholder={t("pages:policies.search_placeholder")}
                searchFunction={handleSearch}
                value={searchValue}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-[150px] space-y-2">
            <label className="text-sm font-medium">{t("common:status")}</label>
            {isPolicyStatusPending ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : isPolicyStatusError ? (
              <div className="p-4 text-center text-red-500">
                {t("pages:policies.error_loading_policy_status")}
              </div>
            ) : (
              <Select
                value={status}
                onValueChange={(value) => handleStatusChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("status:all_status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("status:all_status")}</SelectItem>
                  {policyStatusList &&
                    policyStatusList.length > 0 &&
                    policyStatusList.map((status, colIndex) => (
                      <SelectItem key={colIndex} value={status.id}>
                        {t(`status:${status.id}`)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="w-[180px] space-y-2">
            <label className="text-sm font-medium">
              {t("common:provider")}
            </label>
            {isPolicyProvidersPending ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : isPolicyProvidersError ? (
              <div className="p-4 text-center text-red-500">
                {t("pages:policies.error_loading_providers")}
              </div>
            ) : (
              <Select
                value={filterProvider}
                onValueChange={handleSelectProvider}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("common:all_providers")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("common:all_providers")}
                  </SelectItem>
                  {policyProviders &&
                    policyProviders.length > 0 &&
                    policyProviders.map((provider, colIndex) => (
                      <SelectItem key={colIndex} value={provider.partner_id}>
                        {provider.partner_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isPolicyListPending
            ? t("common:loading_policies")
            : t("common:records_found", { count: totalRows ?? 0 })}
        </p>
      </div>

      <div className="animate-fade-in">
        {isPolicyListPending ? (
          <TableSkeleton columns={5} rows={10} />
        ) : isPolicyListError ? (
          <div className="p-4 text-center text-red-500">
            {t("pages:policies.error_loading_policies")}
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
            // stickyHeader={true}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            currentPage={currentPage}
            showRowsPerPage={true}
            onRowsPerPageChange={(row) => setRowsPerPage(row)}
          />
        )}
      </div>

      {policyListing.length === 0 && (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            {t("common:no_policies_found")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("common:no_items_found_description")}
          </p>
        </div>
      )}

      <PolicyDetailView
        policy={policyDetail}
        isOpen={openPolicyDetail}
        action={handleRowAction}
        policyId={selectedPolicyId}
        onClose={handleClosePolicyDetail}
      />

      <PolicyUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <EditPolicyModal
        policyArr={policyDetail}
        isOpen={isEditModalOpen || isCreateModalOpen}
        type={isEditModalOpen ? "edit" : isCreateModalOpen ? "create" : ""}
        policyTypes={policyTypes || []}
        onClose={(fn: () => void) => {
          setIsEditModalOpen(false);
          setIsCreateModalOpen(false);
          setPendingEditPolicyId(null);
          setSelectedPolicyId(null);
          setSelectedPolicy(null);
          fn();
        }}
      />

      {/* Edit Payment Dialog */}
      <Dialog open={isEditPaymentOpen} onOpenChange={setIsEditPaymentOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t(`payments:mark_as_collected`)}</DialogTitle>
            <DialogDescription>
              {t(`payments:mark_as_collected_description`)}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <Tabs
              defaultValue="payment_details"
              className="w-full"
              value={editPaymentTab}
              onValueChange={setEditPaymentTab}
            >
              <TabsList className={`grid w-full md:w-auto grid-cols-2 h-auto`}>
                <TabsTrigger value={"payment_details"}>
                  {t(`payments:payment_details`)}
                </TabsTrigger>
                <TabsTrigger value={"documents"}>
                  {t(`payments:documents`)}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="grid space-y-4 mt-4">
              {editPaymentTab === "payment_details" ? (
                <Fragment>
                  <div className="space-y-2">
                    <Label htmlFor="edit-amount" className="text-left">
                      {t("payments:amount")}
                    </Label>
                    <div className="items-center gap-4">
                      <Input
                        id="edit-amount"
                        placeholder={t("payments:amount_placeholder")}
                        value={paymentDetails?.amount || ""}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            amount: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-reference-no" className="text-left">
                      {t("payments:reference_number")}
                    </Label>
                    <div className="items-center gap-4">
                      <Input
                        id="edit-reference-no"
                        placeholder={t("payments:reference_number_placeholder")}
                        value={paymentDetails?.reference_no || ""}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            reference_no: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-date" className="text-left">
                      {t("payments:date")}
                    </Label>
                    <div className="items-center gap-4">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="edit-date"
                          type="date"
                          value={
                            paymentDetails?.date ? paymentDetails.date : ""
                          }
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              date: e.target.value,
                            })
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="col-span-3">
                    <DocumentUpload
                      documents={paymentDetails?.documents || []}
                      onDocumentAdd={(document) => {
                        setPaymentDetails({
                          ...paymentDetails,
                          documents: [
                            ...(paymentDetails?.documents || []),
                            document,
                          ],
                        });
                      }}
                      onDocumentDelete={(documentId) => {
                        setPaymentDetails({
                          ...paymentDetails,
                          documents: (paymentDetails?.documents || []).filter(
                            (doc) => doc.id !== documentId
                          ),
                        });
                      }}
                      title={t("payments:payment_documents")}
                      description={t("payments:payment_documents_description")}
                    />
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditPaymentOpen(false)}
            >
              {t("common:cancel")}
            </Button>
            <Button onClick={markAsPaid}>
              {t("payments:mark_as_collected")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClaimCreationModal
        isOpen={isAddClaimOpen}
        mode={claimAction}
        onClose={() => {
          setIsAddClaimOpen(false);
          setClaimAction("create");
          // setClaimId(null);
        }}
        claimTypes={policyTypes || []}
        data={selectedClaim}
        onAdd={handleAddClaim}
      />

      <Dialog open={isCancelPolicyOpen} onOpenChange={setIsCancelPolicyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(`policies:cancel_policy`)}</DialogTitle>
            <DialogDescription>
              {t(`policies:cancel_policy_description`, {
                policyNo: selectedPolicy?.policy_number,
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <div className="space-y-2">
              <Label htmlFor="edit-reference-no" className="text-left">
                {t("policies:cancellation_reason")}
              </Label>
              <div className="items-center gap-4">
                <Input
                  id="edit-reference-no"
                  placeholder={t("policies:cancellation_reason_placeholder")}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelPolicyOpen(false);
                setCancellationReason("");
              }}
            >
              {t("common:close")}
            </Button>

            <Button variant="destructive" onClick={handleCancelPolicy}>
              {t("policies:cancel_policy")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Policies;
