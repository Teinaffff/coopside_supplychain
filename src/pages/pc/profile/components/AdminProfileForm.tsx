import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { cities } from "../../../../common/data/data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/ui/select";
import { Subcity, Woreda } from "../../../../constants/interface/pc/general";
import {
  adminFormSchema,
  AdminFormValues,
} from "../../../../constants/schema/profile";
import { handleCityChange, handleSubcityChange } from "./filterAddress";

type AdminProfileFormProps = {
  onSubmit: (data: AdminFormValues) => void;
  setIsEditable: (data: boolean) => void;
  isEditable: boolean;
  loading: boolean;
};

const AdminProfileForm: React.FC<AdminProfileFormProps> = ({
  onSubmit,
  isEditable,
  loading,
  setIsEditable,
}) => {
  const [filteredSubcities, setFilteredSubcities] = useState<Subcity[] | []>(
    []
  );
  const [filteredWoredas, setFilteredWoredas] = useState<Woreda[] | []>([]);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      fullName: "Bahar Mm",
      phone: "0912078640",
      email: "",
      // idNumber: { type: "", value: "" },
      address: { city: "", subcity: "", woreda: "" },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="fullname"
                    {...field}
                    disabled={!isEditable}
                  />
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
                  <Input
                    type="number"
                    placeholder="phone"
                    {...field}
                    disabled={true}
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
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email"
                    {...field}
                    disabled={!isEditable}
                  />
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
                <Select
                  disabled={loading || !isEditable}
                  onValueChange={(value) =>
                    handleCityChange(
                      value,
                      cities,
                      setFilteredSubcities,
                      form.setValue,
                      "address"
                    )
                  }
                  value={field.value.toString()}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="ring-1">
                      <SelectValue
                        defaultValue=""
                        placeholder="Select a city"
                      />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-64 overflow-y-auto">
                    {cities.length > 0 &&
                      cities.map((city) => (
                        <SelectItem value={city.cityName} key={city.id}>
                          {city.cityName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            name="address.subcity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcity:</FormLabel>
                <Select
                  disabled={loading || !isEditable}
                  onValueChange={(value) =>
                    handleSubcityChange(
                      value,
                      filteredSubcities,
                      setFilteredWoredas,
                      form.setValue,
                      "address"
                    )
                  }
                  value={field.value.toString()}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="ring-1">
                      <SelectValue
                        defaultValue=""
                        placeholder="Select a Subcity"
                      />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-64 overflow-y-auto">
                    {filteredSubcities.length > 0 &&
                      filteredSubcities.map((Subcity) => (
                        <SelectItem
                          value={Subcity.subcityName}
                          key={Subcity.id}
                        >
                          {Subcity.subcityName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address.woreda"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Woreda:</FormLabel>
                <Select
                  disabled={loading || !isEditable}
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="ring-1">
                      <SelectValue
                        defaultValue=""
                        placeholder="Select a woreda"
                      />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-64 overflow-y-auto">
                    {filteredWoredas.length > 0 &&
                      filteredWoredas.map((woreda) => (
                        <SelectItem value={woreda.woredaName} key={woreda.id}>
                          {woreda.woredaName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {isEditable && (
          <div className="pt-6 space-x-3 flex items-center justify-end w-full">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setIsEditable(false);
                form.clearErrors();
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-500 hover:bg-cyan-500">
              Save
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default AdminProfileForm;
