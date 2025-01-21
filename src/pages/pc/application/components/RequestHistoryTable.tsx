import React from "react";
import { Card, CardContent } from "../../../../common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../common/ui/table";
import { RequestHistory } from "../../../../constants/interface/pc/general";
import { Badge } from "../../../../common/ui/badge";

interface RequestHistoryProps {
  data: RequestHistory[]; // Define a suitable interface for your request history data
}

const RequestHistoryTable: React.FC<RequestHistoryProps> = ({ data }) => {
  return (
    <Card className="py-5">
      <CardContent>
        <div className="mb-5">
          <h2 className="text-md font-semibold tracking-tight hover:cursor-pointer">
            Request History
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium py-3">
                  {request.type}
                </TableCell>
                <TableCell>{request.submittedDate}</TableCell>
                <TableCell>{request.approvedDate}</TableCell>
                <TableCell className="text-cyan-600">
                  <Badge
                    variant={null}
                    className={`pb-1 ${
                      request.status === "Approved"
                        ? "bg-green-600"
                        : request.status === "Pending"
                        ? "bg-cyan-500"
                        : "bg-red-600"
                    } text-white`}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>{request.expiryDate}</TableCell>
                <TableCell className="text-cyan-600 hover:cursor-pointer">
                  View
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestHistoryTable;
