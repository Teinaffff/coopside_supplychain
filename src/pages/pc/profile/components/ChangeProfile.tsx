import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
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
import { Separator } from "../../../../common/ui/separator";
import { Textarea } from "../../../../common/ui/textarea";
import { Subcity, Woreda } from "../../../../constants/interface/pc/profile";
import { emailRegex, phoneRegex } from "../../../../lib/utils";
import { handleCityChange, handleSubcityChange } from "./filterAddress";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  phone: z
    .string()
    .min(1, { message: "Phone is required" })
    .refine(
      (data) => {
        return phoneRegex.test(data);
      },
      { message: "Invalid phone number" }
    ),
  email: z.string(),
  // idNumber: z.object({
  //   type: z.string().min(1, { message: "ID number type is required" }),
  //   value: z.string().min(1, { message: "ID number is required" }),
  // }),
  address: z.object({
    city: z.string().min(1, { message: "City is required" }),
    subcity: z.string().min(1, { message: "Subcity is required" }),
    woreda: z.string().min(1, { message: "Woreda is required" }),
  }),
});

const pcFormSchema = z.object({
  pcName: z.string().min(1, { message: "Full name is required" }),
  pcPhone: z
    .string()
    .min(1, { message: "Phone is required" })
    .refine(
      (data) => {
        return phoneRegex.test(data);
      },
      { message: "Invalid phone number" }
    ),
  pcEmail: z
    .string()
    .min(1, { message: "Email is required" })
    .refine(
      (data) => {
        return emailRegex.test(data);
      },
      { message: "Invalid email address" }
    ),
  licenseNo: z.string().optional(),
  tinNo: z.string().min(1, { message: "TIN number is required" }),
  purpose: z.string().min(1, { message: "Purpose is required" }),
  accNo: z.string().optional(),
  pcAddress: z.object({
    city: z.string().min(1, { message: "City is required" }),
    subcity: z.string().min(1, { message: "Subcity is required" }),
    woreda: z.string().min(1, { message: "Woreda is required" }),
  }),
});

const ChangeProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [isEditableQual, setIsEditableQUal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredSubcities, setFilteredSubcities] = useState<Subcity[] | []>(
    []
  );
  const [filteredWoredas, setFilteredWoredas] = useState<Woreda[] | []>([]);
  const [filteredPcSubcities, setFilteredPcSubcities] = useState<
    Subcity[] | []
  >([]);
  const [filteredPcWoredas, setFilteredPcWoredas] = useState<Woreda[] | []>([]);
  // const token = localStorage.getItem("token");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwOTEyMDc4NjQwIiwicm9sZSI6IkZBUk1FUiIsImV4cCI6MTcwNzE2MzMzNiwiaWF0IjoxNzA3MTIwMTM2LCJ1c2VySWQiOjEwNTIsImF1dGhvcml0aWVzIjpbImxvYW5fYXBwbGljYXRpb24iLCJyZWdpc3Rlcl9sYW5kX2FyZWEiXX0.MNk651WSwYfIegG9L9NIotbvzxJEvf_jJLMweggvVz8";

  type FormValues = z.infer<typeof formSchema>;
  type PcFormValues = z.infer<typeof pcFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "Bahar Mm",
      phone: "0912078640",
      email: "",
      // idNumber: { type: "", value: "" },
      address: { city: "", subcity: "", woreda: "" },
    },
  });

  const PcForm = useForm<PcFormValues>({
    resolver: zodResolver(pcFormSchema),
    defaultValues: {
      pcName: "",
      pcPhone: "",
      pcEmail: "",
      licenseNo: "",
      tinNo: "",
      accNo: "",
      purpose: "",
      pcAddress: {
        city: "",
        subcity: "",
        woreda: "",
      },
    },
  });

  const specialisedFieldss = [
    { label: "Specialised Fields-1", value: "sp1" },
    { label: "Specialised Fields-2", value: "sp2" },
    { label: "Specialised Fields-3", value: "sp3" },
    { label: "Specialised Fields-4", value: "sp4" },
    { label: "Specialised Fields-5", value: "sp5" },
  ];

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setIsEditable(false);
    } catch (error: any) {
      if (error.message === "Network error: Unable to connect to the server.") {
        toast.error("Network error: Unable to connect to the server");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmitQual = async (data: PcFormValues) => {
    try {
      setLoading(true);
      setIsEditableQUal(false);
    } catch (error: any) {
      if (error.message === "Network error: Unable to connect to the server.") {
        toast.error("Network error: Unable to connect to the server");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 ">
        <span className="text-xl">Profile Details</span>
      </div>
      <Separator className="my-4" />
      <div className="spaye-y-4 py-2 pb-4 w-ull">
        <div className="flex items-center justify-between mb-3">
          <span className="text-md font-bold">
            Primary Cooperative Information:
          </span>
          {!isEditableQual && (
            <Button variant={"ghost"} onClick={() => setIsEditableQUal(true)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
        <Form {...PcForm}>
          <form onSubmit={PcForm.handleSubmit(onSubmitQual)}>
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="pcName"
                control={PcForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name:</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="trade name"
                        {...field}
                        disabled={!isEditableQual}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pcPhone"
                control={PcForm.control}
                render={({ field }) => (
                  <FormItem className="hideIncrementor">
                    <FormLabel>Phone:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="phone"
                        {...field}
                        disabled={!isEditableQual}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pcEmail"
                control={PcForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email"
                        {...field}
                        disabled={!isEditableQual}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="licenseNo"
                control={PcForm.control}
                render={({ field }) => (
                  <FormItem className="hideIncrementor">
                    <FormLabel>License No:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="license number"
                        {...field}
                        disabled={!isEditableQual}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="tinNo"
                control={PcForm.control}
                render={({ field }) => (
                  <FormItem className="hideIncrementor">
                    <FormLabel>TIN No:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="TIN number"
                        {...field}
                        disabled={!isEditableQual}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="accNo"
                control={PcForm.control}
                render={({ field }) => (
                  <FormItem className="hideIncrementor">
                    <FormLabel>Account No:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="account number"
                        {...field}
                        disabled={!isEditableQual}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={PcForm.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Purpose:</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:col-span-2 lg:col-span-3 mt-5">
                <FormLabel className="col-span-3">PC Address</FormLabel>
                <FormField
                  name="pcAddress.city"
                  control={PcForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City:</FormLabel>
                      <Select
                        disabled={loading || !isEditableQual}
                        onValueChange={(value) =>
                          handleCityChange(
                            value,
                            cities,
                            setFilteredPcSubcities,
                            PcForm.setValue,
                            "pcAddress"
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
                  name="pcAddress.subcity"
                  control={PcForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcity:</FormLabel>
                      <Select
                        disabled={loading || !isEditableQual}
                        onValueChange={(value) =>
                          handleSubcityChange(
                            value,
                            filteredPcSubcities,
                            setFilteredPcWoredas,
                            PcForm.setValue,
                            "pcAddress"
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
                          {filteredPcSubcities.length > 0 &&
                            filteredPcSubcities.map((Subcity) => (
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
                  name="pcAddress.woreda"
                  control={PcForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Woreda:</FormLabel>
                      <Select
                        disabled={loading || !isEditableQual}
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
                          {filteredPcWoredas.length > 0 &&
                            filteredPcWoredas.map((woreda) => (
                              <SelectItem
                                value={woreda.woredaName}
                                key={woreda.id}
                              >
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
            </div>
            {isEditableQual && (
              <div className="pt-6 space-x-2 flex items-center justify-center w-full">
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => {
                    setIsEditableQUal(false);
                    PcForm.clearErrors();
                    PcForm.clearErrors();
                    PcForm.reset();
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
        <Separator className="my-10" />
        <div className="flex items-center justify-between mb-3 mt-5">
          <span className="text-md font-bold">Admin Information:</span>
          {!isEditable && (
            <Button variant={"ghost"} onClick={() => setIsEditable(true)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
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
                            <SelectItem
                              value={woreda.woredaName}
                              key={woreda.id}
                            >
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
              <div className="pt-6 space-x-2 flex items-center justify-center w-full">
                <Button
                  type="button"
                  variant={"ghost"}
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
      </div>
    </div>
  );
};

export default ChangeProfile;
