import React, { useMemo, useState } from "react";
import { Button } from "../../../common/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../common/ui/form";
import { Input } from "../../../common/ui/input";
import { Checkbox } from "../../../common/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { useForm } from "react-hook-form";

type ApplicantType = "agent" | "customer";

type CreditApplicationForm = {
  applicantType: ApplicantType;
  fullName: string;
  nationalId: string;
  phone: string;
  email?: string;
  address?: string;
  employer?: string;
  tin?: string;
  amount: number;
  termMonths: number;
  interestRate: number;
  purpose: string;
  agreeKyc: boolean;
};

const defaultValues: CreditApplicationForm = {
  applicantType: "agent",
  fullName: "",
  nationalId: "",
  phone: "",
  email: "",
  address: "",
  employer: "",
  tin: "",
  amount: 0,
  termMonths: 12,
  interestRate: 12,
  purpose: "",
  agreeKyc: false,
};

const CreditApplicationPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<CreditApplicationForm>({ defaultValues });

  const applicantType = form.watch("applicantType");

  const terms = useMemo(() => [6, 12, 18, 24, 36], []);

  const onSubmit = async (data: CreditApplicationForm) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    // TODO: wire to API
    alert(`Credit application submitted for ${data.fullName}`);
    form.reset(defaultValues);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>New Credit Application</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="applicantType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicant Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Melaku Tesfaye" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationalId"
                  rules={{ required: "National ID is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>National ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123456789012" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. +2519xxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Subcity, Woreda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {applicantType === "agent" ? (
                  <>
                    <FormField
                      control={form.control}
                      name="employer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Factory to purchase from</FormLabel>
                          <FormControl>
                            <Input placeholder="Organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tin"
                      rules={{ required: "TIN is required for agents" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TIN</FormLabel>
                          <FormControl>
                            <Input placeholder="Tax ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="amount"
                  rules={{ required: "Amount is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (ETB)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="termMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term (months)</FormLabel>
                      <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {terms.map((t) => (
                            <SelectItem key={t} value={String(t)}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  rules={{ required: "Purpose is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Working capital, Card issuance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="agreeKyc"
                  rules={{ required: "KYC consent is required" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I confirm KYC checks are completed and valid.</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                  Reset
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditApplicationPage;


