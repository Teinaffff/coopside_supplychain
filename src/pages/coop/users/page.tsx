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

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.phone.includes(searchTerm);
      const matchesRole = filterRole === "All" || user.role === filterRole;
      const matchesPortal = filterPortal === "All" || user.portal === filterPortal;
      const matchesStatus = filterStatus === "All" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesPortal && matchesStatus;
    });
  }, [searchTerm, filterRole, filterPortal, filterStatus]);

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
        <Button onClick={() => console.log("Create new user")}>
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
            <Select value={filterRole} onValueChange={setFilterRole}>
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
            <Select value={filterPortal} onValueChange={setFilterPortal}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Portal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Portals</SelectItem>
                <SelectItem value="Coop">Coop</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
    </div>
  );
};

export default UserManagementPage;
