import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { policyStatusMap } from "@/functions/commonLists";
import { cn, formatCurrency } from "@/lib/utils";
import { PolicyDetailI } from "@/services/policyServices";
import {
  Banknote,
  Currency,
  LucideBuilding,
  LucideCalendar,
  LucideClipboardList,
  LucideShield,
  LucideTag,
  LucideUser,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import DocumentCard from "../customUI/DocumentCard";
import { Icons } from "../customUI/Icons";
import Modal from "../customUI/Modal";

const PolicyDetailView = ({
  policy,
  isOpen,
  action,
  policyId,
  onClose,
}: {
  policy: PolicyDetailI[] | null;
  isOpen: boolean;
  action: (action: string, rowId: number) => void;
  policyId: number;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState("details");
  const [documents, setDocuments] = React.useState<Document[]>([]);
  if (!policy || !policy[0]) return null;

  const policyDetail = policy[0];
  const handlePrint = () => {
    window.print();
  };

  const body = (
    <>
      <Tabs
        defaultValue="details"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-3 mb-4">
          <TabsTrigger value="details">{t("common:details")}</TabsTrigger>
          <TabsTrigger value="coverage">{t("common:coverage")}</TabsTrigger>
          <TabsTrigger value="documents">{t("common:documents")}</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium flex items-center">
                <LucideUser className="mr-1.5 h-3.5 text-muted-foreground" />
                {t("common:client")}
              </h4>
              <p className="text-lg font-bold">{policyDetail.client_name}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <LucideBuilding className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("policies:ref_policy_number")}
                </h4>
                <p>{policyDetail.ref_policy_number ?? ""}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <LucideTag className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("common:type")}
                </h4>
                <p>{t(`insuranceTypes:${policyDetail.type}_insurance`)}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <LucideBuilding className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("common:provider")}
                </h4>
                <p>{policyDetail.partner_name}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <LucideUser className="mr-1.5 h-3.5 text-muted-foreground" />
                  {t("common:product_name")}
                </h4>
                <p>{policyDetail.product_name}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <LucideCalendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("common:start_date")}
                </h4>
                <p>{policyDetail.effective_date}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <LucideCalendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("common:end_date")}
                </h4>
                <p>{policyDetail.expiration_date}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Currency className="mr-1.5 h-3.5 text-muted-foreground" />
                  {t("policies:currency")}
                </h4>
                <p>{policyDetail.currency_code}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Banknote className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("policies:currency_rate")}
                </h4>
                <p>{policyDetail.currency_rate}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Currency className="mr-1.5 h-3.5 text-muted-foreground" />
                  {t("headers:premium")}
                </h4>
                <p className="text-lg font-bold">
                  {formatCurrency(policyDetail.premium, {
                    withSymbol: true,
                    currencyCode: policyDetail.currency_code,
                  })}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <LucideCalendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("common:payment_frequency")}
                </h4>
                <p>{t(`paymentFrequency:${policyDetail.payment_frequency}`)}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium flex items-center">
                <LucideClipboardList className="mr-1.5 h-3.5 text-muted-foreground" />
                {t("common:notes")}
              </h4>
              {policyDetail.underwriting_notes ? (
                <p className="w-full">{policyDetail.underwriting_notes}</p>
              ) : (
                <div className="py-2"></div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="coverage">
          <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium flex items-center">
                <LucideUser className="mr-1.5 h-3.5 w.5 text-muted-foreground" />
                {t("common:insured_properties")}
              </h4>
              {policyDetail.insured_properties ? (
                <p>{policyDetail.insured_properties}</p>
              ) : (
                <div className="py-2"></div>
              )}
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <LucideShield className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("common:coverage_amount")}
                </h4>
                <p className="text-lg font-bold">
                  {formatCurrency(policyDetail.coverage, {
                    withSymbol: true,
                    currencyCode: policyDetail.currency_code,
                  })}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium flex items-center">
                  <Currency className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {t("common:deductible")}
                </h4>
                <p>
                  {formatCurrency(policyDetail.deductible, {
                    withSymbol: true,
                    currencyCode: policyDetail.currency_code,
                  })}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-3">
            <DocumentCard documentTitle={"Policy Document"} link={""} />
            <DocumentCard documentTitle={"Business Valuation"} link={""} />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const footer = (
    <>
      <div className="flex gap-2">
        <Button
          className="h-9 rounded-md px-3"
          variant="outline"
          size="sm"
          onClick={handlePrint}
        >
          {Icons("print", "mr-1.5 h-4 w-4")}
          {t("rowButtons:print")}
        </Button>
        <Button
          className="h-9 rounded-md px-3"
          variant="outline"
          size="sm"
          onClick={() => action("#renew", policyId)}
        >
          {t("rowButtons:renew")}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          className="h-9 rounded-md px-3"
          variant="outline"
          size="sm"
          onClick={() => action("#fileClaim", policyId)}
        >
          {Icons("fileClaim", "mr-1.5 h-4 w-4")}
          {t("rowButtons:fileClaim")}
        </Button>
        <Button
          className="h-9 rounded-md px-3"
          variant="outline"
          size="sm"
          onClick={() => action("#applyPayment", policyId)}
        >
          {Icons("applyPayment", "mr-1.5 h-4 w-4")}
          {t("rowButtons:applyPayment")}
        </Button>
        <Button
          className="h-9 rounded-md px-3"
          variant="default"
          size="sm"
          onClick={onClose}
        >
          {t("common:close")}
        </Button>
      </div>
    </>
  );
  const statusMap = policyStatusMap(t);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("policies:policy_details")}
      description={`Policy #${policyDetail.policy_number}`}
      className="sm:max-w-[700px]"
      additionalInfo={
        <div
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-200",
            statusMap[policyDetail.status]?.class ?? ""
          )}
        >
          {t(`status:${policyDetail.status}`)}
        </div>
      }
      content={body}
      footer={footer}
    />
  );
};

export default PolicyDetailView;
