import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../../common/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../../../../common/ui/dropdown-menu";
import { Payment } from "../../../../constants/interface/admin/payment";

interface CellActionsProps {
  data: Payment;
}

export const CellActions: React.FC<CellActionsProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <>
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
            onClick={() => navigate(`/admin/payments/${data.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
