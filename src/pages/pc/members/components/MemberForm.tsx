import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Member } from "../../../../constants/interface/pc/members";

export const formSchema = z.object({
  memberId: z.number().optional(), // Optional field
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  age: z.number().min(1, { message: "Age is required" }),
  city: z.string().min(1, { message: "City is required" }),
  subcity: z.string().min(1, { message: "Subcity is required" }),
  woreda: z.string().min(1, { message: "Woreda is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  photo: z.string().url({ message: "Photo must be a valid URL" }),
  registrationFee: z
    .number()
    .min(0, { message: "Registration fee must be a non-negative number" }),
  share: z.number().min(0, { message: "Share must be a non-negative number" }),
  collateral: z.string().min(1, { message: "Collateral is required" }),
  inheritor: z.string().min(1, { message: "Inheritor is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface MemberFormProps {
  defaultValues: Partial<FormValues>;
  onSubmit: (data: Member) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const MemberForm: React.FC<MemberFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: Member) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full"
      >
        <div className="mb-5 flex flex-col gap-5">
          <FormField
            name="name"
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
            name="age"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="inheritor"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>inheritor:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="pt-6 space-x-2 flex items-center justify-center w-full">
          <Button
            variant="secondary"
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

export default MemberForm;
