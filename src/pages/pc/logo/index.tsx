import { AlertCircle, Pencil } from "lucide-react";
import { IMAGES } from "../../../assets";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { Heading } from "../../../common/ui/heading";
import RequestForm from "../components/RequestForm";
import { usePcRequest } from "../components/use-pc-request";

const LogoPage = () => {
  const { handleSendPcLogoRequest, loading } = usePcRequest();

  return (
    <div className="space-y-6">
      <Card className="flex flex-col space-y-5 p-6">
        <Heading
          title={`Logo Management`}
          description="Manage your cooperative's logo and approval status"
        />

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Current Logo</h2>
            <p className="text-muted-foreground text-sm">
              Last updated: 2024-03-20
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Edit Logo
          </Button>
        </div>

        <div className="flex justify-center mt-4">
          <img
            src={IMAGES.coopLogo}
            alt="Current Logo"
            className="rounded-lg w-full max-w-lg shadow-lg p-10"
          />
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center justify-center text-orange-500 font-medium">
          <AlertCircle className="w-5 h-5" />
          <span className="ml-2">Pending Approval</span>
        </div>
      </Card>

      <RequestForm
        title="Request Approval"
        subtitle="Provide additional information for logo approval"
        placeholder="Explain why this logo should be approved..."
        buttonText="Submit Request"
        onSubmit={handleSendPcLogoRequest}
        loading={loading}
      />
    </div>
  );
};

export default LogoPage;
