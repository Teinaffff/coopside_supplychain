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
import { Textarea } from "../../../common/ui/textarea";
import { useContactForm } from "../../../hooks/use-contact-form";

export const ContactForm = () => {
  const { form, isLoading, onSubmit } = useContactForm();

  return (
    <div className="w-full lg:w-1/2 bg-white shadow-lg p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="Your name"
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    disabled={isLoading}
                    placeholder="your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isLoading}
                    placeholder="Write your message here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-600"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
}; 