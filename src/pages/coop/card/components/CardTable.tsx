import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import { Checkbox } from "../../../../common/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../common/ui/dropdown-menu";
import { DataTable } from "../../../../common/ui/data-table";
import { Card, CardAction } from "../../../../constants/interface/coop/card";
import { MoreHorizontal } from "lucide-react";

interface CardTableProps {
  cards: Card[];
  onCardAction: (cardId: string, action: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
}

const CardTable: React.FC<CardTableProps> = ({
  cards,
  onCardAction,
  onSelectionChange,
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const getStatusBadge = (status: Card["status"]) => {
    const statusConfig = {
      PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "Approved", className: "bg-blue-100 text-blue-800" },
      REJECTED: { label: "Rejected", className: "bg-red-100 text-red-800" },
      ACTIVE: { label: "Active", className: "bg-green-100 text-green-800" },
      INACTIVE: { label: "Inactive", className: "bg-gray-100 text-gray-800" },
      SUSPENDED: { label: "Suspended", className: "bg-orange-100 text-orange-800" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };


  const getTypeBadge = (type: Card["type"]) => {
    const typeConfig = {
      CREDIT: { label: "Credit", className: "bg-blue-100 text-blue-800" },
      DEBIT: { label: "Debit", className: "bg-green-100 text-green-800" },
      PREPAID: { label: "Prepaid", className: "bg-purple-100 text-purple-800" },
    };

    const config = typeConfig[type] || typeConfig.CREDIT;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getRiskLevelBadge = (riskLevel?: Card["riskLevel"]) => {
    if (!riskLevel) return null;
    
    const riskConfig = {
      LOW: { label: "Low", className: "bg-green-100 text-green-800" },
      MEDIUM: { label: "Medium", className: "bg-yellow-100 text-yellow-800" },
      HIGH: { label: "High", className: "bg-red-100 text-red-800" },
    };

    const config = riskConfig[riskLevel] || riskConfig.LOW;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const maskCardNumber = (cardNumber: string) => {
    if (cardNumber.length <= 4) return cardNumber;
    const lastFour = cardNumber.slice(-4);
    const masked = "*".repeat(cardNumber.length - 4);
    return `${masked} ${lastFour}`;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = cards.map(card => card.id);
      setSelectedRows(allIds);
      onSelectionChange(allIds);
    } else {
      setSelectedRows([]);
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (cardId: string, checked: boolean) => {
    let newSelection: string[];
    if (checked) {
      newSelection = [...selectedRows, cardId];
    } else {
      newSelection = selectedRows.filter(id => id !== cardId);
    }
    setSelectedRows(newSelection);
    onSelectionChange(newSelection);
  };

  const getCardActions = (card: Card): CardAction[] => {
    const baseActions: CardAction[] = [
      { id: "view", label: "View Details", action: "view", icon: "eye" },
      { id: "edit", label: "Edit", action: "edit", icon: "edit" },
    ];

    const statusActions: CardAction[] = [];
    
    switch (card.status) {
      case "PENDING":
        statusActions.push(
          { id: "approve", label: "Approve", action: "approve", icon: "check", variant: "default" },
          { id: "reject", label: "Reject", action: "reject", icon: "x", variant: "destructive" }
        );
        break;
      case "APPROVED":
        statusActions.push(
          { id: "activate", label: "Activate", action: "activate", icon: "play", variant: "default" }
        );
        break;
      case "ACTIVE":
        statusActions.push(
          { id: "suspend", label: "Suspend", action: "suspend", icon: "pause", variant: "destructive" }
        );
        break;
      case "SUSPENDED":
        statusActions.push(
          { id: "activate", label: "Activate", action: "activate", icon: "play", variant: "default" }
        );
        break;
    }

    statusActions.push(
      { id: "delete", label: "Delete", action: "delete", icon: "trash", variant: "destructive", requiresConfirmation: true }
    );

    return [...baseActions, ...statusActions];
  };

  const columns: ColumnDef<Card>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={selectedRows.length === cards.length && cards.length > 0}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRows.includes(row.original.id)}
          onCheckedChange={(checked) => handleSelectRow(row.original.id, checked as boolean)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "cardNumber",
      header: "Card Number",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {maskCardNumber(row.original.cardNumber)}
        </div>
      ),
    },
    {
      accessorKey: "cardName",
      header: "Card Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.cardName}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => getTypeBadge(row.original.type),
    },
    {
      accessorKey: "creditLimit",
      header: "Credit Limit",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.creditLimit ? formatCurrency(row.original.creditLimit) : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "availableBalance",
      header: "Available Balance",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.availableBalance ? formatCurrency(row.original.availableBalance) : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "riskLevel",
      header: "Risk Level",
      cell: ({ row }) => getRiskLevelBadge(row.original.riskLevel),
    },
    {
      accessorKey: "requestedDate",
      header: "Requested Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.requestedDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "issuedDate",
      header: "Issued Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.issuedDate ? new Date(row.original.issuedDate).toLocaleDateString() : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "partnerStatus",
      header: "Partner Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "adminStatus",
      header: "Super Admin Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const actions = getCardActions(row.original);
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => onCardAction(row.original.id, action.action)}
                  className={action.variant === "destructive" ? "text-red-600" : ""}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={cards}
        searchKey="cardName"
        searchPlaceholder="Search cards..."
      />
      
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            {selectedRows.length} of {cards.length} row(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Bulk Approve
            </Button>
            <Button variant="outline" size="sm">
              Bulk Reject
            </Button>
            <Button variant="outline" size="sm">
              Export Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardTable;
