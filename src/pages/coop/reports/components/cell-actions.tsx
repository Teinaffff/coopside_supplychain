  

import {
  Calendar,
  Copy,
  Download,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Share2,
  Trash
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
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
import { Report } from "../../../../constants/interface/coop/report";

interface CellActionProps {
  data: Report;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      // Handle delete logic here
      toast.success("Report deleted successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Report ID copied to clipboard");
  };

  const onView = () => {
    toast.success("Opening report viewer");
    // Handle view logic
  };

  const onDownload = () => {
    if (data.downloadUrl) {
      // Handle download logic
      toast.success("Download started");
    } else {
      toast.error("Download URL not available");
    }
  };

  const onShare = () => {
    navigator.clipboard.writeText(data.downloadUrl || "");
    toast.success("Report link copied to clipboard");
  };

  const onSchedule = () => {
    toast.success("Report scheduled for regeneration");
    // Handle schedule logic
  };

  const onRegenerate = () => {
    toast.success("Report regeneration started");
    // Handle regenerate logic
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Delete Report"
        description="Are you sure you want to delete this report? This action cannot be undone."
      />
      <div className="flex items-center gap-2">
        {/* Quick Action Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="h-8 w-8 p-0"
          title="View Report"
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        {data.status === "completed" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="h-8 w-8 p-0"
            title="Download Report"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            <DropdownMenuItem onClick={onView} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            
            {data.status === "completed" && (
              <DropdownMenuItem onClick={onDownload} className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={onShare} className="cursor-pointer">
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => onCopy(data.reportId || "")}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Report ID
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={onSchedule} className="cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Regeneration
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={onRegenerate} className="cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Now
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
