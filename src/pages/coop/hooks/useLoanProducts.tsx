import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import loanProductService, { LoanProduct, LoanProductFormData, LoanProductFilters, UpdateLoanProductRequest } from '../../../services/loanProductService';
import { toast } from 'react-hot-toast';

export const useLoanProducts = (filters?: LoanProductFilters) => {
  const queryClient = useQueryClient();

  const {
    data: loanProducts,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['loanProducts', filters],
    queryFn: () => loanProductService.getAllLoanTypes(filters),
    select: (response) => response.data || []
  });

  return {
    loanProducts: loanProducts || [],
    isLoading,
    error,
    refetch
  };
};

export const useLoanProduct = (id: number) => {
  const {
    data: loanProduct,
    isLoading,
    error
  } = useQuery({
    queryKey: ['loanProduct', id],
    queryFn: () => loanProductService.getLoanTypeById(id),
    select: (response) => response.data,
    enabled: !!id
  });

  return {
    loanProduct,
    isLoading,
    error
  };
};

export const useCreateLoanProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanProductFormData) => loanProductService.createLoanType(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['loanProducts'] });
      toast.success('Loan product created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to create loan product');
    }
  });
};

export const useUpdateLoanProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLoanProductRequest }) => 
      loanProductService.updateLoanType(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['loanProducts'] });
      queryClient.invalidateQueries({ queryKey: ['loanProduct', response.data.id] });
      toast.success('Loan product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update loan product');
    }
  });
};

export const useDeleteLoanProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => loanProductService.deleteLoanType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loanProducts'] });
      toast.success('Loan product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete loan product');
    }
  });
};

export const useActivateLoanProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => loanProductService.activateLoanType(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['loanProducts'] });
      queryClient.invalidateQueries({ queryKey: ['loanProduct', response.data.id] });
      toast.success('Loan product activated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to activate loan product');
    }
  });
};

export const useDeactivateLoanProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => loanProductService.deactivateLoanType(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['loanProducts'] });
      queryClient.invalidateQueries({ queryKey: ['loanProduct', response.data.id] });
      toast.success('Loan product deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to deactivate loan product');
    }
  });
};

export const useCheckLoanProductCode = () => {
  return useMutation({
    mutationFn: (code: string) => loanProductService.checkLoanTypeCodeExists(code),
    onError: (error: any) => {
      console.error('Error checking loan product code:', error);
    }
  });
};

export const useActiveLoanProducts = () => {
  const {
    data: activeLoanProducts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['activeLoanProducts'],
    queryFn: () => loanProductService.getActiveLoanTypes(),
    select: (response) => response.data || []
  });

  return {
    activeLoanProducts: activeLoanProducts || [],
    isLoading,
    error
  };
};

export const useLoanProductsRequiringPartnerApproval = () => {
  const {
    data: partnerApprovalProducts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['partnerApprovalLoanProducts'],
    queryFn: () => loanProductService.getLoanTypesRequiringPartnerApproval(),
    select: (response) => response.data || []
  });

  return {
    partnerApprovalProducts: partnerApprovalProducts || [],
    isLoading,
    error
  };
};

export const useLoanProductsRequiringAdminApproval = () => {
  const {
    data: adminApprovalProducts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['adminApprovalLoanProducts'],
    queryFn: () => loanProductService.getLoanTypesRequiringAdminApproval(),
    select: (response) => response.data || []
  });

  return {
    adminApprovalProducts: adminApprovalProducts || [],
    isLoading,
    error
  };
};

export const useLoanProductsByCollateralRequirement = (collateralRequired: boolean) => {
  const {
    data: collateralProducts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['collateralLoanProducts', collateralRequired],
    queryFn: () => loanProductService.getLoanTypesByCollateralRequirement(collateralRequired),
    select: (response) => response.data || [],
    enabled: collateralRequired !== undefined
  });

  return {
    collateralProducts: collateralProducts || [],
    isLoading,
    error
  };
};
