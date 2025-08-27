import { Edit, MapPin, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../common/ui/card";
import { DataTable } from "../../../../common/ui/data-table";
import { useAddBranchModal } from "../../hooks/use-add-branch-modal";
import { useEditBranchModal } from "../../hooks/use-edit-branch-modal";
import AddBranchModal from "./AddBranchModal";
import EditBranchModal from "./EditBranchModal";

// Mock branch data - replace with actual API call
const mockBranches = [
  {
    id: 1,
    institutionId: 101,
    branchName: "Main Branch",
    address: "123 Main St, Addis Ababa",
    phoneNumber: "+251-11-123-4567",
    email: "main@institution.com",
    branchManager: "Melaku Tesfaye",
    isActive: true,
  },
  {
    id: 2,
    institutionId: 101,
    branchName: "Downtown Branch",
    address: "456 Downtown Ave, Addis Ababa",
    phoneNumber: "+251-11-987-6543",
    email: "downtown@institution.com",
    branchManager: "Jane Smith",
    isActive: true,
  },
];

interface BranchesSectionProps {
  institutionId: string;
  institutionName: string;
}

const BranchesSection: React.FC<BranchesSectionProps> = ({
  institutionId,
  institutionName,
}) => {
  const { onOpen: onOpenAddModal } = useAddBranchModal();
  const { onOpen: onOpenEditModal } = useEditBranchModal();

  // State for delete modal
  const [openDelete, setOpenDelete] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter branches for this institution
  const branches = mockBranches.filter(
    (branch) => branch.institutionId.toString() === institutionId
  );

  const handleAddBranch = () => {
    onOpenAddModal(institutionId);
  };

  const handleEditBranch = (branch: any) => {
    onOpenEditModal(branch);
  };

  const onDelete = async () => {
    if (!branchToDelete) return;

    setIsDeleting(true);
    try {
      // Implement your delete API call here
      console.log("Deleting branch:", branchToDelete);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal and reset state
      setOpenDelete(false);
      setBranchToDelete(null);

      // You might want to refresh the data or remove from local state
      // For now, just log success
      console.log("Branch deleted successfully");
    } catch (error) {
      console.error("Error deleting branch:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      accessorKey: "branchName",
      header: "Branch Name",
      cell: ({ row }: any) => {
        const branch = row.original;
        return (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{branch.branchName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">{row.original.address}</span>
      ),
    },
    {
      accessorKey: "branchManager",
      header: "Manager",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const branch = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditBranch(branch)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setBranchToDelete(branch.id);
                setOpenDelete(true);
              }}
              className="text-red-600 hover:text-red-800"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setBranchToDelete(null);
        }}
        onConfirm={onDelete}
        loading={isDeleting}
      />
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <MapPin className="w-5 h-5" />
                <span>Branches</span>
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                {branches.length} branches for {institutionName}
              </p>
            </div>
            <Button onClick={handleAddBranch}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {branches.length > 0 ? (
            <DataTable
              columns={columns}
              data={branches}
              searchKey="branchName"
              searchPlaceholder="Search branches..."
            />
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                No branches yet
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Add the first branch for this institution
              </p>
              <Button onClick={handleAddBranch}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Branch
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddBranchModal />
      <EditBranchModal />
    </>
  );
};

export default BranchesSection;
