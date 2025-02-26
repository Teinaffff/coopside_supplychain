import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { Textarea } from "../../../common/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../common/ui/form";
import { usePcBankRequest } from "../bank/use-pc-bank";

export const pcBankRequestFormSchema = z.object({
  purpose: z.string().min(1, { message: "Purpose is required" }),
});

export type PcBankRequestFormValues = z.infer<typeof pcBankRequestFormSchema>;

const RequestForm = ({
  title,
  subtitle,
  placeholder,
  buttonText,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
}) => {
  const { handleSendPcBankRequest, loading } = usePcBankRequest();
  const form = useForm<PcBankRequestFormValues>({
    resolver: zodResolver(pcBankRequestFormSchema),
    defaultValues: {
      purpose: "",
    },
  });

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSendPcBankRequest)}
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
