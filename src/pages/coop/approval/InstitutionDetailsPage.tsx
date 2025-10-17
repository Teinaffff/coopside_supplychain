import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { consumersMockData, institutionsMockData } from "../../../common/data/data";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../../common/ui/dialog";
import { Textarea } from "../../../common/ui/textarea";

const statusColor: Record<string, string> = {
  APPROVED: "bg-cyan-100 text-cyan-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
};

const InstitutionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const institution = useMemo(
    () => institutionsMockData.find((inst) => inst.id.toString() === id),
    [id]
  );

  const consumers = useMemo(() => {
    return consumersMockData.filter((c) => c.institution.id.toString() === id);
  }, [id]);

  // Local state to allow inline approve/decline without mutating the global mock
  const [consumersState, setConsumersState] = useState<any[]>(consumers as any);
  useEffect(() => {
    setConsumersState(consumers);
  }, [consumers]);

  const [selectedConsumerId, setSelectedConsumerId] = useState<number | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [actionLoading, setActionLoading] = useState<null | "approve" | "decline">(null);

  const selectedConsumer = useMemo(
    () => consumersState.find((c) => c.id === selectedConsumerId) || null,
    [selectedConsumerId, consumersState]
  );

  const handleApprove = () => {
    if (!selectedConsumer) return;
    setActionLoading("approve");
    setTimeout(() => {
      setConsumersState((prev) => (prev as any[]).map((c: any) => c.id === selectedConsumer.id ? { ...c, onboardingStatus: "APPROVED" as any } : c));
      setActionLoading(null);
      setSelectedConsumerId(null);
      setDeclineReason("");
    }, 700);
  };

  const handleDecline = () => {
    if (!selectedConsumer) return;
    setActionLoading("decline");
    setTimeout(() => {
      setConsumersState((prev) => (prev as any[]).map((c: any) => c.id === selectedConsumer.id ? { ...c, onboardingStatus: "REJECTED" as any } : c));
      setActionLoading(null);
      setSelectedConsumerId(null);
      setDeclineReason("");
    }, 700);
  };

  // If the institution record is missing, but we have consumers that reference it,
  // show the consumers list with the institution name inferred from those consumers.
  if (!institution && consumers.length > 0) {
    const inferredInstitutionName = consumers[0].institution.fullLegalName;
    return (
      <div className="p-4 space-y-4">
        <Button variant="ghost" className="flex items-center space-x-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> <span>Back</span>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{inferredInstitutionName} – Employees/Consumers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Full Name</th>
                    <th className="px-4 py-2 text-left font-medium">Employee ID</th>
                    <th className="px-4 py-2 text-left font-medium">Institution</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {consumers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-4 py-2 whitespace-nowrap">{c.fullLegalName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{c.employeeId}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{c.institution.fullLegalName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs ${statusColor[c.onboardingStatus]}`}>{c.onboardingStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Institution Not Found</h2>
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
        <CardHeader>
          <CardTitle>{institution.fullLegalName} – Employees/Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          {institution.onboardingStatus?.toUpperCase() !== "APPROVED" ? (
            <p className="text-sm text-yellow-700">Consumers are visible only for approved institutions.</p>
          ) : consumers.length === 0 ? (
            <p className="text-sm text-gray-600">No consumers found for this institution.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Full Name</th>
                    <th className="px-4 py-2 text-left font-medium">Employee ID</th>
                    <th className="px-4 py-2 text-left font-medium">Institution</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {consumersState.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-4 py-2 whitespace-nowrap">{c.fullLegalName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{c.employeeId}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{c.institution.fullLegalName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs ${statusColor[c.onboardingStatus]}`}>{c.onboardingStatus}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedConsumerId(c.id)}>Preview</Button>
                          <Button size="sm" onClick={() => navigate(`/coop/approval/consumers/${c.id}`)}>View Full</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!selectedConsumer} onOpenChange={(open)=>{ if(!open) { setSelectedConsumerId(null); setDeclineReason(""); } }}>
        <DialogContent className="w-[90vw] max-w-4xl">
          {selectedConsumer && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedConsumer.fullLegalName} – Preview</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Profile fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PreviewField label="Employee ID" value={selectedConsumer.employeeId} />
                  <PreviewField label="Mobile" value={selectedConsumer.mobileNumber} />
                  <PreviewField label="Department" value={selectedConsumer.department} />
                  <PreviewField label="Job Title" value={selectedConsumer.jobTitle} />
                  <PreviewField label="Institution" value={selectedConsumer.institution.fullLegalName} />
                  <PreviewField label="Status" value={selectedConsumer.onboardingStatus} />
                </div>

                {/* Documents (mocked) */}
                <div>
                  <h4 className="font-semibold mb-2">Uploaded Documents</h4>
                  <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Name</th>
                        <th className="px-4 py-2 text-left font-medium">Type</th>
                        <th className="px-4 py-2 text-left font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                      {[
                        { id: 1, name: "National ID.pdf", type: "PDF" },
                        { id: 2, name: "Employment Letter.pdf", type: "PDF" },
                        { id: 3, name: "Payslip_Jan.png", type: "Image" },
                      ].map((d) => (
                        <tr key={d.id}>
                          <td className="px-4 py-2">{d.name}</td>
                          <td className="px-4 py-2">{d.type}</td>
                          <td className="px-4 py-2">
                            <Button size="sm" variant="outline" onClick={() => alert(`Pretend opening ${d.name}`)}>View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Decline reason */}
                <div className="space-y-2">
                  <label htmlFor="declineReason" className="text-sm font-medium">Reason for Decline <span className="text-gray-400">(optional)</span></label>
                  <Textarea id="declineReason" rows={3} value={declineReason} onChange={(e)=>setDeclineReason(e.target.value)} placeholder="Provide a reason for declining this application..." />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button variant="destructive" disabled={actionLoading === "decline"} onClick={handleDecline}>
                  {actionLoading === "decline" ? "Declining..." : "Decline"}
                </Button>
                <Button disabled={actionLoading === "approve"} onClick={handleApprove}>
                  {actionLoading === "approve" ? "Approving..." : "Approve"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PreviewField: React.FC<{label:string; value: string | number | undefined}> = ({label, value}) => (
  <div className="flex justify-between p-2 bg-gray-50 rounded">
    <span className="font-medium text-sm text-gray-600">{label}</span>
    <span className="text-sm text-gray-900">{value ?? "—"}</span>
  </div>
);

export default InstitutionDetailsPage;