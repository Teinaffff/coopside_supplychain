import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Badge } from "../../../../common/ui/badge";
import { DataTable } from "../../../../common/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { ProcessedLoanApplication } from "../../../../lib/loan-status-utils";

interface LoanStatusTrackingProps {
  applications: ProcessedLoanApplication[];
  onViewDetails: (application: ProcessedLoanApplication) => void;
}

const LoanStatusTracking: React.FC<LoanStatusTrackingProps> = ({
  applications,
  onViewDetails
}) => {
  const getTrackingStatusBadge = (status: "DISBURSED" | "NOT_DISBURSED") => {
    const config = {
      DISBURSED: { 
        variant: "default" as const, 
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle
      },
      NOT_DISBURSED: { 
        variant: "secondary" as const, 
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock
      }
    };

    const statusConfig = config[status];
    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant} className={statusConfig.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const columns: ColumnDef<ProcessedLoanApplication>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application No.",
      cell: ({ row }) => (
        <div className="text-blue-600 font-medium py-2 cursor-pointer hover:text-blue-800">
          {row.getValue("applicationNumber")}
        </div>
      ),
    },
    {
      accessorKey: "borrowerName",
      header: "Borrower Name",
      cell: ({ row }) => (
        <div className="py-2">
          {row.original.borrowerName || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "loanType",
      header: "Loan Type",
      cell: ({ row }) => (
        <div className="py-2">
          <Badge variant="outline">{row.getValue("loanType")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "approvedAmount",
      header: "Approved Amount",
      cell: ({ row }) => (
        <div className="py-2 font-medium">
          {row.original.approvedAmount ? `ETB ${row.original.approvedAmount.toLocaleString()}` : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "trackingStatus",
      header: "Disbursement Status",
      cell: ({ row }) => (
        <div className="py-2">
          {row.original.trackingStatus ? getTrackingStatusBadge(row.original.trackingStatus) : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "created",
      header: "Approved Date",
      cell: ({ row }) => (
        <div className="py-2">
          {new Date(row.getValue("created")).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const trackingApplications = applications.filter(app => app.shouldShowInTracking);

  const stats = {
    total: trackingApplications.length,
    disbursed: trackingApplications.filter(app => app.trackingStatus === "DISBURSED").length,
    notDisbursed: trackingApplications.filter(app => app.trackingStatus === "NOT_DISBURSED").length,
    totalValue: trackingApplications.reduce((sum, app) => sum + (app.approvedAmount || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Loan Status Tracking</h2>
        <p className="text-gray-600">Track approved loans and their disbursement status</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Approved loan applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disbursed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.disbursed}</div>
            <p className="text-xs text-muted-foreground">
              Loans disbursed to borrowers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Disbursement</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.notDisbursed}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting disbursement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <span className="text-lg font-bold">ETB</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ETB {stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total approved loan value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tracking Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Approved Loans Tracking</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {trackingApplications.length > 0 ? (
            <DataTable
              columns={columns}
              data={trackingApplications}
              searchKey="applicationNumber"
              searchPlaceholder="Search approved loans..."
              clickable={true}
              getSelectedRow={onViewDetails}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No approved loans available for tracking</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanStatusTracking;
