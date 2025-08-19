import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePolicyProductsByTypeQuery } from "@/hooks/queries/policiesQueries";
import { toast } from "@/hooks/use-toast";
import {
  IPolicyType,
  updatePolicy,
  updatePolicyDetailsI,
} from "@/services/policyServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

interface PolicyDetailData {
  [key: string]: any | null;
}

interface EditPolicyModalProps {
  policyArr: PolicyDetailData[] | null;
  isOpen: boolean;
  policyTypes: IPolicyType[];
  onClose: (fn: () => void) => void;
}

// Policy creation form schema
const policyFormSchema = z.object({
  policyNumber: z.string().min(1, { message: "Policy number is required" }),
  type: z.string().min(1, { message: "Insurance type is required" }),
  provider: z.string().min(1, { message: "Provider is required" }),
  clientName: z.string().min(1, { message: "Client name is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  premium: z.coerce
    .number()
    .positive({ message: "Premium must be a positive number" }),
  coverage: z.coerce
    .number()
    .positive({ message: "Coverage must be a positive number" }),
  deductible: z.coerce
    .number()
    .nonnegative({ message: "Deductible must be zero or positive" }),
  beneficiaries: z.string().optional(),
  notes: z.string().optional(),
  sendEmailNotification: z.boolean().default(true),
});

type PolicyFormValues = z.infer<typeof policyFormSchema>;

interface IProviders {
  providerId: number;
  provider: string;
}

const EditPolicyModal: React.FC<EditPolicyModalProps> = ({
  policyArr,
  policyTypes,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [policyType, setPolicyType] = useState<string | null>();
  const [providers, setProviders] = useState<IProviders[]>([]);
  const [isPopulated, setIsPopulated] = useState(false);

  const {
    data: policyProducts,
    isPending: isPolicyProductsPending,
    isError: isPolicyProductsError,
  } = usePolicyProductsByTypeQuery(policyType);

  useEffect(() => {
    const providersArr: IProviders[] = [];
    if (!isPolicyProductsPending && !isPolicyProductsError) {
      for (let i = 0; i < policyProducts.length; i++) {
        const product = policyProducts[i];
        const providerIndex = providersArr.findIndex(
          (el) => el.providerId === product.providerId
        );

        if (providerIndex === -1) {
          providersArr.push({
            providerId: product.providerId,
            provider: product.provider,
          });
        }
      }
    }
    setProviders(providersArr);
  }, [policyProducts]);

  const policyDetail = !policyArr ? null : policyArr[0];

  // Initialize form with default values
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      policyNumber: "",
      type: "",
      provider: "",
      clientName: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      premium: 0,
      coverage: 0,
      deductible: 0,
      beneficiaries: "",
      notes: "",
      sendEmailNotification: true,
    },
  });

  useEffect(() => {
    if (
      isPopulated &&
      policyDetail &&
      policyDetail.policy_number !== form.getValues()["policyNumber"]
    ) {
      setIsPopulated(false);
    }
  }, [isPopulated, policyDetail, form, isOpen]);

  useEffect(() => {
    if (isOpen && policyDetail && !isPopulated) {
      form.setValue("policyNumber", policyDetail.policy_number);
      form.setValue("type", policyDetail.type);
      form.setValue("clientName", policyDetail.client_name);
      form.setValue("provider", String(policyDetail.partner_id));
      form.setValue("startDate", policyDetail.start_date);
      form.setValue("endDate", policyDetail.end_date);
      form.setValue("premium", policyDetail.premium);
      form.setValue("coverage", policyDetail.coverage);
      form.setValue("deductible", policyDetail.deductible);
      form.setValue("beneficiaries", policyDetail.beneficiaries || "");
      form.setValue("notes", policyDetail.notes || "");
      setIsPopulated(true);
    }
  }, [policyDetail, isPopulated, form, isOpen]);

  const onSubmit = async (data: PolicyFormValues) => {
    const updatedPolicyDetails: updatePolicyDetailsI = {
      startDate: data.startDate,
      endDate: data.endDate,
      premium: data.premium,
      coverage: data.coverage,
      deductible: data.deductible,
      beneficiaries: data.beneficiaries,
      notes: data.notes,
    };

    if (policyDetail) {
      await updatePolicy(policyDetail.policy_id, updatedPolicyDetails);
      queryClient.invalidateQueries({
        queryKey: ["policyDetail", policyDetail.policy_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["policies"],
      });
    }

    toast({
      title: "Policy updated successfully",
      description: `Policy ${data.policyNumber} has been updated for ${data.clientName}.`,
    });

    onClose(() => {
      setIsPopulated(false);
      form.reset();
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose(() => {
          setIsPopulated(false);
          form.reset();
        });
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("policies:edit_policy")}</DialogTitle>
          <DialogDescription>
            {t("policies:edit_policy_subtitle")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:policy_number")}</FormLabel>
                      <FormControl>
                        <Input placeholder="POL-12345" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:insurance_type")}</FormLabel>
                      <Select
                        disabled
                        value={field.value}
                        onValueChange={(event) => {
                          field.onChange(event);
                          setPolicyType(event);
                          form.setValue("provider", null);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {policyTypes.map((policyType, index) => (
                            <SelectItem value={policyType.type} key={index}>
                              {t(`insuranceTypes:${policyType.type}_insurance`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:insurance_provider")}</FormLabel>
                      <Select
                        disabled
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "policies:insurance_provider_placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!isPolicyProductsPending &&
                          !isPolicyProductsError &&
                          !providers != null
                            ? providers.map((provider, index) => (
                                <SelectItem
                                  value={`${provider.providerId}`}
                                  key={index}
                                >
                                  {provider.provider}
                                </SelectItem>
                              ))
                            : ""}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:client_name")}</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          placeholder={t("policies:client_name_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:start_date")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:end_date")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="premium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:premium")} ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("policies:premium_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:coverage_amount")} ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t(
                            "policies:coverage_amount_placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deductible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("policies:deductible")} ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("policies:deductible_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="beneficiaries"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("policies:insured_properties")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "policies:insured_properties_placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("policies:insured_properties_description")}{" "}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("policies:notes")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("policies:notes_placeholder")}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendEmailNotification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {t("policies:email_notification")}
                        </FormLabel>
                        <FormDescription>
                          {t("policies:email_notification_description")}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    {t("common:cancel")}
                  </Button>
                </DialogClose>
                <Button type="submit">{t("common:update")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPolicyModal;
