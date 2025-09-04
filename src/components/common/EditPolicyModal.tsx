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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useClientsLovQuery,
  useCurrencyLovQuery,
  usePaymentFrequencyLovQuery,
  usePolicyProductsByTypeQuery,
} from "@/hooks/queries/policiesQueries";
import { showToastWithDescription } from "@/lib/toast";
import { InsertUpdatePolicyI } from "@/lib/types";
import {
  formatCurrency,
  getDefaultCurrency,
  unformatMoney,
  unformatMoneyToString,
} from "@/lib/utils";
import {
  IClientLov,
  insertUpdatePolicy,
  IPolicyType,
  IQuoteLov,
  PolicyDetailI,
} from "@/services/policyServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { LOV } from "../LOV";
import { Icons } from "../customUI/Icons";
import { SelectQuote } from "./SelectQuote";

interface EditPolicyModalProps {
  type: "edit" | "create" | "";
  policyArr: PolicyDetailI[] | null;
  isOpen: boolean;
  policyTypes: IPolicyType[];
  onClose: (fn: () => void) => void;
}

// Policy creation form schema
const policyFormSchema = z.object({
  quoteId: z.number().nullable(),
  policyId: z.number().nullable(),
  policyNumber: z.string().nullable(),
  refPolicyNumber: z.string().nullable(),
  type: z.string().min(1, { message: "Insurance type is required" }),
  provider: z.string().min(1, { message: "Provider is required" }),
  productId: z.number().int().positive({ message: "Product ID is required" }),
  clientName: z.string().min(1, { message: "Client name is required" }),
  clientId: z.number().int().positive(),
  status: z.string().min(1, { message: "Status is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  currencyCode: z.string().min(1, { message: "Currency is required" }),
  currencyRate: z.coerce
    .number()
    .positive({ message: "Currency rate must be a positive number" }),
  premium: z.coerce
    .number()
    .positive({ message: "Premium must be a positive number" }),
  premiumDisplay: z.string().refine((val) => unformatMoney(val) > 0, {
    message: "Premium display must be greater than zero",
  }),
  paymentFrequency: z
    .string()
    .min(1, { message: "Payment frequency is required" }),
  coverage: z.coerce
    .number()
    .positive({ message: "Coverage must be a positive number" }),
  coverageDisplay: z.string().refine((val) => unformatMoney(val) > 0, {
    message: "Coverage display must be greater than zero",
  }),
  deductible: z.coerce.number().nonnegative(),
  deductibleDisplay: z.string().refine((val) => unformatMoney(val) >= 0, {
    message: "Deductible display must be zero or positive",
  }),
  paymentMethodId: z.number().int().positive().nullable(),
  autoRenewal: z.boolean().default(true),
  agentId: z.number().int().positive().nullable(),
  commissionRate: z.coerce
    .number()
    .positive({ message: "Commission rate must be a positive number" })
    .nullable(),
  insuredProperties: z.string().nullable(),
  underwritingNotes: z.string().nullable(),
  sendEmailNotification: z.boolean().default(true),
});

type PolicyFormValues = z.infer<typeof policyFormSchema>;

interface IProviders {
  providerId: number;
  provider: string;
}

interface IProducts {
  productId: number;
  product: string;
}

const ROWS_PER_PAGE = 5;

const EditPolicyModal: React.FC<EditPolicyModalProps> = ({
  type,
  policyArr,
  policyTypes,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [policyType, setPolicyType] = useState<string | null>();
  const [provider, setProvider] = useState<string | null>();
  const [providers, setProviders] = useState<IProviders[]>([]);
  const [products, setProducts] = useState<IProducts[]>([]);
  const [isPopulated, setIsPopulated] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<IQuoteLov>(null);
  const [creationMethod, setCreationMethod] = useState<"quote" | "manual">(
    "quote"
  );
  const [fromQuote, setFromQuote] = useState<boolean>(false);

  const defaultCurrency = getDefaultCurrency();

  const {
    data: policyProducts,
    isPending: isPolicyProductsPending,
    isError: isPolicyProductsError,
  } = usePolicyProductsByTypeQuery();

  const {
    data: currencyLov,
    isPending: isCurrencyLovPending,
    isError: isCurrencyLovError,
  } = useCurrencyLovQuery();

  const {
    data: paymentFrequencyLov,
    isPending: isPaymentFrequencyLovPending,
    isError: isPaymentFrequencyLovError,
  } = usePaymentFrequencyLovQuery();

  useEffect(() => {
    const providersArr: IProviders[] = [];
    if (!isPolicyProductsPending && !isPolicyProductsError && policyType) {
      const productsByType = policyProducts.filter(
        (el) =>
          el.productType === policyType &&
          (type === "edit" ||
            (type === "create" && (Number(el.isActive) === 1 || fromQuote)))
      );

      for (let i = 0; i < productsByType.length; i++) {
        const product = productsByType[i];
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
  }, [policyProducts, policyType, type]);

  useEffect(() => {
    const productsArr: IProducts[] = [];
    if (!isPolicyProductsPending && !isPolicyProductsError && provider) {
      const productsByProvider = policyProducts.filter(
        (product) =>
          product.providerId === parseInt(provider) &&
          (type === "edit" ||
            (type === "create" &&
              (Number(product.isActive) === 1 || fromQuote)))
      );

      productsByProvider.forEach((el) => {
        productsArr.push({
          productId: el.productId,
          product: el.productName,
        });
      });
    }

    setProducts(productsArr);
  }, [policyProducts, provider, type]);

  const policyDetail = !policyArr ? null : policyArr[0];

  // Initialize form with default values
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      quoteId: null,
      policyId: null,
      policyNumber: "",
      refPolicyNumber: "",
      type: "",
      provider: "",
      productId: null,
      clientName: "",
      clientId: null,
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      currencyCode: "",
      currencyRate: 0,
      premium: 0,
      premiumDisplay: "0.00",
      paymentFrequency: "",
      coverage: 0,
      coverageDisplay: "0.00",
      deductible: 0,
      deductibleDisplay: "0.00",
      paymentMethodId: null,
      autoRenewal: true,
      agentId: null,
      commissionRate: null,
      insuredProperties: "",
      underwritingNotes: "",
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
    if (isOpen && policyDetail && !isPopulated && type === "edit") {
      form.setValue("policyId", policyDetail.policy_id);
      form.setValue("policyNumber", policyDetail.policy_number);
      form.setValue("refPolicyNumber", policyDetail.ref_policy_number || "");
      form.setValue("type", policyDetail.type);
      form.setValue("provider", String(policyDetail.partner_id));
      form.setValue("productId", policyDetail.product_id);
      form.setValue("clientName", policyDetail.client_name);
      form.setValue("clientId", Number(policyDetail.client_id));
      form.setValue("status", policyDetail.status);
      form.setValue("startDate", policyDetail.start_date);
      form.setValue("endDate", policyDetail.end_date);
      form.setValue("currencyCode", policyDetail.currency_code);
      form.setValue("currencyRate", policyDetail.currency_rate);
      form.setValue("premium", Number(policyDetail.premium));
      form.setValue(
        "premiumDisplay",
        formatCurrency(Number(policyDetail.premium), {
          withSymbol: false,
        })
      );
      form.setValue("paymentFrequency", policyDetail.payment_frequency);
      form.setValue("coverage", Number(policyDetail.coverage));
      form.setValue(
        "coverageDisplay",
        formatCurrency(Number(policyDetail.coverage), {
          withSymbol: false,
        })
      );
      form.setValue("deductible", Number(policyDetail.deductible));
      form.setValue(
        "deductibleDisplay",
        formatCurrency(Number(policyDetail.deductible), {
          withSymbol: false,
        })
      );
      form.setValue("paymentMethodId", policyDetail.payment_method_id);
      form.setValue("autoRenewal", Number(policyDetail.auto_renewal) === 1);
      form.setValue("agentId", policyDetail.agent_id);
      form.setValue("commissionRate", policyDetail.commission_rate);
      form.setValue("insuredProperties", policyDetail.insured_properties || "");
      form.setValue("underwritingNotes", policyDetail.underwriting_notes || "");
      setIsPopulated(true);
      setPolicyType(policyDetail.type);
      setProvider(String(policyDetail.partner_id));
      setCreationMethod("manual");
    }

    if (
      isOpen &&
      type === "create" &&
      !isCurrencyLovPending &&
      !isCurrencyLovError &&
      currencyLov != null
    ) {
      const currency = currencyLov.find(
        (currency) => currency.currency_code === defaultCurrency.code
      );

      form.setValue("currencyCode", currency.currency_code);
      form.setValue("currencyRate", currency.currency_rate);
      form.setValue("policyId", null);
      setProviders([]);
      setProducts([]);
    }
  }, [policyDetail, isPopulated, form, isOpen]);

  const onSubmit = async (data: PolicyFormValues) => {
    const {
      quoteId,
      policyId,
      policyNumber,
      refPolicyNumber,
      clientId,
      productId,
      provider,
      currencyCode,
      currencyRate,
      premium,
      coverage,
      deductible,
      insuredProperties,
      status,
      startDate: effectiveDate,
      endDate: expirationDate,
      paymentFrequency,
      paymentMethodId,
      autoRenewal,
      underwritingNotes,
      agentId,
      commissionRate,
    } = data;

    const insertUpdatePolicyObj: InsertUpdatePolicyI = {
      quote_id: quoteId,
      policy_id: policyId,
      policy_number: policyNumber,
      ref_policy_number: refPolicyNumber,
      client_id: Number(clientId),
      partner_id: Number(provider),
      product_id: Number(productId),
      currency_code: currencyCode,
      currency_rate: currencyRate,
      premium_amount: premium,
      coverage_amount: coverage,
      deductible_amount: deductible,
      insured_properties: insuredProperties,
      status,
      effective_date: effectiveDate,
      expiration_date: expirationDate,
      payment_frequency: paymentFrequency,
      payment_method_id: paymentMethodId,
      auto_renewal: autoRenewal ? 1 : 0,
      underwriting_notes: underwritingNotes,
      agent_id: agentId,
      commission_rate: commissionRate,
    };

    // remove null values
    Object.keys(insertUpdatePolicyObj).forEach((key) => {
      if (insertUpdatePolicyObj[key] === null) {
        delete insertUpdatePolicyObj[key];
      }
    });

    await insertUpdatePolicy(insertUpdatePolicyObj);
    if (policyDetail?.policy_id) {
      queryClient.invalidateQueries({
        queryKey: ["policyDetail", policyDetail.policy_id],
      });
    }

    if (quoteId) {
      queryClient.invalidateQueries({
        queryKey: ["quotes-lov"],
      });
    }

    queryClient.invalidateQueries({
      queryKey: ["policies"],
    });

    if (type === "create") {
      if (fromQuote) {
        showToastWithDescription(
          t("policies:policy_created_from_quote"),
          t("policies:policy_created_from_quote_description", {
            policyNumber: data.policyNumber,
            clientName: data.clientName,
            quoteNumber: selectedQuote.quote_number,
          }),
          "success"
        );
      } else {
        showToastWithDescription(
          t("policies:policy_created_successfully"),
          t("policies:policy_created_successfully_description", {
            policyNumber: data.policyNumber,
            clientName: data.clientName,
          }),
          "success"
        );
      }
    } else {
      showToastWithDescription(
        t("policies:policy_updated_successfully"),
        t("policies:policy_updated_successfully_description", {
          policyNumber: data.policyNumber,
          clientName: data.clientName,
        }),
        "success"
      );
    }

    onClose(() => {
      setPolicyType(null);
      setProvider(null);
      setProviders([]);
      setProducts([]);
      setSelectedQuote(null);
      setIsPopulated(false);
      form.reset();
      setCreationMethod("quote");
    });
  };

  const renderMap = [
    {
      id: "client_type",
      render: (row: IClientLov) => {
        return (
          <div className="flex justify-center items-center">
            {Icons(row.client_type.toLowerCase())}
          </div>
        );
      },
    },
    {
      id: "customer_type",
      render: (row: IClientLov) => {
        return (
          <>
            {row.customer_type === null
              ? "-"
              : t(`customerType:${row.customer_type}`)}
          </>
        );
      },
    },
    {
      id: "email",
      render: (row: IClientLov) => {
        return <>{row.email === null ? "-" : row.email}</>;
      },
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose(() => {
          setPolicyType(null);
          setProvider(null);
          setProviders([]);
          setProducts([]);
          setSelectedQuote(null);
          setIsPopulated(false);
          form.reset();
          setCreationMethod("quote");
        });
      }}
    >
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === "edit"
              ? t("policies:edit_policy")
              : t("policies:create_policy")}
          </DialogTitle>
          <DialogDescription>
            {type === "edit"
              ? t("policies:edit_policy_subtitle", {
                  policyNumber: policyDetail.policy_number,
                })
              : selectedQuote
              ? t("policies:quote_policy_subtitle", {
                  quoteNumber: selectedQuote.quote_number,
                })
              : t("policies:create_policy_subtitle")}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="quote"
          value={creationMethod}
          onValueChange={(value) => {
            setCreationMethod(value as "quote" | "manual");
            setFromQuote(false);
            form.reset();
            setPolicyType(null);
            setProvider(null);
            setProviders([]);
            setProducts([]);
            setSelectedQuote(null);
            setIsPopulated(false);

            const currency = currencyLov.find(
              (currency) => currency.currency_code === defaultCurrency.code
            );
            if (currency) {
              form.setValue("currencyCode", currency.currency_code);
              form.setValue("currencyRate", currency.currency_rate);
            }
          }}
        >
          <TabsList
            className={`grid w-full grid-cols-2 ${
              type === "edit" ? "hidden" : ""
            }`}
          >
            <TabsTrigger value="quote">Quote-Based</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="quote" className="space-y-4 mt-4">
            {type === "" || type === "edit" ? (
              ""
            ) : (
              <SelectQuote
                handleSelectQuote={(quote: IQuoteLov) => {
                  setSelectedQuote(quote);
                  form.setValue("quoteId", quote.id);
                  // form.setValue("policyNumber", quote.quote_number);
                  // form.setValue("refPolicyNumber", quote.ref_policy_number || "");
                  form.setValue("type", quote.type);
                  form.setValue("provider", String(quote.partner_id));
                  form.setValue("productId", Number(quote.product_id));
                  form.setValue("clientName", quote.client_name);
                  form.setValue("clientId", Number(quote.client_id));
                  form.setValue("status", "active");
                  form.setValue("startDate", quote.start_date);
                  form.setValue("endDate", quote.end_date);
                  // form.setValue("currencyCode", quote.currency_code);
                  // form.setValue("currencyRate", quote.currency_rate);
                  form.setValue("premium", Number(quote.quoted_premium));
                  form.setValue(
                    "premiumDisplay",
                    formatCurrency(Number(quote.quoted_premium), {
                      withSymbol: false,
                    })
                  );
                  form.setValue("coverage", Number(quote.coverage_amount));
                  form.setValue(
                    "coverageDisplay",
                    formatCurrency(Number(quote.coverage_amount), {
                      withSymbol: false,
                    })
                  );
                  form.setValue("deductible", Number(quote.deductible_amount));
                  form.setValue(
                    "deductibleDisplay",
                    formatCurrency(Number(quote.deductible_amount), {
                      withSymbol: false,
                    })
                  );
                  form.setValue("underwritingNotes", quote.quote_data);
                  setCreationMethod("manual");
                  setPolicyType(quote.type);
                  setProvider(String(quote.partner_id));
                  setFromQuote(true);
                }}
              />
            )}
          </TabsContent>
          <TabsContent value="manual">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LOV
                    className="col-span-2"
                    lovId="clientName"
                    lovLabel={t("policies:client_name")}
                    lovPlaceholder="Jonn Doe"
                    lovDialogTitle={t("policies:search_client")}
                    lovDialogDescription={""}
                    lovDialogSearchPlaceholder={t(
                      "policies:search_client_placeholder"
                    )}
                    lovDisabled={type === "edit"}
                    form={form}
                    lovRequired={true}
                    rowsPerPage={5}
                    useLOVQuery={useClientsLovQuery}
                    mapLOVData={(client: IClientLov) => {
                      return {
                        client_type: client.client_type,
                        name: client.name,
                        email: client.email,
                        customer_type: client.customer_type,
                      };
                    }}
                    renderFnMap={renderMap}
                    handleSelectLOV={(row: IClientLov) => {
                      form.setValue("clientName", row.name);
                      form.setValue("clientId", row.id);
                      form.clearErrors("clientName");
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="refPolicyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("policies:ref_policy_number")}</FormLabel>
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
                          disabled={type === "edit"}
                          value={field.value}
                          onValueChange={(event) => {
                            setPolicyType(event);
                            field.onChange(event);
                            form.setValue("provider", null);
                            form.setValue("productId", null);
                            form.clearErrors("provider");
                            form.clearErrors("productId");
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
                                {t(
                                  `insuranceTypes:${policyType.type}_insurance`
                                )}
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
                        <FormLabel>
                          {t("policies:insurance_provider")}
                        </FormLabel>
                        <Select
                          disabled={type === "edit"}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setProvider(value);
                            form.setValue("productId", null);
                            form.clearErrors("productId");
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
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("policies:insurance_product")}</FormLabel>
                        <Select
                          disabled={type === "edit"}
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "policies:insurance_product_placeholder"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!isPolicyProductsPending &&
                            !isPolicyProductsError &&
                            !products != null
                              ? products.map((product, index) => (
                                  <SelectItem
                                    value={`${product.productId}`}
                                    key={index}
                                  >
                                    {product.product}
                                  </SelectItem>
                                ))
                              : ""}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
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
                  /> */}

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
                    name="currencyCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("policies:currency")}</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const currency = currencyLov.find(
                              (currency) => currency.currency_code === value
                            );

                            form.setValue(
                              "currencyRate",
                              currency?.currency_rate || 0
                            );
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("policies:currency_placeholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!isCurrencyLovPending &&
                            !isCurrencyLovError &&
                            !currencyLov != null
                              ? currencyLov.map((currency, index) => (
                                  <SelectItem
                                    value={`${currency.currency_code}`}
                                    key={index}
                                  >
                                    {currency.currency_code}
                                    {" - "}
                                    {currency.currency_name}
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
                    name="currencyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("policies:currency_rate")} </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t(
                              "policies:currency_rate_placeholder"
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
                    name="premiumDisplay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("policies:premium")} </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder={t("policies:premium_placeholder")}
                            onFocus={(e) => {
                              form.setValue(
                                "premiumDisplay",
                                unformatMoneyToString(field.value)
                              );
                            }}
                            // onChange={(e) => {
                            //   form.setValue(
                            //     "premiumDisplay",
                            //     unformatMoneyToString(e.target.value)
                            //   );
                            // }}
                            onBlur={(e) => {
                              form.setValue(
                                "premium",
                                unformatMoney(field.value)
                              );
                              form.setValue(
                                "premiumDisplay",
                                formatCurrency(unformatMoney(field.value), {
                                  withSymbol: false,
                                })
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("policies:payment_frequency")}</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "policies:payment_frequency_placeholder"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!isPaymentFrequencyLovPending &&
                            !isPaymentFrequencyLovError &&
                            !paymentFrequencyLov != null
                              ? paymentFrequencyLov.map((currency, index) => (
                                  <SelectItem
                                    value={`${currency.payment_frequency}`}
                                    key={index}
                                  >
                                    {t(
                                      `paymentFrequency:${currency.payment_frequency}`
                                    )}
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
                    name="coverageDisplay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("policies:coverage_amount")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder={t(
                              "policies:coverage_amount_placeholder"
                            )}
                            onFocus={(e) => {
                              form.setValue(
                                "coverageDisplay",
                                unformatMoneyToString(field.value)
                              );
                            }}
                            // onChange={(e) => {
                            //   form.setValue(
                            //     "coverageDisplay",
                            //     unformatMoneyToString(e.target.value)
                            //   );
                            // }}
                            onBlur={(e) => {
                              form.setValue(
                                "coverage",
                                unformatMoney(field.value)
                              );
                              form.setValue(
                                "coverageDisplay",
                                formatCurrency(unformatMoney(field.value), {
                                  withSymbol: false,
                                })
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deductibleDisplay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("policies:deductible")} </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder={t("policies:deductible_placeholder")}
                            onFocus={(e) => {
                              form.setValue(
                                "deductibleDisplay",
                                unformatMoneyToString(field.value)
                              );
                            }}
                            // onChange={(e) => {
                            //   form.setValue(
                            //     "deductibleDisplay",
                            //     unformatMoneyToString(e.target.value)
                            //   );
                            // }}
                            onBlur={(e) => {
                              form.setValue(
                                "deductible",
                                unformatMoney(field.value)
                              );
                              form.setValue(
                                "deductibleDisplay",
                                formatCurrency(unformatMoney(field.value), {
                                  withSymbol: false,
                                })
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insuredProperties"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>
                          {t("policies:insured_properties")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "policies:insured_properties_placeholder"
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("policies:insured_properties_description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="underwritingNotes"
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
                  <Button type="submit">
                    {type === "edit" ? t("common:update") : t("common:create")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditPolicyModal;
