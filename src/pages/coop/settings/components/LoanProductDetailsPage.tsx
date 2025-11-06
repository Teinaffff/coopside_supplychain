import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../../common/ui/card';
import { Button } from '../../../../common/ui/button';
import { Badge } from '../../../../common/ui/badge';
import { ArrowLeft, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { useLoanProduct, useActivateLoanProduct, useDeactivateLoanProduct } from '../../hooks/useLoanProducts';

const LoanProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loanProduct, isLoading, error } = useLoanProduct(Number(id));
  const activateMutation = useActivateLoanProduct();
  const deactivateMutation = useDeactivateLoanProduct();

  const handleToggleStatus = async () => {
    if (!loanProduct) return;
    
    try {
      if (loanProduct.isActive) {
        await deactivateMutation.mutateAsync(loanProduct.id);
      } else {
        await activateMutation.mutateAsync(loanProduct.id);
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading loan product details...</p>
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

  // Parse required documents
  let documents: string[] = [];
  try {
    if (typeof loanProduct.requiredDocuments === 'string') {
      documents = JSON.parse(loanProduct.requiredDocuments);
    } else if (Array.isArray(loanProduct.requiredDocuments)) {
      documents = loanProduct.requiredDocuments;
    }
  } catch (error) {
    console.error('Error parsing requiredDocuments:', error);
    documents = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/coop/settings')}
                className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{loanProduct.name}</h1>
                  <Badge variant={loanProduct.isActive ? "default" : "secondary"} className="text-xs">
                    {loanProduct.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-mono text-sm">{loanProduct.code}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{loanProduct.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/coop/settings/loan-products/edit/${loanProduct.id}`)}
                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleStatus}
                disabled={activateMutation.isPending || deactivateMutation.isPending}
                className={`flex items-center gap-2 ${
                  loanProduct.isActive 
                    ? 'hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                    : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                {loanProduct.isActive ? (
                  <ToggleRight className="w-4 h-4 text-orange-600" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-green-600" />
                )}
                {loanProduct.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Basic Information */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Basic Info</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Order:</span>
                <span className="font-medium text-slate-900 dark:text-white">{loanProduct.displayOrder}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Created:</span>
                <span className="text-slate-700 dark:text-slate-300">{loanProduct.createdAt ? new Date(loanProduct.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Updated:</span>
                <span className="text-slate-700 dark:text-slate-300">{loanProduct.updatedAt ? new Date(loanProduct.updatedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </Card>

          {/* Loan Amount */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Loan Amount</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Min:</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(loanProduct.minLoanAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Max:</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(loanProduct.maxLoanAmount)}</span>
              </div>
            </div>
          </Card>

          {/* Interest Rate */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Interest Rate</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Default:</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatPercentage(loanProduct.defaultInterestRate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Range:</span>
                <span className="text-slate-700 dark:text-slate-300">{formatPercentage(loanProduct.minInterestRate)} - {formatPercentage(loanProduct.maxInterestRate)}</span>
              </div>
            </div>
          </Card>

          {/* Repayment Terms */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Repayment</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Period:</span>
                <span className="text-slate-700 dark:text-slate-300">{loanProduct.minRepaymentPeriodMonths}-{loanProduct.maxRepaymentPeriodMonths} months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Default:</span>
                <span className="font-medium text-slate-900 dark:text-white">{loanProduct.defaultRepaymentPeriodMonths} months</span>
              </div>
            </div>
          </Card>

          {/* Processing Fees */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Processing Fees</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Type:</span>
                <span className="font-medium text-slate-900 dark:text-white capitalize">{loanProduct.processingFeeType.toLowerCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Value:</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatPercentage(loanProduct.processingFeeValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Range:</span>
                <span className="text-slate-700 dark:text-slate-300">{formatCurrency(loanProduct.minProcessingFee)} - {formatCurrency(loanProduct.maxProcessingFee)}</span>
              </div>
            </div>
          </Card>

          {/* Penalties */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Penalties</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Late Payment:</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatPercentage(loanProduct.latePaymentPenaltyRate)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Prepayment:</span>
                <Badge variant={loanProduct.prepaymentAllowed ? "default" : "secondary"} className="text-xs">
                  {loanProduct.prepaymentAllowed ? "Yes" : "No"}
                </Badge>
              </div>
              {loanProduct.prepaymentAllowed && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Penalty:</span>
                  <span className="text-slate-700 dark:text-slate-300">{formatPercentage(loanProduct.prepaymentPenaltyRate)}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Requirements */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Requirements</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Min Credit Score:</span>
                <span className="font-medium text-slate-900 dark:text-white">{loanProduct.minCreditScore}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Collateral:</span>
                <Badge variant={loanProduct.collateralRequired ? "default" : "secondary"} className="text-xs">
                  {loanProduct.collateralRequired ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Guarantor:</span>
                <Badge variant={loanProduct.guarantorRequired ? "default" : "secondary"} className="text-xs">
                  {loanProduct.guarantorRequired ? "Yes" : "No"}
                </Badge>
              </div>
              {documents.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-600">
                  <span className="text-slate-600 dark:text-slate-400 text-xs block mb-2">Documents:</span>
                  <div className="flex flex-wrap gap-1">
                    {documents.slice(0, 3).map((doc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{doc}</Badge>
                    ))}
                    {documents.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{documents.length - 3} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Approval Settings */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Approval</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Partner:</span>
                <Badge variant={loanProduct.requiresPartnerApproval ? "default" : "secondary"} className="text-xs">
                  {loanProduct.requiresPartnerApproval ? "Required" : "Not Required"}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Admin:</span>
                <Badge variant={loanProduct.requiresAdminApproval ? "default" : "secondary"} className="text-xs">
                  {loanProduct.requiresAdminApproval ? "Required" : "Not Required"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Auto Threshold:</span>
                <span className="text-slate-700 dark:text-slate-300">{formatCurrency(loanProduct.autoApproveThreshold)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Min Score:</span>
                <span className="text-slate-700 dark:text-slate-300">{loanProduct.minScoreForAutoApprove}</span>
              </div>
            </div>
          </Card>

          {/* Terms and Conditions */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow md:col-span-2 xl:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Terms and Conditions</h3>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                {loanProduct.termsAndConditions}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoanProductDetailsPage;
