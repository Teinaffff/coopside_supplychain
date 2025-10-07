import React, { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import { Button } from "../../../common/ui/button";
import { Search, PlusCircle, Edit, Ban, KeyRound, MoreHorizontal } from "lucide-react";
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
import {DeleteUserModal} from "./components/Delete";
import API from "../../../config/axios-config";
import { toast } from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Partner" | "SuperAdmin";
  portal: "Coop" | "Partner";
  status: "Active" | "Inactive";
};

const UserManagementPage = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<User["role"] | "All">("All");
  const [filterPortal, setFilterPortal] = useState<User["portal"] | "All">("All");
  const [filterStatus, setFilterStatus] = useState<User["status"] | "All">("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  // Helper: try multiple role/portal field names to satisfy backend differences
  const roleFieldCandidates = [
    "userType",
    "role",
    "userRole",
    "user_type",
    "userCategory",
    "type",
    "roles",
    "authorities",
  ] as const;
  const portalFieldCandidates = ["portal", "userPortal", "portalType", "portal_type", "portalId", "portal_id"] as const;

  const roleValueVariants = (uiRole: string) => {
    // UI roles map to backend possibilities
    const isAdmin = uiRole === "Admin" || uiRole === "SuperAdmin";
    const base = isAdmin
      ? ["Admin", "SuperAdmin"]
      : ["Agent", "Partner", "User"];
    const uppers = base.map((v) => v.toUpperCase());
    const prefixed = isAdmin
      ? ["ROLE_ADMIN", "ROLE_SUPERADMIN", "ROLE_SUPER_ADMIN"]
      : ["ROLE_AGENT", "ROLE_PARTNER", "ROLE_USER"];
    return [...base, ...uppers, ...prefixed];
  };

  // Create-only: try Role ID based payloads first if provided
  const postUserWithRoleIdVariants = async (base: any, roleIdValue: string, portalValue?: string) => {
    let lastError: any = null;
    const idFieldCandidates = [
      "roleId",
      "role_id",
      "roleIds",
      "role_ids",
      "roleIdList",
      "role_id_list",
      "roles", // may accept array of ids or objects
    ] as const;
    const portalOptions: (string | null)[] = [null, ...portalFieldCandidates];

    for (const portalField of portalOptions) {
      for (const idField of idFieldCandidates) {
        const idPayloadVariants = (
          idField === "roles"
            ? [ { roles: [roleIdValue] }, { roles: [{ id: roleIdValue }] } ]
            : [ { [idField]: roleIdValue }, { [idField]: [roleIdValue] } ]
        ) as any[];
        for (const idVariant of idPayloadVariants) {
          try {
            const payload: any = { ...base, ...idVariant };
            if (portalField && portalValue) payload[portalField] = portalValue;
            return await API.post("/v1/users", payload);
          } catch (err: any) {
            lastError = err;
            if (isUnrecognizedFieldError(err)) {
              continue;
            }
            throw err;
          }
        }
      }
    }
    throw lastError;
  };

  const isUnrecognizedFieldError = (err: any) => {
    const msg = err?.response?.data?.message || err?.message || "";
    const raw = JSON.stringify(err?.response?.data || {});
    return /Unrecognized field/i.test(msg) || /Unrecognized field/i.test(raw);
  };

  const isMissingFieldError = (err: any, fieldNames: string[]) => {
    const msg = (err?.response?.data?.message || err?.message || "").toLowerCase();
    const raw = JSON.stringify(err?.response?.data || {}).toLowerCase();
    return /required|missing|must not be null|must not be blank/.test(msg + " " + raw) &&
      fieldNames.some((f) => msg.includes(f.toLowerCase()) || raw.includes(f.toLowerCase()));
  };

  const postUserWithVariants = async (base: any, roleValue: string, portalValue?: string) => {
    let lastError: any = null;
    const portalOptions: (string | null)[] = [null, ...portalFieldCandidates];
    const roleOptions: (string | null)[] = [null, ...roleFieldCandidates]; // try without role first

    // First attempt: no role, no portal
    try {
      return await API.post("/v1/users", { ...base });
    } catch (err: any) {
      lastError = err;
      // Only proceed to variants if backend says role/portal is required
      if (!isMissingFieldError(err, ["role", "userType", "userRole", "portal"])) {
        throw err;
      }
    }

    for (const portalField of portalOptions) {
      for (const roleField of roleOptions) {
        const roleValues = roleField ? roleValueVariants(roleValue) : [null];
        for (const rv of roleValues) {
          try {
            const payload = { ...base } as any;
            if (roleField && rv) {
              // Special handling for collection fields
              if (roleField === "roles" || roleField === "authorities") {
                payload[roleField] = roleField === "authorities" ? [{ authority: rv }] : [rv];
              } else {
                payload[roleField] = rv;
              }
            }
            if (portalField && portalValue) payload[portalField] = portalValue;
            return await API.post("/v1/users", payload);
          } catch (err: any) {
            lastError = err;
            if (isUnrecognizedFieldError(err)) {
              continue; // try next combination
            }
            throw err; // different error, surface it
          }
        }
      }
    }
    throw lastError;
  };

  const putUserWithVariants = async (userId: string, base: any, roleValue: string, portalValue?: string) => {
    let lastError: any = null;
    const portalOptions: (string | null)[] = [null, ...portalFieldCandidates];
    const roleOptions: (string | null)[] = [null, ...roleFieldCandidates];

    // First attempt: no role, no portal
    try {
      return await API.put(`/v1/users/${userId}`, { ...base });
    } catch (err: any) {
      lastError = err;
      if (!isMissingFieldError(err, ["role", "userType", "userRole", "portal"])) {
        throw err;
      }
    }

    for (const portalField of portalOptions) {
      for (const roleField of roleOptions) {
        const roleValues = roleField ? roleValueVariants(roleValue) : [null];
        for (const rv of roleValues) {
          try {
            const payload = { ...base } as any;
            if (roleField && rv) {
              if (roleField === "roles" || roleField === "authorities") {
                payload[roleField] = roleField === "authorities" ? [{ authority: rv }] : [rv];
              } else {
                payload[roleField] = rv;
              }
            }
            if (portalField && portalValue) payload[portalField] = portalValue;
            return await API.put(`/v1/users/${userId}`, payload);
          } catch (err: any) {
            lastError = err;
            if (isUnrecognizedFieldError(err)) {
              continue;
            }
            throw err;
          }
        }
      }
    }
    throw lastError;
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          toast.error("Authentication required. Please log in.");
          return;
        }
        const res = await API.get("/v1/users");
        const apiUsers = (res.data?.data || res.data || []).map((u: any) => ({
          id: u.id?.toString() || "",
          name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.fullName || u.name || u.username || "",
          email: u.email,
          phone: u.phoneNumber || "",
          role: (() => {
            const backendRole = u.userType || u.role;
            if (backendRole === "SuperAdmin" || backendRole === "Admin") return "SuperAdmin";
            return "Partner";
          })(),
          portal: (() => {
            const p = u.portal || u.userPortal || u.portalType || u.portal_type;
            return p === "Partner" ? "Partner" : "Coop";
          })(),
          status: u.status === "ACTIVE" ? "Active" : "Inactive",
        }));
        setUsers(apiUsers);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        toast.error(err?.response?.data?.message || err.message || "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);
      const matchesRole = filterRole === "All" || user.role === filterRole;
      const matchesPortal = filterPortal === "All" || user.portal === filterPortal;
      const matchesStatus = filterStatus === "All" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesPortal && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterPortal, filterStatus]);

  // CRUD Handlers
  const editUserById = async (userId: string, updatedData: any) => {
    try {
      // Build base payload without any role field, then try variants
      const base = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phoneNumber: updatedData.phone,
        status: updatedData.status,
      } as const;
      const roleValue = updatedData.role;
      const portalValue = updatedData.portal;

      await putUserWithVariants(userId, base, roleValue, portalValue);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, ...updatedData, name: `${updatedData.firstName} ${updatedData.lastName}` }
            : u
        )
      );
      toast.success("User updated successfully");
      return true;
    } catch (err: any) {
      console.error("Error updating user:", err);
      toast.error(err?.response?.data?.message || err.message || "Failed to update user");
      return false;
    }
  };

  const deleteUserById = async (userId: string) => {
    try {
      await API.delete(`/v1/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: User["status"]) => {
    try {
      const newStatus = currentStatus === "Active" ? "INACTIVE" : "ACTIVE";
      await API.put(`/v1/users/${userId}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: newStatus === "ACTIVE" ? "Active" : "Inactive" } : u
        )
      );
      toast.success(`User ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`);
    } catch (err: any) {
      console.error("Error toggling status:", err);
      toast.error(err?.response?.data?.message || "Failed to toggle user status");
    }
  };

  const resetUserPassword = async (userId: string) => {
    try {
      await API.put(`/v1/users/${userId}/reset-password`);
      toast.success("Password reset successfully");
    } catch (err: any) {
      console.error("Error resetting password:", err);
      toast.error(err?.response?.data?.message || "Failed to reset password");
    }
  };

  const handleOpenEditModal = (user: User) => {
    setEditUser(user);
    setEditModalOpen(true);
  };

  const handleEditUserSubmit = async (updatedData: any) => {
    if (!editUser) return;
    const normalized = {
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      email: updatedData.email,
      phone: updatedData.phone,
      role: updatedData.role,
      portal: updatedData.portal,
      status: updatedData.status === "Active" ? "ACTIVE" : "INACTIVE",
    };
    const success = await editUserById(editUser.id, normalized);
    if (success) setEditModalOpen(false);
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const names = userData.name.trim().split(" ");
      const firstName = names.slice(0, -1).join(" ") || names[0] || "";
      const lastName = names.length > 1 ? names.slice(-1).join(" ") : "";

      const base = {
        email: userData.email,
        password: userData.password,
        firstName,
        lastName,
        phoneNumber: userData.phone || "",
        status: userData.status === "Active" ? "ACTIVE" : "INACTIVE",
      } as const;

      // If Role ID provided, try ID-based payloads first for CREATE ONLY
      let res;
      if (userData.roleId && String(userData.roleId).trim().length > 0) {
        try {
          res = await postUserWithRoleIdVariants(base, String(userData.roleId).trim(), userData.portal);
        } catch (err: any) {
          // If backend complains about missing role (not id), fall back to name-based probing
          if (!isMissingFieldError(err, ["role", "userType", "userRole"])) {
            throw err;
          }
        }
      }

      if (!res) {
        // Fall back to tolerant role/portal name probing
        res = await postUserWithVariants(base, userData.role, userData.portal);
      }
      const created = res.data?.data || res.data;

      const newUser: User = {
        id: created.id?.toString() || String(users.length + 1),
        name: `${created.firstName} ${created.lastName}`,
        email: created.email,
        phone: created.phoneNumber || "",
        role: (() => {
          const backendRole = created.userType || created.role || userData.role;
          if (backendRole === "SuperAdmin" || backendRole === "Admin") return "SuperAdmin";
          return "Partner";
        })(),
        portal: created.portal || userData.portal,
        status: created.status === "ACTIVE" ? "Active" : "Inactive",
      };
      setUsers((prev) => [...prev, newUser]);
      toast.success("User created successfully");
    } catch (err: any) {
      console.error("Error creating user:", err);
      toast.error(err?.response?.data?.message || err.message || "Failed to create user");
    }
  };

  // Table Columns
  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name / Username" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "portal", header: "Portal" },
    {
      accessorKey: "status",
      header: "Status",
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
              <DropdownMenuItem onClick={() => handleOpenEditModal(user)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.status)}>
                <Ban className="mr-2 h-4 w-4" /> {user.status === "Active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => resetUserPassword(user.id)}>
                <KeyRound className="mr-2 h-4 w-4" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => setDeleteUser(user)}>
                🗑 Delete
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
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
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

      {/* Edit Modal */}
      {editModalOpen && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const nameValue = formData.get("name") as string;
                const names = nameValue.trim().split(" ");
                const firstName = names.slice(0, -1).join(" ") || names[0] || "";
                const lastName = names.length > 1 ? names.slice(-1).join(" ") : "";
                handleEditUserSubmit({
                  firstName,
                  lastName,
                  email: formData.get("email") as string,
                  phone: formData.get("phone") as string,
                  role: formData.get("role") as User["role"],
                  portal: formData.get("portal") as User["portal"],
                  status: formData.get("status") as User["status"],
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  name="name"
                  defaultValue={editUser.name}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" defaultValue={editUser.email} className="w-full border rounded px-2 py-1" />
              </div>

              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input name="phone" defaultValue={editUser.phone} className="w-full border rounded px-2 py-1" />
              </div>

              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  name="role"
                  defaultValue={editUser.role === "SuperAdmin" ? "Admin" : "Agent"}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="Agent">Partner</option>
                  <option value="Admin">SuperAdmin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Portal</label>
                <select name="portal" defaultValue={editUser.portal} className="w-full border rounded px-2 py-1">
                  <option value="Coop">Coop</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateUser} />

      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          onCancel={() => setDeleteUser(null)}
          onConfirm={async () => {
            await deleteUserById(deleteUser.id);
            setDeleteUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
