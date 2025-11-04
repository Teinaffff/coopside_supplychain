import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../common/ui/dialog";
import { Badge } from "../../../../common/ui/badge";
import { Card as CardType } from "../../../../constants/interface/coop/card";
import userService from "../../../../services/userService";

interface CardDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: CardType | null;
}

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-2 py-2">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="col-span-2 text-sm break-all">{value ?? "—"}</div>
  </div>
);

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ open, onOpenChange, card }) => {
  const [approverName, setApproverName] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprover = async () => {
      try {
        const approverIdRaw = card?.approvedBy;
        if (!open) {
          setApproverName(null);
          return;
        }
        // If approvedBy is null/undefined and the status is approved by partner,
        // default to Super Admin
        if ((approverIdRaw === undefined || approverIdRaw === null) && card?.approvalStatus === "APPROVED") {
          setApproverName("Super Admin");
          return;
        }
        if (approverIdRaw === undefined || approverIdRaw === null) {
          setApproverName(null);
          return;
        }
        const approverId = Number(approverIdRaw);
        if (Number.isNaN(approverId)) {
          setApproverName(null);
          return;
        }
        let first = "";
        let last = "";
        try {
          const user = await userService.getUserById(approverId);
          first = user.firstName || "";
          last = user.lastName || "";
        } catch {
          // fallback: fetch all users and find by id
          const users = await userService.getAllUsers();
          const fallback = users.find((u) => Number(u.id) === approverId);
          if (fallback) {
            first = fallback.firstName || "";
            last = fallback.lastName || "";
          }
        }
        const full = `${first}${first && last ? " " : ""}${last}`.trim();
        setApproverName(full || null);
      } catch (e) {
        setApproverName(null);
      }
    };
    fetchApprover();
  }, [open, card?.approvedBy]);

  const formatCurrency = (amount?: number | null) =>
    amount === undefined || amount === null ? "—" : `ETB ${amount.toLocaleString()}`;

  const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString() : "—");

  const expiry = card?.expiryMonth && card?.expiryYear
    ? `${card.expiryMonth.toString().padStart(2, "0")}/${card.expiryYear}`
    : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
          <DialogDescription>Detailed information for the selected card</DialogDescription>
        </DialogHeader>

        {card && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{card.cardType}</Badge>
              <Badge variant="outline">{card.cardStatus}</Badge>
              {card.isUsable !== undefined && (
                <Badge variant="outline">{card.isUsable ? "Usable" : "Not Usable"}</Badge>
              )}
            </div>

            <div className="bg-muted/40 rounded-md p-4">
              <Field label="Card Number" value={card.cardNumber} />
              <Field label="Card Name" value={card.cardName} />
              <Field label="Credit Limit" value={formatCurrency(card.creditLimit)} />
              <Field label="Spent Amount" value={formatCurrency(card.spentAmount)} />
              <Field label="Available Balance" value={formatCurrency(card.availableBalance)} />
              <Field label="Daily Limit" value={formatCurrency(card.dailyLimit)} />
              <Field label="Issue Date" value={formatDate(card.issuedDate)} />
              <Field label="Last Used" value={formatDate(card.lastUsed)} />
              <Field label="Expiry" value={expiry} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Approval</div>
                <div className="bg-muted/30 rounded-md p-3 text-sm">
                  <div>Approved/Rejected By: {approverName ?? "—"}</div>
                  <div>Approved/Rejected At: {formatDate(card.approvedAt ?? undefined)}</div>
                  <div>Rejection Reason: {card.rejectionReason ?? "—"}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Other</div>
                <div className="bg-muted/30 rounded-md p-3 text-sm">
                  <div>Created: {formatDate(card.createdAt)}</div>
                  <div>Updated: {formatDate(card.updatedAt)}</div>
                  <div>Expired: {card.isExpired ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsModal;


