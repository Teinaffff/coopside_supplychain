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
import { MemberShares } from "../../../../constants/interface/pc/members";
import { Badge } from "../../../../common/ui/badge";

interface MemberSharesProps {
  data: MemberShares[];
}

const MemberSharesTable: React.FC<MemberSharesProps> = ({ data }) => {
  return (
    <Card className="py-5">
      <CardContent>
        <div className="mb-5">
          <h2 className="text-md font-semibold tracking-tight hover:cursor-pointer">
            Share Holdings
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price Per Share</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((share) => (
              <TableRow key={share.id}>
                <TableCell className="font-medium py-3">
                  {share.shareName}
                </TableCell>
                <TableCell>{share.pricePerShare}</TableCell>
                <TableCell>{share.quantity}</TableCell>
                <TableCell>{share.purchaseDate}</TableCell>
                <TableCell>{share.totalPrice}</TableCell>
                <TableCell>{share.profit}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      share.status === "Active"
                        ? "bg-cyan-500 hover:bg-cyan-500"
                        : share.status === "Pending"
                        ? "bg-orange-400 hover:bg-orange-400"
                        : "bg-red-500 hover:bg-red-500"
                    } rounded-full`}
                  >
                    {share.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MemberSharesTable;
