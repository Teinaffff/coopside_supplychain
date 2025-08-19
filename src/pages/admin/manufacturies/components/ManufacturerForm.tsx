import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "../../../../common/ui/textarea";
import {
  manufacturerFormSchema,
  ManufacturerFormValues,
} from "../../../../schema/admin/manufacturer";

interface ManufacturerFormProps {
  defaultValues: Partial<ManufacturerFormValues>;
  onSubmit: (data: ManufacturerFormValues) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const ManufacturerForm: React.FC<ManufacturerFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const form = useForm<ManufacturerFormValues>({
    resolver: zodResolver(manufacturerFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ManufacturerFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full p-4"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="factoryName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factory Name *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="factoryCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factory Code *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="factoryType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factory Type *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="tinNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TIN Number *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="registrationNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="licenseNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="licenseExpiryDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Expiry Date *:</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="website"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="https://example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="faxNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax Number:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="contactPerson"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="alternateContactPerson"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Contact Person:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="hrContact"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HR Contact *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Head Office Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Head Office Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="headOfficeAddress.street"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="headOfficeAddress.city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="headOfficeAddress.state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="headOfficeAddress.postalCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="headOfficeAddress.country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="billingAddress.street"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="billingAddress.city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="billingAddress.state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="billingAddress.postalCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="billingAddress.country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Production Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Production Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="productionCapacity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Capacity *:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="e.g., 1000 tons/month"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="warehouseCapacity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse Capacity *:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="e.g., 5000 cubic meters"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="numberOfEmployees"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees *:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="gpsCoordinates"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS Coordinates *:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="e.g., 9.0192,38.7525"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="preferredCurrency"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Currency *:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="e.g., ETB, USD"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="paymentTerms"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms *:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="e.g., Net 30 days"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Bank Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="bankAccountInfo.bankName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankAccountInfo.branchName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankAccountInfo.accountNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankAccountInfo.accountName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankAccountInfo.swiftCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swift Code *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankAccountInfo.iban"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN *:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="erpSystem"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ERP System:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="e.g., SAP, Oracle"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="apiIntegrationId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Integration ID:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Array Fields - Simplified for now */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                name="mainProducts"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Products * (comma-separated):</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={
                          Array.isArray(field.value)
                            ? field.value.join(", ")
                            : field.value || ""
                        }
                        onChange={(e) => {
                          const products = e.target.value
                            .split(",")
                            .map((p) => p.trim())
                            .filter((p) => p);
                          field.onChange(products);
                        }}
                        disabled={loading}
                        placeholder="e.g., Cotton Fabrics, Synthetic Textiles"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="certifications"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications (comma-separated):</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={
                          Array.isArray(field.value)
                            ? field.value.join(", ")
                            : field.value || ""
                        }
                        onChange={(e) => {
                          const certs = e.target.value
                            .split(",")
                            .map((c) => c.trim())
                            .filter((c) => c);
                          field.onChange(certs);
                        }}
                        disabled={loading}
                        placeholder="e.g., ISO 9001, ISO 14001"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="operatingLicenses"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Licenses (comma-separated):</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={
                          Array.isArray(field.value)
                            ? field.value.join(", ")
                            : field.value || ""
                        }
                        onChange={(e) => {
                          const licenses = e.target.value
                            .split(",")
                            .map((l) => l.trim())
                            .filter((l) => l);
                          field.onChange(licenses);
                        }}
                        disabled={loading}
                        placeholder="e.g., Manufacturing License ML-001"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-x-2 pt-4">
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
    </div>
  );
};

export default ManufacturerForm;
