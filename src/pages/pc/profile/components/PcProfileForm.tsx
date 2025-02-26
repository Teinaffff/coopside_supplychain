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
import { Textarea } from "../../../../common/ui/textarea";
import { Subcity, Woreda } from "../../../../constants/interface/pc/general";
import {
  pcFormSchema,
  PcFormValues,
} from "../../../../constants/schema/profile";
import { handleCityChange, handleSubcityChange } from "./filterAddress";

type PcProfileFormProps = {
  onSubmitPc: (data: PcFormValues) => void;
  setIsEditablePc: (data: boolean) => void;
  isEditablePc: boolean;
  loading: boolean;
};

const PcProfileForm: React.FC<PcProfileFormProps> = ({
  onSubmitPc,
  isEditablePc,
  loading,
  setIsEditablePc,
}) => {
  const [filteredPcSubcities, setFilteredPcSubcities] = useState<
    Subcity[] | []
  >([]);
  const [filteredPcWoredas, setFilteredPcWoredas] = useState<Woreda[] | []>([]);

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
 
  return (
    <Form {...PcForm}>
      <form onSubmit={PcForm.handleSubmit(onSubmitPc)}>
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
                    disabled={!isEditablePc}
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
                    disabled={!isEditablePc}
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
                    disabled={!isEditablePc}
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
                    disabled={!isEditablePc}
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
                    disabled={!isEditablePc}
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
                    disabled={!isEditablePc}
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
                    disabled={loading || !isEditablePc}
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
                    disabled={loading || !isEditablePc}
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
                    disabled={loading || !isEditablePc}
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
        </div>
        {isEditablePc && (
          <div className="pt-6 space-x-3 flex items-center justify-end w-full">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                console.log('object')
                setIsEditablePc(false);
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
  );
};

export default PcProfileForm;
