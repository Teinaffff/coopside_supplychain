import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues.logoUrl || null
  );

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: SellerFormValues) => {
    const sellerData: SellerFormValues = {
      ...data,
      logoUrl: selectedImage ? URL.createObjectURL(selectedImage) : data.logoUrl,
    };
    onSubmit(sellerData);
    onClose();
    form.reset();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name:</FormLabel>
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
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="chairperson"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chairperson:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="memberCount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Count:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="city"
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
            name="subcity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcity:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="woreda"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Woreda:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="establishedDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Established Date:</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="sellerStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormItem>
            <FormLabel>Logo:</FormLabel>
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

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Logo preview"
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-2">
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