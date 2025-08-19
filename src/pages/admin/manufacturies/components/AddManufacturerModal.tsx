import { Modal } from "../../../../common/ui/modal";
import { useAddManufacturerModal } from "../../hooks/use-add-manufacturer-modal";
import { ManufacturerFormValues } from "../../../../schema/admin/manufacturer";
import { useManufacturers } from "../../hooks/use-manufacturers";
import ManufacturerForm from "./ManufacturerForm";

export const AddManufacturerModal = () => {
  const { isOpen, onClose } = useAddManufacturerModal();
  const { handleAddManufacturer, isAddManufacturerLoading } =
    useManufacturers();

  const handleSubmit = (data: ManufacturerFormValues) => {
    handleAddManufacturer(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Factory"
        description="Manage Factory Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <ManufacturerForm
          defaultValues={{
            factoryName: "",
            factoryCode: "",
            factoryType: "",
            tinNumber: "",
            registrationNumber: "",
            licenseNumber: "",
            licenseExpiryDate: "",
            headOfficeAddress: {
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country: "",
            },
            factoryAddresses: [{
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country: "",
            }],
            gpsCoordinates: "",
            website: "",
            phoneNumber: "",
            faxNumber: "",
            contactPerson: "",
            alternateContactPerson: "",
            operatingLicenses: [],
            certifications: [],
            mainProducts: [],
            productionCapacity: "",
            productionLines: [],
            machineryList: [],
            rawMaterialSources: [],
            warehouseCapacity: "",
            numberOfEmployees: 0,
            hrContact: "",
            suppliers: [],
            distributors: [],
            exportImportLicenses: [],
            bankAccountInfo: {
              accountNumber: "",
              accountName: "",
              bankName: "",
              branchName: "",
              swiftCode: "",
              iban: "",
            },
            preferredCurrency: "",
            billingAddress: {
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country: "",
            },
            paymentTerms: "",
            erpSystem: "",
            apiIntegrationId: "",
          }}
          onSubmit={handleSubmit}
          loading={isAddManufacturerLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
