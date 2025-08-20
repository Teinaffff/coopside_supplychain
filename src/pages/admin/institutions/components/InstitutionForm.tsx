import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../../common/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../common/ui/form";
import { Input } from "../../../../common/ui/input";
import { Loader } from "../../../../common/ui/loader";
import { Checkbox } from "../../../../common/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import {
  institutionFormSchema,
  InstitutionFormValues,
} from "../../../../schema/admin/institution";

interface InstitutionFormProps {
  defaultValues: Partial<InstitutionFormValues>;
  onSubmit: (data: InstitutionFormValues) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const InstitutionForm: React.FC<InstitutionFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: InstitutionFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            name="fullLegalName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Legal Name:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="yearOfEstablishment"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Establishment:</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={loading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="businessSector"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Sector:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="tin"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>TIN:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="vatRegistrationCertificate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>VAT Registration Certificate:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="currentCapital"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Capital:</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    disabled={loading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="permanentEmployees"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permanent Employees:</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={loading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="contractualEmployees"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contractual Employees:</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={loading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="totalBranches"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Branches:</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={loading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="totalAssetValuation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Asset Valuation:</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    disabled={loading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="organizationalStructure"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizational Structure:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="contactEmail"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email:</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="contactPhone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="mainOfficeAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Office Address:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="institutionType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Type:</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Institute">Institute</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="businessLicenseNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business License Number:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="establishmentProclamation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Establishment Proclamation:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="onboardingStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Onboarding Status:</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Agreements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="employeeConsentProvided"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Employee Consent Provided</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="monthlyPayrollCommitment"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Monthly Payroll Commitment</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="employeeTerminationNotificationAgreement"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Employee Termination Notification Agreement</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="outstandingReceivablesPriorityAgreement"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Outstanding Receivables Priority Agreement</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="loanRepaymentDeductionAgreement"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Loan Repayment Deduction Agreement</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="digitalChannelUsageAgreement"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Digital Channel Usage Agreement</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          name="logo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo:</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader color="#ffffff" size={15} />}
            {buttonTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InstitutionForm;
