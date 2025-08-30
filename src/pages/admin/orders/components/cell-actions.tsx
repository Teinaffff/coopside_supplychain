import { CheckCircle, Eye, MoreHorizontal, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { AlertModal } from "../../../../common/modals/alert-modal";
import { Button } from "../../../../common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../common/ui/dropdown-menu";
import { Order } from "../../../../constants/interface/admin/order";
import { useOrders } from "../../hooks/use-orders";

interface CellActionsProps {
  data: Order;
}

export const CellActions: React.FC<CellActionsProps> = ({ data }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { updateOrderStatus, cancelOrder } = useOrders();

  const onDelete = async () => {
    try {
      setLoading(true);
      cancelOrder(data.id);
      setOpen(false);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateStatus = (status: string) => {
    updateOrderStatus({ orderId: data.id, status });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => navigate(`/admin/orders/${data.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {data.status === "PENDING" && (
            <DropdownMenuItem onClick={() => onUpdateStatus("CONFIRMED")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
          )}
          {data.status === "CONFIRMED" && (
            <DropdownMenuItem onClick={() => onUpdateStatus("FORWARDED")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Forward
            </DropdownMenuItem>
          )}
          {data.status === "FORWARDED" && (
            <DropdownMenuItem onClick={() => onUpdateStatus("DELIVERED")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Delivered
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
