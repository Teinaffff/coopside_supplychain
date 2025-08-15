  

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Manufacturer } from "../../../constants/interface/admin/manufacturer";
import toast from "react-hot-toast";
import { manufacturerMockData } from "../../../common/data/data";

const fetchManufacturers = async () => {
  // const res = await fetch('/api/manufacturers');
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to fetch manufacturers');
  //   throw new Error(errorData.message ?? 'Failed to fetch manufacturers');
  // }
  // const data = await res.json();
  return manufacturerMockData.slice(0, 10); // Limit to 10 entries
};

const addManufacturer = async (manufacturer: Manufacturer) => {
  // const res = await fetch('/api/manufacturers', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(manufacturer),
  // });
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to add manufacturer');
  //   throw new Error(errorData.message ?? 'Failed to add manufacturer');
  // }
  // return res.json();
  return manufacturer;
};

const editManufacturer = async (manufacturer: Manufacturer) => {
  // const res = await fetch(`/api/manufacturers/${manufacturer.manufacturerId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(manufacturer),
  // });
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to edit manufacturer');
  //   throw new Error(errorData.message ?? 'Failed to edit manufacturer');
  // }
  // return res.json();
  return manufacturer;
};

const deleteManufacturerById = async (manufacturerId: string) => {
  // const res = await fetch(`/api/manufacturers/${manufacturerId}`, {
  //   method: 'DELETE',
  // });
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to delete manufacturer');
  //   throw new Error(errorData.message ?? 'Failed to delete manufacturer');
  // }
  // return res.json();
  return { manufacturerId };
};

export const useManufacturers = () => {
  const queryClient = useQueryClient();

  const {
    data: manufacturers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manufacturers"],
    queryFn: fetchManufacturers,
  });

  const addManufacturerMutation = useMutation({
    mutationFn: addManufacturer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      toast.success("Manufacturer added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add manufacturer");
    },
  });

  const editManufacturerMutation = useMutation({
    mutationFn: editManufacturer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      toast.success("Manufacturer updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update manufacturer");
    },
  });

  const deleteManufacturer = useMutation({
    mutationFn: deleteManufacturerById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      toast.success("Manufacturer deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete manufacturer");
    },
  });

  const handleAddManufacturer = (manufacturer: Manufacturer) => {
    addManufacturerMutation.mutate(manufacturer);
  };

  const handleEditManufacturer = (manufacturer: Manufacturer) => {
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