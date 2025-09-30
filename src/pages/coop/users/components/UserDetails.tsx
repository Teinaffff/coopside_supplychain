import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Label } from "../../../../common/ui/label";
import { Badge } from "../../../../common/ui/badge";
import { Edit, KeyRound, Ban } from "lucide-react";

type UserRole = "Agent" | "Institution" | "Factory" | "Consumer" | "Admin";
type UserPortal = "Coop" | "Partner";
type UserStatus = "Active" | "Inactive";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  portal: UserPortal;
  status: UserStatus;
  createdAt: string;
  lastModified: string;
  lastLogin: string;
  permissions: string[];
}

interface UserDetailsProps {
  user: User;
  onEdit: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: UserStatus) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onEdit, onResetPassword, onToggleStatus }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Details</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(user.id)}>
            <Edit className="mr-2 h-4 w-4" /> Edit User
          </Button>
          <Button variant="outline" size="sm" onClick={() => onResetPassword(user.id)}>
            <KeyRound className="mr-2 h-4 w-4" /> Reset Password
          </Button>
          <Button variant={user.status === "Active" ? "destructive" : "default"} size="sm" onClick={() => onToggleStatus(user.id, user.status)}>
            <Ban className="mr-2 h-4 w-4" /> {user.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Username</Label>
              <p className="text-gray-700 dark:text-gray-200">{user.name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-gray-700 dark:text-gray-200">{user.email}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="text-gray-700 dark:text-gray-200">{user.phone}</p>
            </div>
            <div>
              <Label>Role</Label>
              <p className="text-gray-700 dark:text-gray-200">{user.role}</p>
            </div>
            <div>
              <Label>Portal</Label>
              <p className="text-gray-700 dark:text-gray-200">{user.portal}</p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Audit Log</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Created At</Label>
              <p className="text-gray-700 dark:text-gray-200">{user.createdAt}</p>
            </div>
            <div>
              <Label>Last Modified At</Label>
              <p className="text-gray-700 dark:text-gray-200">{user.lastModified}</p>
            </div>
            <div>
              <Label>Last Login At</Label>
              <p className="text-gray-700 dark:text-gray-200">{user.lastLogin}</p>
            </div>
          </div>
        </div>

        {/* Assigned Permissions / Roles */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Assigned Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((permission) => (
              <Badge key={permission} variant="outline">{permission}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetails;

