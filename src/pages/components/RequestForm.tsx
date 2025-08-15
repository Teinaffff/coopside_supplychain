import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../common/ui/button";
import { Card } from "../../common/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/ui/form";
import { Textarea } from "../../common/ui/textarea";

export const pcRequestFormSchema = z.object({
  purpose: z.string().min(1, { message: "Purpose is required" }),
  logo: z.any().optional(),
});

export type PcBankRequestFormValues = z.infer<typeof pcRequestFormSchema>;

const RequestForm = ({
  title,
  subtitle,
  placeholder,
  buttonText,
  loading,
  onSubmit,
  showImageField = false,
  onImageChange,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  loading: boolean;
  onSubmit: (data: { purpose: string }) => void;
  showImageField?: boolean;
  onImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const form = useForm<PcBankRequestFormValues>({
    resolver: zodResolver(pcRequestFormSchema),
    defaultValues: {
      purpose: "",
    },
  });
  const handleSubmit = (data: { purpose: string }) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            name="purpose"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role:</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={placeholder}
                    rows={4}
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showImageField && (
            <FormItem>
              <FormLabel>Upload New Logo:</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  disabled={loading}
                  className="border rounded p-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}

          <Button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-500 text-white"
          >
            {buttonText}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default RequestForm;
