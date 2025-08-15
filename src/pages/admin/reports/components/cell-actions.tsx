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
import { ReportData } from "../../../../constants/interface/admin/report";

export const CellAction: React.FC<{ data: ReportData }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegenerate, setOpenRegenerate] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Report deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete report!");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  const onRegenerate = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Report regenerated successfully!");
    } catch (error) {
      toast.error("Failed to regenerate report!");
    } finally {
      setLoading(false);
      setOpenRegenerate(false);
    }
  };

  const onView = () => {
    toast.success("Opening report viewer...");
    // Implement report viewer logic
  };

  const onDownload = () => {
    toast.success("Downloading report...");
    // Implement download logic
  };

  const onShare = () => {
    navigator.clipboard.writeText(`Report: ${data.title} - ${data.id}`);
    toast.success("Report link copied to clipboard!");
  };

  const onCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("Report data copied to clipboard!");
  };

  const onSchedule = () => {
    toast.success("Opening schedule dialog...");
    // Implement scheduling logic
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
        title="Delete Report"
        description={`Are you sure you want to delete "${data.title}"? This action cannot be undone.`}
      />
      <AlertModal
        isOpen={openRegenerate}
        onClose={() => setOpenRegenerate(false)}
        onConfirm={onRegenerate}
        loading={loading}
        title="Regenerate Report"
        description={`Are you sure you want to regenerate "${data.title}"? This will create a new version with current data.`}
      />

      <div className="flex items-center space-x-2">
        {/* Quick Action Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
          title="View Report"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
          title="Download Report"
        >
          <Download className="h-4 w-4" />
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="More actions"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-semibold text-gray-900">
              Report Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={onView}
              className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
            >
              <Eye className="mr-2 h-4 w-4 text-blue-600" />
              <span>View Details</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onDownload}
              className="cursor-pointer hover:bg-green-50 focus:bg-green-50"
            >
              <Download className="mr-2 h-4 w-4 text-green-600" />
              <span>Download</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onShare}
              className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
            >
              <Share2 className="mr-2 h-4 w-4 text-purple-600" />
              <span>Share Link</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onCopy}
              className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            >
              <Copy className="mr-2 h-4 w-4 text-gray-600" />
              <span>Copy Data</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={onSchedule}
              className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50"
            >
              <Calendar className="mr-2 h-4 w-4 text-orange-600" />
              <span>Schedule</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setOpenRegenerate(true)}
              className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
            >
              <RefreshCw className="mr-2 h-4 w-4 text-blue-600" />
              <span>Regenerate</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setOpenDelete(true)}
              className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
