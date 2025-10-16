import { useState } from "react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import { Badge } from "../../../../common/ui/badge";
import { Plus, Edit, Trash2, Users, Shield, Eye } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserRoleSettings = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: [
        "user_management",
        "loan_management",
        "approval_management",
        "reporting",
        "system_settings",
        "audit_logs",
        "backup_restore"
      ],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "Loan Officer",
      description: "Can manage loans and process applications",
      permissions: [
        "loan_management",
        "approval_management",
        "customer_view"
      ],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "3",
      name: "Approval Manager",
      description: "Can approve or reject loan applications",
      permissions: [
        "approval_management",
        "loan_view",
        "customer_view"
      ],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "4",
      name: "Viewer",
      description: "Read-only access to reports and data",
      permissions: [
        "loan_view",
        "customer_view",
        "reporting"
      ],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const availablePermissions = [
    { id: "user_management", name: "User Management", description: "Create, edit, and delete users" },
    { id: "loan_management", name: "Loan Management", description: "Create, edit, and manage loans" },
    { id: "approval_management", name: "Approval Management", description: "Approve or reject applications" },
    { id: "reporting", name: "Reporting", description: "Access to reports and analytics" },
    { id: "system_settings", name: "System Settings", description: "Configure system settings" },
    { id: "audit_logs", name: "Audit Logs", description: "View system audit logs" },
    { id: "backup_restore", name: "Backup & Restore", description: "Manage system backups" },
    { id: "loan_view", name: "View Loans", description: "View loan information" },
    { id: "customer_view", name: "View Customers", description: "View customer information" },
    { id: "financial_reports", name: "Financial Reports", description: "Access financial reports" },
    { id: "risk_management", name: "Risk Management", description: "Manage risk settings" },
    { id: "notification_management", name: "Notification Management", description: "Manage notifications" }
  ];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = (roleData: Partial<Role>) => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: roleData.name || "",
      description: roleData.description || "",
      permissions: roleData.permissions || [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRoles([...roles, newRole]);
    setIsCreateModalOpen(false);
  };

  const handleEditRole = (roleData: Partial<Role>) => {
    if (!selectedRole) return;
    const updatedRole = {
      ...selectedRole,
      ...roleData,
      updatedAt: new Date().toISOString()
    };
    setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
    setIsEditModalOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId));
  };

  const handleToggleStatus = (roleId: string) => {
    setRoles(roles.map(r => 
      r.id === roleId ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">User Roles & Permissions</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage user roles and their permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search roles by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{role.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={role.isActive ? "default" : "secondary"}>
                  {role.isActive ? "Active" : "Inactive"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStatus(role.id)}
                  className="p-1"
                >
                  {role.isActive ? "✓" : "✗"}
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions ({role.permissions.length})</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission.replace('_', ' ')}
                  </Badge>
                ))}
                {role.permissions.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{role.permissions.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {new Date(role.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(role)}
                  className="p-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteRole(role.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Role Modal */}
      {isCreateModalOpen && (
        <RoleFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateRole}
          availablePermissions={availablePermissions}
          title="Create New Role"
        />
      )}

      {/* Edit Role Modal */}
      {isEditModalOpen && selectedRole && (
        <RoleFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
          }}
          onSubmit={handleEditRole}
          availablePermissions={availablePermissions}
          initialData={selectedRole}
          title="Edit Role"
        />
      )}
    </div>
  );
};

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Role>) => void;
  availablePermissions: Array<{ id: string; name: string; description: string }>;
  initialData?: Role;
  title: string;
}

const RoleFormModal = ({ isOpen, onClose, onSubmit, availablePermissions, initialData, title }: RoleFormModalProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    permissions: initialData?.permissions || [],
    isActive: initialData?.isActive ?? true
  });

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="roleName">Role Name *</Label>
            <Input
              id="roleName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter role name"
              required
            />
          </div>

          <div>
            <Label htmlFor="roleDescription">Description *</Label>
            <Input
              id="roleDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter role description"
              required
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <Label htmlFor={permission.id} className="text-sm font-medium">
                      {permission.name}
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRoleSettings;
