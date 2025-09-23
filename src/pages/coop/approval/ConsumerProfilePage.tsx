import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { consumersMockData } from "../../../common/data/data";
import { ArrowLeft, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const ConsumerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const consumer = useMemo(
    () => consumersMockData.find((c) => c.id.toString() === id),
    [id]
  );

  const [isIssuing, setIsIssuing] = useState(false);

  const handleIssueCard = () => {
    if (!consumer) return;
    setIsIssuing(true);
    // simulate api
    setTimeout(() => {
      setIsIssuing(false);
      toast.success(`Card issued for ${consumer.fullLegalName}`);
    }, 1000);
  };

  if (!consumer) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Consumer Not Found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const isApproved = consumer.onboardingStatus === "APPROVED";

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" className="flex items-center space-x-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" /> <span>Back</span>
      </Button>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{consumer.fullLegalName} – Profile</CardTitle>
          {isApproved && (
            <Button size="sm" onClick={handleIssueCard} disabled={isIssuing}>
              {isIssuing ? "Issuing..." : (
                <span className="flex items-center space-x-1"><CreditCard className="w-4 h-4"/><span>Issue Card</span></span>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Employee ID" value={consumer.employeeId} />
            <InfoField label="Mobile" value={consumer.mobileNumber} />
            <InfoField label="Department" value={consumer.department} />
            <InfoField label="Job Title" value={consumer.jobTitle} />
            <InfoField label="Institution" value={consumer.institution.fullLegalName} />
            <InfoField label="Status" value={consumer.onboardingStatus} />
          </div>

          {/* Document uploads placeholder */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Uploaded Documents</h4>
            <p className="text-sm text-gray-600">(Mocked) Document list would appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface InfoFieldProps { label:string; value:string | number | undefined }
const InfoField: React.FC<InfoFieldProps> = ({label,value}) => (
  <div className="flex justify-between p-2 bg-gray-50 rounded">
    <span className="font-medium text-sm text-gray-600">{label}</span>
    <span className="text-sm text-gray-900">{value}</span>
  </div>
);

export default ConsumerProfilePage;