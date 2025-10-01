import React from "react";
import { Card, CardContent } from "../../../common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../common/ui/table";
// Local lightweight type to avoid admin dependency
type RecentProductTransaction = {
  id: string | number;
  buyer: string;
  date: string;
  productName: string;
  quantity: number | string;
  totalSales: number | string;
  transactionId: string;
  remark?: string;
};

interface RecentProductTransactionProps {
  data: RecentProductTransaction[];
}

const RecentTransactionTable: React.FC<RecentProductTransactionProps> = ({
  data,
}) => {
  return (
    <Card className="py-5">
      <CardContent>
        <div className="mb-5">
          <h2 className="text-md font-semibold tracking-tight hover:cursor-pointer">
            Recent Transactions
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>TrxnID</TableHead>
              <TableHead>Remark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((history) => (
              <TableRow key={history.id}>
                <TableCell className="font-medium py-3">{history.id}</TableCell>
                <TableCell>{history.buyer}</TableCell>
                <TableCell>{history.date}</TableCell>
                <TableCell>{history.productName}</TableCell>
                <TableCell>{history.quantity}</TableCell>
                <TableCell>{history.totalSales}</TableCell>
                <TableCell>{history.transactionId}</TableCell>
                <TableCell>{history.remark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionTable;
