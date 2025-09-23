import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminUser } from "../../../constants/interface/admin/user";
import { UserFormValues } from "../../../schema/admin/user";

const fetchUsers = async () => {
  const mockUsers: AdminUser[] = [
    {
      id: 1,
      username: "admin_user",
      email: "admin@example.com",
      fullName: "Admin User",
      phoneNumber: "+1234567890",
      userType: "WEB_ADMIN" as any,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      username: "agent_admin",
      email: "agent.admin@example.com",
      fullName: "Agent Administrator",
      phoneNumber: "+0987654321",
      userType: "AGENT_ADMIN" as any,
      assignedOrganization: {
        id: 1,
        name: "Premium Agents Ltd",
        type: "AGENT",
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      username: "manufacturer_admin",
      email: "manufacturer@example.com",
      fullName: "Manufacturing Supervisor",
      phoneNumber: "+2233445566",
      userType: "MANUFACTURER_ADMIN" as any,
      assignedOrganization: {
        id: 2,
        name: "Global Manufacturing Co",
        type: "MANUFACTURER",
      },
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      username: "super_admin",
      email: "super@example.com",
      fullName: "Super Administrator",
      phoneNumber: "+3344556677",
      userType: "SUPER_ADMIN" as any,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      username: "institution_admin",
      email: "institution@example.com",
      fullName: "Institution Coordinator",
      phoneNumber: "+4455667788",
      userType: "INSTITUTION_ADMIN" as any,
      assignedOrganization: {
        id: 3,
        name: "Ethiopia Airlinesing Institution",
        type: "INSTITUTION",
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 7,
      username: "seller_admin",
      email: "seller@example.com",
      fullName: "Seller Operations Manager",
      phoneNumber: "+5566778899",
      userType: "SELLER_ADMIN" as any,
      assignedOrganization: {
        id: 4,
        name: "Top Sellers Network",
        type: "SELLER",
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return mockUsers;
};

export const useUsers = (options?: { isFetchUsers: boolean }) => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: options?.isFetchUsers,
  });

  const addUserMutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      const { id, ...rest } = data;
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to create user");
        throw new Error(errorData.message ?? "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
  });

  const editUserMutation = useMutation({
    mutationFn: async (data: UserFormValues & { id: number }) => {
      const { id, ...rest } = data;
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to update user");
        throw new Error(errorData.message ?? "Failed to update user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to delete user");
        throw new Error(errorData.message ?? "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
  });

  return {
    users,
    isLoading,
    error,
    handleAddUser: addUserMutation.mutateAsync,
    handleEditUser: editUserMutation.mutateAsync,
    handleUpdateUser: editUserMutation.mutateAsync,
    isAddUserLoading: addUserMutation.isPending,
    isEditUserLoading: editUserMutation.isPending,
    addUserError: addUserMutation.error,
    editUserError: editUserMutation.error,
    handleDeleteUser: deleteUserMutation.mutateAsync,
    isDeleteUserLoading: deleteUserMutation.isPending,
    deleteUserError: deleteUserMutation.error,
  };
};
