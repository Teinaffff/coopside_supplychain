import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../../common/ui/button";
import { Checkbox } from "../../../../common/ui/checkbox";
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
import {
    branchFormSchema,
    BranchFormValues,
} from "../../../../schema/admin/institution";

interface BranchFormProps {
  defaultValues?: Partial<BranchFormValues>;
  onSubmit: (data: BranchFormValues) => void;
  loading?: boolean;
  onClose: () => void;
  buttonTitle: string;
  institutionId: string;
}

const BranchForm: React.FC<BranchFormProps> = ({
  defaultValues,
  onSubmit,
  loading = false,
  onClose,
  buttonTitle,
  institutionId,
}) => {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      institutionId: parseInt(institutionId),
      branchName: "",
      address: "",
      phoneNumber: "",
      email: "",
      branchManager: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: BranchFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="branchName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name *:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    placeholder="Enter branch name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="branchManager"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Manager *:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    placeholder="Enter manager name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="address"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={loading}
                  placeholder="Enter full address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    placeholder="+251-11-123-4567"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    type="email"
                    placeholder="branch@institution.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="isActive"
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
                <FormLabel>Active Branch</FormLabel>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Uncheck to deactivate this branch
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader color={"ffffff"} size={15} />}
            {buttonTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BranchForm;
