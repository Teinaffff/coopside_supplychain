import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import { Button } from "../../../common/ui/button";
import { Search, PlusCircle, Eye, Edit, Ban, KeyRound, MoreHorizontal } from "lucide-react";
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

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Agent" | "Institution" | "Factory" | "Consumer" | "Admin";
  portal: "Coop" | "Partner";
  status: "Active" | "Inactive";
};

const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "Agent", portal: "Partner", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com", phone: "098-765-4321", role: "Consumer", portal: "Partner", status: "Active" },
  { id: "3", name: "Robert Brown", email: "robert.b@example.com", phone: "111-222-3333", role: "Institution", portal: "Coop", status: "Inactive" },
  { id: "4", name: "Linda Johnson", email: "linda.j@example.com", phone: "444-555-6666", role: "Admin", portal: "Coop", status: "Active" },
  { id: "5", name: "William Davis", email: "william.d@example.com", phone: "777-888-9999", role: "Factory", portal: "Partner", status: "Active" },
];

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<User["role"] | "All">("All");
  const [filterPortal, setFilterPortal] = useState<User["portal"] | "All">("All");
  const [filterStatus, setFilterStatus] = useState<User["status"] | "All">("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

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
    name: string;
    email: string;
    phone: string;
    role: User["role"];
    portal: User["portal"];
    password: string;
    status: User["status"];
  }) => {
    try {
      // Build request body according to API contract in Swagger:
      // {
      //  "username": "string",
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

      // Quick heuristic: split `name` into first and last
      const names = userData.name.trim().split(" ");
      const firstName = names.slice(0, -1).join(" ") || names[0] || "";
      const lastName = names.length > 1 ? names.slice(-1).join(" ") : "";

      // Map role string to roleId. Adjust these ids to match backend if different.
      const roleMap: Record<string, number> = {
        Agent: 2,
        Institution: 3,
        Factory: 4,
        Consumer: 5,
        Admin: 1,
      };

      const payload = {
        username: userData.email || userData.name.replace(/\s+/g, "").toLowerCase(),
        email: userData.email,
        password: userData.password,
        firstName,
        lastName,
        phoneNumber: userData.phone || "",
        roleId: roleMap[userData.role] ?? 0,
        status: userData.status === "Active" ? "ACTIVE" : "INACTIVE",
        department: "",
        employeeId: "",
        remarks: "",
      } as any;

      // If user has neither access nor refresh token, don't attempt the request.
      // If a refresh token exists (but access token missing) we let the axios
      // interceptor attempt a token refresh on 401 and retry.
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken && !refreshToken) {
        toast.error("Authentication required. Please log in before creating a user.");
        throw new Error("Authentication required");
      }

      // Debug: log whether tokens are present (masked)
      // eslint-disable-next-line no-console
      console.debug("CreateUser tokens => access:", accessToken ? `${accessToken.slice(0,6)}...` : null, "refresh:", refreshToken ? `${refreshToken.slice(0,6)}...` : null);

      // If access token is present, send it explicitly so the request is authenticated immediately.
      // If only refresh token exists, let the interceptor attempt a refresh when the server responds 401.
      const requestOptions: any = {};
      if (accessToken) {
        requestOptions.headers = { Authorization: `Bearer ${accessToken}` };
      }

      const res = await API.post("/v1/users", payload, requestOptions);

      const created = res?.data?.data || res?.data;

      if (!created) {
        throw new Error("Unexpected API response");
      }

      // Map API user to local User shape if necessary
      const newUser: User = {
        id: created.id?.toString() || String(users.length + 1),
        name: created.firstName && created.lastName ? `${created.firstName} ${created.lastName}` : (created.fullName || created.name || created.username || userData.name),
        email: created.email || userData.email,
        phone: created.phoneNumber || created.phone || userData.phone || "",
        // Use role mapping back if API returns roleId
        role: (created.role as User["role"]) || userData.role,
        portal: (created.portal as User["portal"]) || userData.portal,
        status: (created.status === "ACTIVE" ? "Active" : (created.status === "INACTIVE" ? "Inactive" : userData.status)),
      };

      setUsers((prev) => [...prev, newUser]);
      toast.success("User created successfully");
      console.log("User created:", newUser);
    } catch (err: any) {
      console.error("Error creating user:", err);
      const message = err?.response?.data?.message || err.message || "Failed to create user";
      toast.error(message);
      throw err;
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
              <DropdownMenuItem onClick={() => console.log("Toggle status:", user.id)}>
                <Ban className="mr-2 h-4 w-4" /> {user.status === "Active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Reset password:", user.id)}>
                <KeyRound className="mr-2 h-4 w-4" /> Reset Password
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

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};

export default UserManagementPage;
