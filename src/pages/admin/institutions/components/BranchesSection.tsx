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
import { useInstitutionBranches } from "../../hooks/use-institutions";

// Mock branch data - replace with actual API call
export const mockBranches = [
  {
    id: 1,
    institutionId: 1,
    branchName: "Main Branch",
    address: "123 Main St, Addis Ababa",
    phoneNumber: "+251-11-123-4567",
    email: "main@institution.com",
    branchManager: "Melaku Tesfaye",
    isActive: true,
  },
  {
    id: 2,
    institutionId: 1,
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
  const {
    branches,
    isBranchesLoading,
    branchesError,
    handleDeactivateBranch,
    isDeactivateBranchLoading,
  } = useInstitutionBranches(institutionId);

  // State for delete modal
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const handleAddBranch = () => {
    onOpenAddModal(institutionId);
  };

  const handleEditBranch = (branch: any) => {
    onOpenEditModal(branch);
  };

  const onDelete = async () => {
    if (selectedBranch) {
      try {
        await handleDeactivateBranch({ branchId: selectedBranch.id });
        setOpenDelete(false);
        setSelectedBranch(null);
      } catch (error) {
        console.error("Failed to deactivate branch:", error);
      }
    }
  };

  const handleDeleteClick = (branch: any) => {
    setSelectedBranch(branch);
    setOpenDelete(true);
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
              onClick={() => handleDeleteClick(branch)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isBranchesLoading) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
            <MapPin className="w-5 h-5" />
            <span>Branches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-slate-400">Loading branches...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (branchesError) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
            <MapPin className="w-5 h-5" />
            <span>Branches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load branches. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedBranch(null);
        }}
        onConfirm={onDelete}
        loading={isDeactivateBranchLoading}
        title="Deactivate Branch"
        description={`Are you sure you want to deactivate "${selectedBranch?.branchName}"? This action will mark the branch as inactive.`}
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
                {branches?.length || 0} branches for {institutionName}
              </p>
            </div>
            <Button onClick={handleAddBranch}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {branches && branches.length > 0 ? (
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
