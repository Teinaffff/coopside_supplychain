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
import {
  sellerFormSchema,
  SellerFormValues,
} from "../../../../schema/admin/seller";

interface SellerFormProps {
  defaultValues: Partial<SellerFormValues>;
  onSubmit: (data: SellerFormValues) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const SellerForm: React.FC<SellerFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: SellerFormValues) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      // form.setValue("profilePictureUrl", selectedImage);
      form.setValue("profilePictureUrl", "http://localhost:3000/uploads/img1");
      form.clearErrors("profilePictureUrl");
    } else {
      form.setValue("profilePictureUrl", null);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
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
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="idNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="commissionRate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Rate:</FormLabel>
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
            name="address.street"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address.city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address.state"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>State:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address.postalCode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code:</FormLabel>
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
            name="taxIdentificationNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Identification Number:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="profilePictureUrl"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel>Profile Picture:</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-x-2">
          <Button
            onClick={onClose}
            variant="outline"
            type="button"
            disabled={loading}
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

export default SellerForm;
