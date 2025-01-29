import { AlertCircle, Building2 } from "lucide-react";
import { Card } from "../../../common/ui/card";
import RequestForm from "../components/RequestForm";

const BankPage = () => {
  return (
    <div className="flex flex-col space-y-5">
      <Card className="p-6 flex flex-col space-y-8">
        {/* Top div */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-100 p-3 rounded-full">
              <Building2 className="text-cyan-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Account Status</h2>
              <p className="text-muted-foreground">
                Current bank account information
              </p>
            </div>
          </div>
          <p className="flex items-center h-full px-3 py-2 text-sm font-semibold rounded-full bg-orange-100 text-orange-500">
            <AlertCircle className="w-5 h-5 mr-1" />
            <span>Pending</span>
          </p>
        </div>

        {/* second div  */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-muted-foreground font-medium">
              Account Number
            </span>
            <p className="text-lg font-semibold">1000123456789</p>
          </div>
          <div className="mt-4">
            <span className="text-muted-foreground font-medium">
              Account Name
            </span>
            <p>Primary Cooperative One</p>
          </div>
          <div>
            <span className="text-muted-foreground font-medium">Bank Name</span>
            <p>Commercial Bank of Ethiopia</p>
          </div>
          <div className="mt-4">
            <span className="text-muted-foreground font-medium">Opened By</span>
            <p>Lemi Cooperative Office</p>
          </div>
          <div>
            <span className="text-muted-foreground font-medium">
              Opening Date
            </span>
            <p>2024-02-15</p>
          </div>
          <div>
            <span className="text-muted-foreground font-medium">Branch</span>
            <p>Addis Ababa Main</p>
          </div>
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
