import React from "react";
import { Card, CardContent } from "../../../../common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../../common/ui/table";
import { History } from "../../../../constants/interface/pc/general";

interface HistoryProps {
  data: History[];
}

const TopMembersTable: React.FC<HistoryProps> = ({ data }) => {
  return (
    <Card className="py-5">
      <CardContent>
        <div className="mb-5">
          <h2 className="text-md font-semibold tracking-tight hover:cursor-pointer">
            Top Performing Members
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Share</TableHead>
              <TableHead>Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((history) => (
              <TableRow key={history.id}>
                <TableCell className="font-medium py-3">{history.id}</TableCell>
                <TableCell>{history.name}</TableCell>
                <TableCell>{history.share}</TableCell>
                <TableCell>{history.profit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopMembersTable;
