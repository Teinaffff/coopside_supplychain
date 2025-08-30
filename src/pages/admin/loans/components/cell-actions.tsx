import { MoreHorizontal } from "lucide-react";
import { Button } from "../../../../common/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "../../../../common/ui/dropdown-menu";
import { Loan } from "../../../../constants/interface/admin/loan";

interface CellActionsProps {
  data: Loan;
}

export const CellActions: React.FC<CellActionsProps> = ({ data }) => {
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
          {/* <DropdownMenuItem onClick={() => handleEdit(data)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownloadDocuments(data)}>
            <Download className="mr-2 h-4 w-4" />
            Download Documents
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
