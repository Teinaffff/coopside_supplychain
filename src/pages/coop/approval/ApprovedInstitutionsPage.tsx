import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { institutionsMockData } from "../../../common/data/data";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { ArrowLeft } from "lucide-react";

const statusClasses: Record<string, string> = {
  approved: "bg-cyan-100 text-cyan-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

const ApprovedInstitutionsPage: React.FC = () => {
  const navigate = useNavigate();

  const approvedInstitutions = useMemo(() => {
    return institutionsMockData.filter((inst) => inst.onboardingStatus?.toLowerCase() === "approved");
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" className="flex items-center space-x-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" /> <span>Back</span>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Approved Institutions</CardTitle>
        </CardHeader>
        <CardContent>
          {approvedInstitutions.length === 0 ? (
            <p className="text-sm text-gray-600">No approved institutions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Institution Name</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">Date Approved</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {approvedInstitutions.map((inst) => (
                    <tr key={inst.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-4 py-2 whitespace-nowrap">{inst.fullLegalName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{inst.institutionType}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{inst.approvedAt?.split("T")[0]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs ${statusClasses[inst.onboardingStatus]}`}>{inst.onboardingStatus}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/approval/institutions/${inst.id}`)}>
                          View Consumers
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovedInstitutionsPage;