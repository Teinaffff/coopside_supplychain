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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/ui/select";
import { ADMIN_MODULE_OPTIONS } from "../../../../constants/interface/admin/user";
import { userFormSchema, UserFormValues } from "../../../../schema/admin/user";

interface UserFormProps {
  defaultValues: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const selectedUserType = form.watch("userType");
  const requiresOrganization =
    ADMIN_MODULE_OPTIONS.find((option) => option.value === selectedUserType)
      ?.requiresOrganization || false;

  const handleSubmit = async (data: UserFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      form.setValue("profilePictureUrl", selectedImage);
      form.clearErrors("profilePictureUrl");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full"
      >
        <div className="grid md:grid-cols-2 gap-4">
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
                  <Input type="tel" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="userType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ADMIN_MODULE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {requiresOrganization && (
            <FormField
              name="assignedOrganization.name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Organization:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="org1">
                        Sample Organization 1
                      </SelectItem>
                      <SelectItem value="org2">
                        Sample Organization 2
                      </SelectItem>
                      <SelectItem value="org3">
                        Sample Organization 3
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="col-span-2 grid md:grid-cols-2 gap-4">
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

export default UserForm;
