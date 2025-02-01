import { AlertCircle, Building2 } from "lucide-react";
import { Card } from "../../../common/ui/card";
import RequestForm from "../components/RequestForm";

const BankPage = () => {
  const bankDetails = [
    { label: "Account Number", value: "1000123456789" },
    { label: "Account Name", value: "Primary Cooperative One" },
    { label: "Bank Name", value: "Commercial Bank of Ethiopia" },
    { label: "Opened By", value: "Lemi Cooperative Office" },
    { label: "Opening Date", value: "2024-02-15" },
    { label: "Branch", value: "Addis Ababa Main" },
  ];

  return (
    <div className="flex flex-col space-y-5">
      <Card className="p-6 flex flex-col space-y-8">
        {/* Top div */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-100 dark:bg-cyan-900 p-3 rounded-full">
              <Building2 className="text-cyan-500 dark:text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold dark:text-white">Account Status</h2>
              <p className="text-muted-foreground">
                Current bank account information
              </p>
            </div>
          </div>
          <div className="flex items-center  h-full px-3 py-2 text-sm font-semibold rounded-full bg-orange-100 dark:bg-orange-900 text-orange-500 dark:text-orange-400">
            <AlertCircle className="w-5 h-5 mr-1" />
            <span>Pending</span>
          </div>
        </div>

        {/* second div  */}
        <div className="grid md:grid-cols-2 gap-4">
          {bankDetails.map((detail, index) => (
            <div key={index} className={index % 2 === 1 ? "mt-4 md:mt-0" : ""}>
              <span className="text-muted-foreground font-medium">
                {detail.label}
              </span>
              <p className="text-lg font-semibold dark:text-white">{detail.value}</p>
            </div>
          ))}
        </div>
      </Card>
      <RequestForm
        title="Submit an Appeal"
        subtitle="If you need to appeal for bank account status, please provide detailed information below"
        placeholder="Please explain why you are submitting this appeal..."
        buttonText="Submit Appeal"
      />
    </div>
  );
};

export default BankPage;
