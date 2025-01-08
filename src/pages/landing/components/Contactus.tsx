import { zodResolver } from "@hookform/resolvers/zod";
import { Locate, Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "../../../common/ui/button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = (data: ContactFormValues) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between p-8 bg-gray-50" id="contact">
      {/* Contact Details Section */}
      <div className="lg:w-1/2 mb-8 lg:mb-0">
        <button className="bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
          Contact Us
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">Get in Touch</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Have questions? We're here to help and would love to hear from you.
        </p>
        <div className="mt-6 space-y-4">
          <p className="flex items-center text-gray-600">
            <Mail size={18} />{" "}
            <span className="ml-2">contact@ethiopiancooperative.org</span>
          </p>
          <p className="flex items-center text-gray-600">
            <Phone size={18} /> <span className="ml-2">+251 11 234 5678</span>
          </p>
          <p className="flex items-center text-gray-600">
            <MapPin size={18} />{" "}
            <span className="ml-2">Addis Ababa, Ethiopia</span>
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="lg:w-1/2 bg-white shadow-lg p-6 rounded-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
                      placeholder="Write your message here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-600"
            >
              Send Message
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContactUs;
