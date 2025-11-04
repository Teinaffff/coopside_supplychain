import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../../common/ui/badge";
// import { Button } from "../../../../common/ui/button";
import { DataTable } from "../../../../common/ui/data-table";
import { Card } from "../../../../constants/interface/coop/card";

interface CardTableProps {
  cards: Card[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onViewCard?: (card: Card) => void;
}

const CardTable: React.FC<CardTableProps> = ({
  cards,
  onSelectionChange,
  onViewCard,
}) => {
  // Selection removed for simplified view

  const getTypeBadge = (cardType: Card["cardType"]) => {
    const typeConfig = {
      CREDIT: { label: "Credit", className: "bg-cyan-100 text-cyan-800" },
      DEBIT: { label: "Debit", className: "bg-green-100 text-green-800" },
      PREPAID: { label: "Prepaid", className: "bg-purple-100 text-purple-800" },
    };

    const config = typeConfig[cardType] || typeConfig.CREDIT;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // status badge kept if needed later

  const getApprovalStatusBadge = (approvalStatus: Card["approvalStatus"]) => {
    const statusConfig = {
      PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "Approved", className: "bg-cyan-100 text-cyan-800" },
      REJECTED: { label: "Rejected", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[approvalStatus] || statusConfig.PENDING;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };


  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  const maskCardNumber = (cardNumber: string) => {
    if (cardNumber.length <= 4) return cardNumber;
    const lastFour = cardNumber.slice(-4);
    const masked = "*".repeat(cardNumber.length - 4);
    return `${masked} ${lastFour}`;
  };

  // Selection handlers removed


  const columns: ColumnDef<Card>[] = [
    {
      accessorKey: "cardNumber",
      header: "Card Number",
      meta: { align: "left" },
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {maskCardNumber(row.original.cardNumber)}
        </div>
      ),
    },
    {
      accessorKey: "cardName",
      header: "Card Name",
      meta: { align: "left" },
      cell: ({ row }) => (
        <div className="font-medium">{row.original.cardName}</div>
      ),
    },
    {
      accessorKey: "cardType",
      header: "Type",
      meta: { align: "center" },
      cell: ({ row }) => getTypeBadge(row.original.cardType),
    },
    {
      accessorKey: "creditLimit",
      header: "Card Limit (ETB)",
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.creditLimit !== undefined && row.original.creditLimit !== null
            ? formatCurrency(row.original.creditLimit)
            : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "spentAmount",
      header: "Spent Amount (ETB)",
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.spentAmount !== undefined && row.original.spentAmount !== null
            ? formatCurrency(row.original.spentAmount)
            : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "availableBalance",
      header: "Available Balance (ETB)",
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.availableBalance !== undefined && row.original.availableBalance !== null
            ? formatCurrency(row.original.availableBalance)
            : "N/A"}
        </div>
      ),
    },
    // {
    //   accessorKey: "issuedDate",
    //   header: "Issue Date",
    //   meta: { align: "left" },
    //   cell: ({ row }) => (
    //     <div className="text-sm">
    //       {row.original.issuedDate ? new Date(row.original.issuedDate).toLocaleDateString() : "N/A"}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "approvalStatus",
      header: "Status",
      meta: { align: "center" },
      cell: ({ row }) => getApprovalStatusBadge(row.original.approvalStatus),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md border shadow-sm">
        <DataTable
          columns={columns}
          data={cards}
          searchKey="cardName"
          searchPlaceholder="Search cards..."
          clickable={true}
          getSelectedRow={onViewCard}
        />
      </div>
    </div>
  );
};

export default CardTable;
