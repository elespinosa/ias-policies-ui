import DocumentUpload, { Document } from "@/components/common/DocumentUpload";
import { TextArea } from "@/components/customUI/TextArea";
import { TextInput } from "@/components/customUI/TextInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaimData } from "@/interfaces/claim-interfaces";
import { createValidations } from "@/lib/validations";
import { IPolicyType } from "@/services/policyServices";
import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ClaimCreationModalProps {
  isOpen: boolean;
  mode: string;
  data: ClaimData;
  onClose: () => void;
  claimTypes: IPolicyType[];
  onAdd?: (data: ClaimData) => void;
  onEdit?: (data: ClaimData) => void;
}

function mapClaimPolicyHeaders(claim: any) {
  return {
    policy_number: claim.policy_number,
    client_name: claim.client_name,
    plate_number: claim.plate_number,
  };
}

const ClaimCreationModal = ({
  isOpen,
  mode,
  data,
  onClose,
  claimTypes,
  onAdd,
  onEdit,
}: ClaimCreationModalProps) => {
  const { t } = useTranslation();
  const validations = createValidations(t);
  const defaultValues = {
    id: data?.id || "",
    claim_number: data?.claim_number || "",
    policy_number: data?.policy_number || "",
    policy_id: data?.policy_id || "",
    client_id: data?.client_id || "",
    agent_id: data?.agent_id || "",
    claim_type: data?.claim_type || "",
    total_amount_claimed: data?.total_amount_claimed || "",
    incident_date: data?.incident_date
      ? new Date(data.incident_date).toISOString().split("T")[0]
      : "",
    description: data?.description || "",
    report_date: data?.report_date
      ? new Date(data.report_date).toISOString().split("T")[0]
      : "",
    approved_amount: data?.approved_amount || "",
    deductible_applied: data?.deductible_applied || "",
    location: data?.location || "",
    status: data?.status || "pending_info",
    denial_reason: data?.denial_reason || "",
  };

  const methods = useForm<ClaimData>({
    defaultValues,
    mode: "all",
    resetOptions: {
      keepErrors: false,
      keepDirtyValues: false,
    },
  });

  // const [claimPolicyList, setClaimPolicyList] = useState([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const POLICIES_PER_PAGE = 5;
  // const [policySearch, setPolicySearch] = useState("");
  // const [policyPage, setPolicyPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(POLICIES_PER_PAGE);
  // const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
  // const [headers, setHeaders] = useState<
  //   Array<{
  //     id: string;
  //     label: string;
  //     render?: (row: Record<string, unknown>) => React.ReactNode;
  //   }>
  // >([]);
  const [, setRerender] = React.useState(0);
  const onError = () => setRerender((r) => r + 1);

  const {
    formState: { errors, isSubmitted },
    watch,
    handleSubmit,
  } = methods;
  const status = watch("status");

  React.useEffect(() => {
    if (isOpen) {
      methods.reset(defaultValues);
    }
  }, [isOpen, data]);

  // const { data: claimPolicies, isFetched: isClaimPoliciesFetched } =
  //   useClaimPoliciesQuery(policySearch, policyPage, rowsPerPage);

  const handleSelectPolicy = useCallback(
    (policy) => {
      methods.setValue("policy_number", policy.policy_number);
      methods.setValue("policy_id", policy.policy_id);
      methods.setValue("claim_type", policy.claim_type);
    },
    [methods]
  );

  const onSubmit = async (data: ClaimData) => {
    try {
      if (mode === "create" && onAdd) {
        onAdd(data);
      } else if (mode === "edit" && onEdit) {
        onEdit(data);
      }
      methods.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDocumentAdd = (document: Document) => {
    setDocuments((prev) => [...prev, document]);
  };

  const handleDocumentDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const updateHeaders = useCallback(
    (tbheaders) => {
      tbheaders.push({
        id: "actions",
        label: t("claims:headers:actions"),
        render: (row) => {
          return (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSelectPolicy(row)}
            >
              {t("common:select")}
            </Button>
          );
        },
      });

      return tbheaders;
    },
    [t, handleSelectPolicy]
  );

  const displayName = t("claims:create_new_claim");
  const displayDescription = t("claims:create_new_claim_description");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
          <DialogDescription>{displayDescription}</DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            id="claim-form"
            className="space-y-4 m-3"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">
                  {t("claims:claim_details")}
                </TabsTrigger>
                <TabsTrigger value="documents">
                  {t("claims:documents")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="hidden">
                  <Input
                    id="policy_id"
                    type="hidden"
                    value={String(watch("policy_id"))}
                    {...methods.register("policy_id")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="policy_number">
                      {t("claims:fields:policy_number")} *
                    </FormLabel>
                    <TextInput
                      id="policy_number"
                      type="text"
                      readOnly
                      required
                      placeholder={t("claims:fields:select_policy_placeholder")}
                      value={String(watch("policy_number"))}
                      error={errors.policy_number?.message}
                      {...methods.register("policy_number", {
                        ...validations.required(),
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="claim_type">
                      {t("claims:fields:claim_type")} *
                    </FormLabel>
                    <Select
                      value={String(watch("claim_type"))}
                      onValueChange={(v) => methods.setValue("claim_type", v)}
                      disabled
                      required
                    >
                      <SelectTrigger id="claim_type">
                        <SelectValue
                          placeholder={t(
                            "claims:fields:select_claim_type_placeholder"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {claimTypes &&
                          claimTypes.length > 0 &&
                          claimTypes.map((type, index) => {
                            return (
                              <SelectItem key={index} value={type.type}>
                                {t(`claims:types:${type.type}`)}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="incident_date">
                      {t("claims:fields:incident_date")} *
                    </FormLabel>
                    <TextInput
                      id="incident_date"
                      type="date"
                      required
                      value={String(watch("incident_date"))}
                      error={errors.incident_date?.message}
                      {...methods.register("incident_date", {
                        ...validations.required(),
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="reported_date">
                      {t("claims:fields:report_date")} *
                    </FormLabel>
                    <TextInput
                      id="report_date"
                      type="date"
                      required
                      value={String(watch("report_date"))}
                      error={errors.report_date?.message}
                      {...methods.register("report_date", {
                        ...validations.required(),
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="total_amount_claimed">
                      {t("claims:fields:total_amount_claimed")} *
                    </FormLabel>
                    <TextInput
                      id="total_amount_claimed"
                      type="number"
                      required
                      min={0}
                      step={0.01}
                      value={String(watch("total_amount_claimed"))}
                      error={errors.total_amount_claimed?.message}
                      {...methods.register("total_amount_claimed", {
                        ...validations.required(),
                      })}
                      placeholder={t(
                        "claims:fields:total_amount_claimed_placeholder"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="approved_amount">
                      {t("claims:fields:approved_amount")}
                    </FormLabel>
                    <TextInput
                      id="approved_amount"
                      type="number"
                      min={0}
                      step={0.01}
                      value={String(watch("approved_amount"))}
                      {...methods.register("approved_amount")}
                      placeholder={t(
                        "claims:fields:approved_amount_placeholder"
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="deductible_applied">
                      {t("claims:fields:deductible_applied")}
                    </FormLabel>
                    <TextInput
                      id="deductible_applied"
                      type="number"
                      min={0}
                      step={0.01}
                      value={String(watch("deductible_applied"))}
                      {...methods.register("deductible_applied")}
                      placeholder={t(
                        "claims:fields:deductible_applied_placeholder"
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="location">
                    {t("claims:fields:location")}
                  </FormLabel>
                  <TextInput
                    id="location"
                    value={String(watch("location"))}
                    {...methods.register("location", {
                      ...validations.maxLength(255),
                    })}
                    placeholder={t("claims:fields:location_placeholder")}
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="description">
                    {t("claims:fields:description")} *
                  </FormLabel>
                  <TextArea
                    id="description"
                    required
                    value={String(watch("description"))}
                    error={errors.incident_date?.message}
                    {...methods.register("description", {
                      ...validations.required(),
                    })}
                    placeholder={t("claims:fields:description_placeholder")}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <DocumentUpload
                  documents={documents}
                  onDocumentAdd={handleDocumentAdd}
                  onDocumentDelete={handleDocumentDelete}
                  title={t("claims:claim_documents")}
                  description={t("claims:claim_documents_description")}
                  maxHeight="400px"
                />
              </TabsContent>
            </Tabs>
          </form>
        </FormProvider>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common:cancel")}
          </Button>
          <Button type="submit" form="claim-form">
            {t("claims:submit_claim")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimCreationModal;
