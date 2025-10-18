import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../common/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLoanProduct, useUpdateLoanProduct } from '../../hooks/useLoanProducts';
import LoanProductFormNew from './LoanProductFormNew';

const LoanProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loanProduct, isLoading, error } = useLoanProduct(Number(id));
  const updateMutation = useUpdateLoanProduct();

  const handleEditProduct = async (formData: any) => {
    if (!loanProduct) return;

    try {
      // Check if code already exists (only if code changed)
      if (formData.code !== loanProduct.code) {
        // Note: Code validation would need to be implemented here if needed
        console.log('Code changed, validation would be needed');
      }

      // Remove code field from update data as it's not allowed in update requests
      const { code, ...updateData } = formData;
      
      await updateMutation.mutateAsync({ id: loanProduct.id, data: updateData });
      navigate(`/coop/settings/loan-products/view/${loanProduct.id}`);
    } catch (error: any) {
      console.error('Error updating product:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading loan product...</p>
        </div>
      </div>
    );
  }

  if (error || !loanProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The loan product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/coop/settings')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/coop/settings/loan-products/view/${loanProduct.id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Loan Product</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{loanProduct.name}</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="max-w-6xl">
        <LoanProductFormNew 
          onSubmit={handleEditProduct} 
          initialData={loanProduct}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default LoanProductEditPage;
