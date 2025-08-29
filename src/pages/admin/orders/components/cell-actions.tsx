import { Copy, MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
import { AlertModal } from "../../../../common/modals/alert-modal";

interface CellActionsProps {
  data: Order;
}

export const CellActions: React.FC<CellActionsProps> = ({ data }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { updateOrderStatus, cancelOrder } = useOrders();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to the clipboard.");
  };

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
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/admin/orders/${data.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {data.status === 'PENDING' && (
            <DropdownMenuItem onClick={() => onUpdateStatus('CONFIRMED')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Order
            </DropdownMenuItem>
          )}
          {data.status === 'CONFIRMED' && (
            <DropdownMenuItem onClick={() => onUpdateStatus('PROCESSING')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Start Processing
            </DropdownMenuItem>
          )}
          {data.status === 'PROCESSING' && (
            <DropdownMenuItem onClick={() => onUpdateStatus('SHIPPED')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Shipped
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