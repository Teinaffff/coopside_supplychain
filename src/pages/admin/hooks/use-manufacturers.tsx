import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { manufacturersMockData } from "../../../common/data/data";
import { ManufacturerFormValues } from "../../../schema/admin/manufacturer";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8081/api"
    : "https://supply-chain-api.onrender.com";

const fetchManufacturers = async (accessToken: string) => {
  const res = await fetch(`${baseUrl}/factories`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch manufacturers");
    throw new Error(errorData.message ?? "Failed to fetch manufacturers");
  }
  return manufacturersMockData;
  // const data = await res.json();
  // return data.data ?? [];
};

const addManufacturer = async (
  manufacturer: ManufacturerFormValues,
  accessToken: string
) => {
  const res = await fetch(`${baseUrl}/factories/onboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(manufacturer),
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to add factory");
    throw new Error(errorData.message ?? "Failed to add factory");
  }
  return res.json();
};

const editManufacturer = async (
  manufacturer: ManufacturerFormValues,
  accessToken: string
) => {
  const res = await fetch(`${baseUrl}/factories/${manufacturer.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(manufacturer),
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to edit factory");
    throw new Error(errorData.message ?? "Failed to edit factory");
  }
  return res.json();
};

const deleteManufacturerById = async (
  manufacturerId: number,
  accessToken: string
) => {
  const res = await fetch(`${baseUrl}/factories/${manufacturerId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to delete factory");
    throw new Error(errorData.message ?? "Failed to delete factory");
  }
  return res.json();
};

export const useManufacturers = () => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: manufacturers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manufacturers"],
    queryFn: () => fetchManufacturers(accessToken ?? ""),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const addManufacturerMutation = useMutation({
    mutationFn: (manufacturer: ManufacturerFormValues) =>
      addManufacturer(manufacturer, accessToken ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      toast.success("Factory added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add factory");
    },
  });

  const editManufacturerMutation = useMutation({
    mutationFn: (manufacturer: ManufacturerFormValues) =>
      editManufacturer(manufacturer, accessToken ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      toast.success("Factory updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update factory");
    },
  });

  const deleteManufacturer = useMutation({
    mutationFn: (manufacturerId: number) =>
      deleteManufacturerById(manufacturerId, accessToken ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      toast.success("Factory deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete factory");
    },
  });

  const handleAddManufacturer = (manufacturer: ManufacturerFormValues) => {
    addManufacturerMutation.mutate(manufacturer);
  };

  const handleEditManufacturer = (manufacturer: ManufacturerFormValues) => {
    editManufacturerMutation.mutate(manufacturer);
  };

  return {
    manufacturers,
    isLoading,
    error,
    handleAddManufacturer,
    handleEditManufacturer,
    deleteManufacturer,
    isAddManufacturerLoading: addManufacturerMutation.isPending,
    isEditManufacturerLoading: editManufacturerMutation.isPending,
  };
};
