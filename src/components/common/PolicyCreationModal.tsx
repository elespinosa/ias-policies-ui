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
  usePolicyProductsByTypeQuery,
  usePolicyTypesQuery,
} from "@/hooks/queries/policiesQueries";
import { toast } from "@/hooks/use-toast";
import { IPolicyProviderPerType } from "@/services/policyServices";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PolicyCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample quotes for selection
const availableQuotes = [
  {
    id: "1",
    client: "John Doe",
    type: "Auto Insurance",
    amount: 1250,
    status: "approved",
  },
  {
    id: "2",
    client: "Jane Smith",
    type: "Home Insurance",
    amount: 950,
    status: "approved",
  },
  {
    id: "3",
    client: "Robert Johnson",
    type: "Life Insurance",
    amount: 2100,
    status: "pending",
  },
  {
    id: "4",
    client: "Sarah Williams",
    type: "Business Insurance",
    amount: 3500,
    status: "approved",
  },
];

// Sample providers
const insuranceProviders = [
  "Acme Insurance",
  "SafeGuard Insurance",
  "FutureCare Insurance",
  "Capitol Insurance",
  "Voyager Insurance",
  "WellCare Insurance",
];

// Policy creation form schema
const policyFormSchema = z.object({
  refPolicyNumber: z.string().min(1, { message: "Policy number is required" }),
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

const PolicyCreationModal: React.FC<PolicyCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [creationMethod, setCreationMethod] = useState<"quote" | "manual">(
    "quote"
  );
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [policyType, setPolicyType] = useState<string | null>();
  const [providerId, setProviderId] = useState<number | null>();
  const [providers, setProviders] = useState<IProviders[]>([]);
  const [products, setProducts] = useState<IPolicyProviderPerType[]>([]);

  const {
    data: policyTypes,
    isPending: isPolicyTypesPending,
    isError: isPolicyTypesError,
  } = usePolicyTypesQuery();

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

  useEffect(() => {
    if (!isPolicyProductsPending && !isPolicyProductsError) {
      setProducts(policyProducts.filter((el) => el.providerId === providerId));
    }
  }, [providerId]);

  // Initialize form with default values
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      refPolicyNumber: "",
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

  const toggleQuoteSelection = (quoteId: string) => {
    if (selectedQuotes.includes(quoteId)) {
      setSelectedQuotes(selectedQuotes.filter((id) => id !== quoteId));
    } else {
      setSelectedQuotes([...selectedQuotes, quoteId]);
    }
  };

  const handleUseQuote = () => {
    if (selectedQuotes.length === 0) {
      toast({
        title: "No quotes selected",
        description: "Please select at least one quote to proceed",
        variant: "destructive",
      });
      return;
    }

    // In a real application, we would pre-fill the form with the quote data
    // For now, let's simulate that with the first selected quote
    const selectedQuote = availableQuotes.find(
      (q) => q.id === selectedQuotes[0]
    );

    if (selectedQuote) {
      form.setValue("clientName", selectedQuote.client);
      form.setValue("type", selectedQuote.type);
      form.setValue("premium", selectedQuote.amount);

      // Set the creation method to manual to show the form
      setCreationMethod("manual");

      toast({
        title: "Quote applied",
        description: `Quote data for ${selectedQuote.client} has been applied to the form.`,
      });
    }
  };

  const onSubmit = (data: PolicyFormValues) => {
    // In a real app, this would save the policy to the database
    toast({
      title: "Policy created successfully",
      description: `Policy ${data.refPolicyNumber} has been created for ${data.clientName}.`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Policy</DialogTitle>
          <DialogDescription>
            Create a new insurance policy either from existing quotes or with
            manual entry.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="quote"
          value={creationMethod}
          onValueChange={(value) =>
            setCreationMethod(value as "quote" | "manual")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quote">Quote-Based</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="quote" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Select Quote(s)</h3>
                <Button
                  size="sm"
                  onClick={handleUseQuote}
                  disabled={selectedQuotes.length === 0}
                >
                  Use Selected Quote
                </Button>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-6 gap-2 p-3 bg-muted text-sm font-medium">
                  <div className="col-span-1">Select</div>
                  <div className="col-span-2">Client</div>
                  <div className="col-span-1">Type</div>
                  <div className="col-span-1 text-right">Amount</div>
                  <div className="col-span-1 text-center">Status</div>
                </div>

                {availableQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="grid grid-cols-6 gap-2 p-3 border-t items-center text-sm hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleQuoteSelection(quote.id)}
                  >
                    <div className="col-span-1">
                      <Checkbox
                        checked={selectedQuotes.includes(quote.id)}
                        onCheckedChange={() => toggleQuoteSelection(quote.id)}
                      />
                    </div>
                    <div className="col-span-2 font-medium">{quote.client}</div>
                    <div className="col-span-1 text-muted-foreground">
                      {quote.type}
                    </div>
                    <div className="col-span-1 text-right">
                      ${quote.amount.toLocaleString()}
                    </div>
                    <div className="col-span-1 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          quote.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="refPolicyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Policy Number</FormLabel>
                        <FormControl>
                          <Input placeholder="POL-12345" {...field} />
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
                        <FormLabel>Insurance Type</FormLabel>
                        <Select
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
                            {!isPolicyTypesPending &&
                            !isPolicyTypesError &&
                            !policyTypes != null
                              ? policyTypes.map((policyType, index) => (
                                  <SelectItem
                                    value={policyType.type}
                                    key={index}
                                  >
                                    {policyType.type}
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
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Provider</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setProviderId(
                              value === null || value === undefined
                                ? null
                                : Number.parseInt(value)
                            );
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
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
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Start Date</FormLabel>
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
                        <FormLabel>End Date</FormLabel>
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
                        <FormLabel>Premium ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
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
                        <FormLabel>Coverage Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
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
                        <FormLabel>Deductible ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
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
                        <FormLabel>Insured Properties</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="List of Insured Properties (comma separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter Properties separated by commas
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
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional policy information..."
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
                          <FormLabel>Email Notification</FormLabel>
                          <FormDescription>
                            Send an email to the client with policy details
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Create Policy</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyCreationModal;
