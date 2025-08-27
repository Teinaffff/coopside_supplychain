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
  consumerFormSchema,
  ConsumerFormValues,
} from "../../../../schema/admin/consumer";
import { useInstitutions } from "../../hooks/use-institutions";

interface ConsumerFormProps {
  defaultValues: Partial<ConsumerFormValues>;
  onSubmit: (data: ConsumerFormValues) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const ConsumerForm: React.FC<ConsumerFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const { institutions } = useInstitutions({ isFetchInstitutions: true });
  
  const form = useForm<ConsumerFormValues>({
    resolver: zodResolver(consumerFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ConsumerFormValues) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Basic Information */}
          <FormField
            name="employeeId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="nationalIdNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>National ID Number:</FormLabel>
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
            name="bankAccountNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Number:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="mobileNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="workEmail"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Email:</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employment Information */}
          <FormField
            name="jobTitle"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="department"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="employmentType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type:</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERMANENT">Permanent</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                      <SelectItem value="TEMPORARY">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="employmentStartDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Start Date:</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="employmentStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status:</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="TERMINATED">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="institutionId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution:</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions?.map((institution) => (
                        <SelectItem key={institution.id} value={institution.id.toString()}>
                          {institution.fullLegalName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="supervisorName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisor Name:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary Information */}
          <FormField
            name="grossSalary"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gross Salary:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="netSalary"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Net Salary:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="pensionDeduction"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pension Deduction:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="incomeTaxDeduction"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Income Tax Deduction:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="otherDeductions"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Deductions:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="salaryFrequency"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Frequency:</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="payCycleTiming"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay Cycle Timing:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} placeholder="e.g., End of month" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Personal Information */}
          <FormField
            name="maritalStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status:</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="MARRIED">Married</SelectItem>
                      <SelectItem value="DIVORCED">Divorced</SelectItem>
                      <SelectItem value="WIDOWED">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="numberOfDependents"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Dependents:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Emergency Contact */}
          <FormField
            name="emergencyContactName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Name:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="emergencyContactRelationship"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Relationship:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} placeholder="e.g., Spouse, Parent, Sibling" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="emergencyContactPhone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Phone:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="emergencyContactAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Address:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Onboarding Status */}
          <FormField
            name="onboardingStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Onboarding Status:</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select onboarding status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Consent and Agreements</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              name="salaryDeductionConsent"
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
                    <FormLabel>Salary Deduction Consent</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="terminationRepaymentConsent"
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
                    <FormLabel>Termination Repayment Consent</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-6 space-x-2 flex items-center justify-center w-full">
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={`bg-cyan-500 text-white hover:bg-cyan-500 ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading && <Loader color="#ffffff" size={15} />} {buttonTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConsumerForm;
