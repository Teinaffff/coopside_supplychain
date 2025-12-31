import React, { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import { Button } from "../../../common/ui/button";
import { Search, PlusCircle, Eye, Edit, Ban, KeyRound, MoreHorizontal, Trash2 } from "lucide-react";
import { DataTable } from "../../../common/ui/data-table";
import { Badge } from "../../../common/ui/badge";
import {
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../common/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../common/ui/select";
import CreateUserModal from "./components/CreateUserModal";
import API from "../../../config/axios-config";
import { toast } from "react-hot-toast";
import { useUsers } from "../hooks/use-users";
import userService from "../../../services/userService";

type UserRole = "Agent" | "Institution" | "Factory" | "Consumer" | "Admin";
type UserPortal = "Coop" | "Partner";
type UserStatus = "Active" | "Inactive";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Agent" | "Institution" | "Factory" | "Consumer" | "Admin";
  portal: "Coop" | "Partner";
  status: "Active" | "Inactive";
};

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<User["role"] | "All">("All");
  const [filterPortal, setFilterPortal] = useState<User["portal"] | "All">("All");
  const [filterStatus, setFilterStatus] = useState<User["status"] | "All">("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users from the backend using the custom hook
  const { data: fetchedUsers, isLoading, error, refetch } = useUsers();

  // Update local users state when data is fetched
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      setUsers(fetchedUsers as User[]);
    }
  }, [fetchedUsers]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || "Failed to load users from the database";
      toast.error(errorMessage);
      console.error("Error loading users:", error);
    }
  }, [error]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.phone.includes(searchTerm);
      const matchesRole = filterRole === "All" || user.role === filterRole;
      const matchesPortal = filterPortal === "All" || user.portal === filterPortal;
      const matchesStatus = filterStatus === "All" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesPortal && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterPortal, filterStatus]);

  const handleCreateUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    roleId?: string;
    portal: UserPortal;
    password: string;
    status: UserStatus;
  }) => {
    try {
      // Build request body according to API contract:
      // POST /v1/users (Authentication required)
      // {
      //  "email": "string",
      //  "password": "string",
      //  "firstName": "string",
      //  "lastName": "string",
      //  "phoneNumber": "string",
      //  "roleId": 0,
      //  "status": "ACTIVE",
      //  "department": "string",
      //  "employeeId": "string",
      //  "remarks": "string"
      // }

      // Map role string to roleId. Adjust these ids to match backend if different.
      const roleMap: Record<string, number> = {
        Agent: 2,
        Institution: 3,
        Factory: 4,
        Consumer: 5,
        Admin: 1,
      };

      const payload = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phone || "",
        roleId: roleMap[userData.role] ?? 0,
        status: userData.status === "Active" ? "ACTIVE" : "INACTIVE",
        department: "",
        employeeId: "",
        remarks: "",
      };

      // Token is automatically attached by axios interceptor
      const res = await API.post("/v1/users", payload);

      const created = res?.data?.data || res?.data;

      if (!created) {
        throw new Error("Unexpected API response");
      }

      toast.success("User created successfully");
      
      // Refetch users to get the updated list from the backend
      refetch();
    } catch (err: any) {
      console.error("Error creating user:", err);
      const message = err?.response?.data?.message || err.message || "Failed to create user";
      toast.error(message);
      throw err;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeleteUserId(userId);
  };

  const confirmDeleteUser = async () => {
    if (!deleteUserId) return;
    
    setIsDeleting(true);
    try {
      await userService.deleteUser(Number(deleteUserId));
      toast.success("User deleted successfully");
      
      // Refetch users to get the updated list
      refetch();
      
      // Close the confirmation dialog
      setDeleteUserId(null);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      const message = err?.response?.data?.message || err.message || "Failed to delete user";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
  };

  const handleToggleStatus = async (userId: string, currentStatus: User["status"]) => {
    const action = currentStatus === "Active" ? "deactivate" : "activate";
    const actionText = currentStatus === "Active" ? "Deactivating" : "Activating";
    
    try {
      if (currentStatus === "Active") {
        await userService.deactivateUser(Number(userId));
        toast.success("User deactivated successfully");
      } else {
        await userService.activateUser(Number(userId));
        toast.success("User activated successfully");
      }
      
      // Refetch users to get the updated list
      refetch();
    } catch (err: any) {
      console.error(`Error ${action}ing user:`, err);
      const message = err?.response?.data?.message || err.message || `Failed to ${action} user`;
      toast.error(message);
    }
  };

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name / Username" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "portal", header: "Portal" },
    { accessorKey: "status", header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log("View user:", user.id)}>
                <Eye className="mr-2 h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Edit user:", user.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.status)}>
                <Ban className="mr-2 h-4 w-4" /> {user.status === "Active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Reset password:", user.id)}>
                <KeyRound className="mr-2 h-4 w-4" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create User
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            <span className="ml-3 text-gray-600">Loading users from database...</span>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Users</h3>
              <p className="text-gray-600 mb-4">
                {(error as any)?.response?.data?.message || (error as any)?.message || "Could not fetch users from the database"}
              </p>
              <div className="text-sm text-gray-500 mb-4">
                Status: {(error as any)?.response?.status || 'Network Error'}
              </div>
              <Button onClick={() => refetch()} variant="default">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <p className="mb-4">No users found in the database</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create First User
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="flex-grow flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={filterRole} onValueChange={(v) => setFilterRole(v as User["role"] | "All")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Institution">Institution</SelectItem>
                  <SelectItem value="Factory">Factory</SelectItem>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPortal} onValueChange={(v) => setFilterPortal(v as User["portal"] | "All")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Portal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Portals</SelectItem>
                  <SelectItem value="Coop">Coop</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as User["status"] | "All")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DataTable columns={columns} data={filteredUsers} searchKey="name" searchPlaceholder="Search user..." />
          </CardContent>
        </Card>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
