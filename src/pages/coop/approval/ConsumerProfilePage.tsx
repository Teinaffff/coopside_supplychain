import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { consumersMockData } from "../../../common/data/data";
import { ArrowLeft } from "lucide-react";

const ConsumerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const consumer = useMemo(
    () => consumersMockData.find((c) => c.id.toString() === id),
    [id]
  );

  // Mock Credit Data Report from another portal
  const creditReport = useMemo(() => {
    // simple deterministic data based on id
    const base = Number(id) % 3;
    const score = base === 0 ? 742 : base === 1 ? 682 : 615;
    const risk = score >= 720 ? "Low" : score >= 660 ? "Medium" : "High";
    const limit = base === 0 ? 30000 : base === 1 ? 20000 : 10000;
    const balance = base === 0 ? 4500 : base === 1 ? 7600 : 1200;
    const utilization = Math.round((balance / limit) * 100);
    const delinquency = base === 2 ? "1 (30 days)" : "0";
    const lastUpdated = new Date().toISOString().split("T")[0];
    const accounts = [
      { id: 1, type: "Revolving", provider: "Bank A", limit, balance, status: "OPEN" },
      { id: 2, type: "Installment", provider: "Finance Co.", limit: 5000, balance: base === 1 ? 2200 : 0, status: base === 1 ? "OPEN" : "CLOSED" },
    ];
    return { score, risk, limit, balance, utilization, delinquency, lastUpdated, accounts };
  }, [id]);

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

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" className="flex items-center space-x-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" /> <span>Back</span>
      </Button>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>{consumer.fullLegalName} – Profile</CardTitle>
          <div className="text-sm">
            <span className="font-medium mr-2">Credit Score:</span>
            <span className={
              creditReport.score >= 720
                ? "px-2 py-1 rounded bg-emerald-100 text-emerald-700"
                : creditReport.score >= 660
                ? "px-2 py-1 rounded bg-yellow-100 text-yellow-700"
                : "px-2 py-1 rounded bg-red-100 text-red-700"
            }>
              {creditReport.score} ({creditReport.risk} Risk)
            </span>
          </div>
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

          {/* Credit Data Report (from other portal - mocked) */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Credit Data Report</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoField label="Score" value={creditReport.score} />
              <InfoField label="Risk" value={creditReport.risk} />
              <InfoField label="Limit" value={`ETB ${creditReport.limit.toLocaleString()}`} />
              <InfoField label="Balance" value={`ETB ${creditReport.balance.toLocaleString()}`} />
              <InfoField label="Utilization" value={`${creditReport.utilization}%`} />
              <InfoField label="Delinquency" value={creditReport.delinquency} />
              <InfoField label="Last Updated" value={creditReport.lastUpdated} />
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Account Type</th>
                    <th className="px-3 py-2 text-left font-medium">Provider</th>
                    <th className="px-3 py-2 text-left font-medium">Limit</th>
                    <th className="px-3 py-2 text-left font-medium">Balance</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {creditReport.accounts.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2">{a.type}</td>
                      <td className="px-3 py-2">{a.provider}</td>
                      <td className="px-3 py-2">ETB {a.limit.toLocaleString()}</td>
                      <td className="px-3 py-2">ETB {a.balance.toLocaleString()}</td>
                      <td className="px-3 py-2">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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