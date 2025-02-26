import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ContactFormValues, contactSchema } from "../schema/auth";

const submitContactForm = async (data: ContactFormValues) => {
  // Replace with your actual API call
  const response = await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit form");
  return response.json();
};

export const useContactForm = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  return {
    form,
    isLoading: mutation.isPending,
    onSubmit,
  };
};
