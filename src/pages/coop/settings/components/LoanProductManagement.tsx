import { useState } from "react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Badge } from "../../../../common/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { LoanProduct, LoanProductFormData } from "../../../../constants/interface/coop/loan-product";
import LoanProductForm from "./LoanProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../common/ui/dialog";

// Mock data for demonstration
const mockLoanProducts: LoanProduct[] = [
  {
    id: "1",
    productName: "Consumer Loan",
    productCode: "CL001",
    description: "Short-term consumer loan for personal expenses",
    isActive: true,
    loanAmount: {
      minimum: 1000,
      maximum: 50000,
      currency: "ETB"
    },
    interestRate: {
      type: "fixed",
      value: 12.5,
      calculationMethod: "reducing_balance"
    },
    repaymentPeriod: {
      minimum: 3,
      maximum: 12,
      default: 6
    },
    installmentFrequency: "monthly",
    eligibilityCriteria: {
      targetSegment: "consumers",
      minimumMembershipMonths: 6,
      minimumAge: 18,
      maximumAge: 65,
      requiredDocuments: ["ID", "Proof of Membership", "Income Statement"]
    },
    fees: {
      processingFee: {
        type: "percentage",
        value: 2
      },
      latePaymentFee: {
        type: "fixed",
        value: 200
      }
    },
    riskManagement: {
      defaultRiskRules: {
        gracePeriod: 7,
        escalationPeriod: 30,
        writeOffPeriod: 90
      },
      collateralRequired: false,
      guarantorRequired: false
    },
    disbursement: {
      method: "wallet",
      processingTime: 1,
      autoDisbursement: true
    },
    repayment: {
      channels: ["salary_deduction", "bank_transfer"],
      autoDeduction: true,
      gracePeriod: 3
    },
    termsAndConditions: {
      templateId: "consumer-loan-tc"
    },
    settings: {
      allowEarlyRepayment: true,
      allowPartialRepayment: false,
      allowTopUp: false,
      requireApproval: true,
      maxApplicationsPerUser: 1,
      coolingOffPeriod: 1
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    productName: "SME Business Loan",
    productCode: "SME001",
    description: "Medium-term business loan for small and medium enterprises",
    isActive: true,
    loanAmount: {
      minimum: 10000,
      maximum: 500000,
      currency: "ETB"
    },
    interestRate: {
      type: "tiered",
      value: 0,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, rate: 10.5 },
        { minAmount: 50000, maxAmount: 200000, rate: 9.5 },
        { minAmount: 200000, maxAmount: 500000, rate: 8.5 }
      ],
      calculationMethod: "reducing_balance"
    },
    repaymentPeriod: {
      minimum: 6,
      maximum: 36,
      default: 24
    },
    installmentFrequency: "monthly",
    eligibilityCriteria: {
      targetSegment: "institutions",
      minimumMembershipMonths: 12,
      minimumAge: 21,
      requiredDocuments: ["Business License", "Financial Statements", "Tax Certificate"]
    },
    fees: {
      processingFee: {
        type: "percentage",
        value: 1.5
      },
      latePaymentFee: {
        type: "percentage",
        value: 2
      }
    },
    riskManagement: {
      defaultRiskRules: {
        gracePeriod: 14,
        escalationPeriod: 45,
        writeOffPeriod: 120
      },
      collateralRequired: true,
      guarantorRequired: true
    },
    disbursement: {
      method: "bank_transfer",
      processingTime: 3,
      autoDisbursement: false
    },
    repayment: {
      channels: ["bank_transfer", "mobile_money"],
      autoDeduction: false,
      gracePeriod: 7
    },
    termsAndConditions: {
      templateId: "sme-loan-tc"
    },
    settings: {
      allowEarlyRepayment: true,
      allowPartialRepayment: true,
      allowTopUp: true,
      requireApproval: true,
      maxApplicationsPerUser: 3,
      coolingOffPeriod: 3
    },
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z"
  }
];

const LoanProductManagement = () => {
  const [products, setProducts] = useState<LoanProduct[]>(mockLoanProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (formData: LoanProductFormData) => {
    const newProduct: LoanProduct = {
      id: Date.now().toString(),
      productName: formData.productName,
      productCode: formData.productCode,
      description: formData.description,
      isActive: formData.isActive,
      loanAmount: {
        minimum: formData.loanAmountMin,
        maximum: formData.loanAmountMax,
        currency: formData.currency
      },
      interestRate: {
        type: formData.interestRateType,
        value: formData.interestRateValue,
        tiers: formData.interestRateType === 'tiered' ? [] : undefined,
        calculationMethod: formData.interestRateCalculationMethod,
        compoundingFrequency: formData.compoundingFrequency
      },
      repaymentPeriod: {
        minimum: formData.repaymentPeriodMin,
        maximum: formData.repaymentPeriodMax,
        default: formData.repaymentPeriodDefault
      },
      installmentFrequency: formData.installmentFrequency,
      eligibilityCriteria: {
        targetSegment: formData.targetSegment,
        minimumMembershipMonths: formData.minimumMembershipMonths,
        minimumAge: formData.minimumAge,
        maximumAge: formData.maximumAge,
        minimumIncome: formData.minimumIncome,
        requiredDocuments: formData.requiredDocuments,
        creditScoreMinimum: formData.creditScoreMinimum
      },
      fees: {
        processingFee: {
          type: formData.processingFeeType,
          value: formData.processingFeeValue
        },
        latePaymentFee: {
          type: formData.latePaymentFeeType,
          value: formData.latePaymentFeeValue
        },
        earlyRepaymentFee: formData.earlyRepaymentFeeValue ? {
          type: formData.earlyRepaymentFeeType!,
          value: formData.earlyRepaymentFeeValue
        } : undefined,
        disbursementFee: formData.disbursementFeeValue ? {
          type: formData.disbursementFeeType!,
          value: formData.disbursementFeeValue
        } : undefined
      },
      riskManagement: {
        defaultRiskRules: {
          gracePeriod: formData.gracePeriod,
          escalationPeriod: formData.escalationPeriod,
          writeOffPeriod: formData.writeOffPeriod
        },
        maximumLoanToValueRatio: formData.maximumLoanToValueRatio,
        maximumDebtToIncomeRatio: formData.maximumDebtToIncomeRatio,
        collateralRequired: formData.collateralRequired,
        guarantorRequired: formData.guarantorRequired
      },
      disbursement: {
        method: formData.disbursementMethod,
        processingTime: formData.processingTime,
        autoDisbursement: formData.autoDisbursement
      },
      repayment: {
        channels: formData.repaymentChannels,
        autoDeduction: formData.autoDeduction,
        gracePeriod: formData.repaymentGracePeriod
      },
      termsAndConditions: {
        templateId: formData.templateId,
        customTerms: formData.customTerms
      },
      settings: {
        allowEarlyRepayment: formData.allowEarlyRepayment,
        allowPartialRepayment: formData.allowPartialRepayment,
        allowTopUp: formData.allowTopUp,
        requireApproval: formData.requireApproval,
        maxApplicationsPerUser: formData.maxApplicationsPerUser,
        coolingOffPeriod: formData.coolingOffPeriod
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts([...products, newProduct]);
    setIsCreateModalOpen(false);
  };

  const handleEditProduct = (formData: LoanProductFormData) => {
    if (!selectedProduct) return;

    const updatedProduct: LoanProduct = {
      ...selectedProduct,
      productName: formData.productName,
      productCode: formData.productCode,
      description: formData.description,
      isActive: formData.isActive,
      loanAmount: {
        minimum: formData.loanAmountMin,
        maximum: formData.loanAmountMax,
        currency: formData.currency
      },
      interestRate: {
        type: formData.interestRateType,
        value: formData.interestRateValue,
        tiers: formData.interestRateType === 'tiered' ? [] : undefined,
        calculationMethod: formData.interestRateCalculationMethod,
        compoundingFrequency: formData.compoundingFrequency
      },
      repaymentPeriod: {
        minimum: formData.repaymentPeriodMin,
        maximum: formData.repaymentPeriodMax,
        default: formData.repaymentPeriodDefault
      },
      installmentFrequency: formData.installmentFrequency,
      eligibilityCriteria: {
        targetSegment: formData.targetSegment,
        minimumMembershipMonths: formData.minimumMembershipMonths,
        minimumAge: formData.minimumAge,
        maximumAge: formData.maximumAge,
        minimumIncome: formData.minimumIncome,
        requiredDocuments: formData.requiredDocuments,
        creditScoreMinimum: formData.creditScoreMinimum
      },
      fees: {
        processingFee: {
          type: formData.processingFeeType,
          value: formData.processingFeeValue
        },
        latePaymentFee: {
          type: formData.latePaymentFeeType,
          value: formData.latePaymentFeeValue
        },
        earlyRepaymentFee: formData.earlyRepaymentFeeValue ? {
          type: formData.earlyRepaymentFeeType!,
          value: formData.earlyRepaymentFeeValue
        } : undefined,
        disbursementFee: formData.disbursementFeeValue ? {
          type: formData.disbursementFeeType!,
          value: formData.disbursementFeeValue
        } : undefined
      },
      riskManagement: {
        defaultRiskRules: {
          gracePeriod: formData.gracePeriod,
          escalationPeriod: formData.escalationPeriod,
          writeOffPeriod: formData.writeOffPeriod
        },
        maximumLoanToValueRatio: formData.maximumLoanToValueRatio,
        maximumDebtToIncomeRatio: formData.maximumDebtToIncomeRatio,
        collateralRequired: formData.collateralRequired,
        guarantorRequired: formData.guarantorRequired
      },
      disbursement: {
        method: formData.disbursementMethod,
        processingTime: formData.processingTime,
        autoDisbursement: formData.autoDisbursement
      },
      repayment: {
        channels: formData.repaymentChannels,
        autoDeduction: formData.autoDeduction,
        gracePeriod: formData.repaymentGracePeriod
      },
      termsAndConditions: {
        templateId: formData.templateId,
        customTerms: formData.customTerms
      },
      settings: {
        allowEarlyRepayment: formData.allowEarlyRepayment,
        allowPartialRepayment: formData.allowPartialRepayment,
        allowTopUp: formData.allowTopUp,
        requireApproval: formData.requireApproval,
        maxApplicationsPerUser: formData.maxApplicationsPerUser,
        coolingOffPeriod: formData.coolingOffPeriod
      },
      updatedAt: new Date().toISOString()
    };

    setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleToggleStatus = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const openEditModal = (product: LoanProduct) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openViewModal = (product: LoanProduct) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Loan Products</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage loan product configurations and settings</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Loan Product</DialogTitle>
            </DialogHeader>
            <LoanProductForm onSubmit={handleCreateProduct} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Loan Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Repayment Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.productName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.productCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {product.loanAmount.currency} {product.loanAmount.minimum.toLocaleString()} - {product.loanAmount.maximum.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {product.interestRate.type === 'fixed' 
                        ? `${product.interestRate.value}%` 
                        : product.interestRate.type === 'tiered' 
                        ? 'Tiered' 
                        : 'Variable'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {product.interestRate.calculationMethod.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {product.repaymentPeriod.minimum}-{product.repaymentPeriod.maximum} months
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {product.installmentFrequency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(product.id)}
                        className="p-1"
                      >
                        {product.isActive ? (
                          <ToggleRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(product)}
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewModal(product)}
                        className="p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Loan Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <LoanProductForm 
              onSubmit={handleEditProduct} 
              initialData={selectedProduct}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      {isViewModalOpen && selectedProduct && (
        <LoanProductDetailsModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

interface LoanProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: LoanProduct;
}

const LoanProductDetailsModal = ({ isOpen, onClose, product }: LoanProductDetailsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{product.productName}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{product.productCode}</p>
            {product.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{product.description}</p>
            )}
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span>{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </Card>

          {/* Loan Amount */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Loan Amount</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                <span>{product.loanAmount.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Minimum:</span>
                <span>{product.loanAmount.currency} {product.loanAmount.minimum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Maximum:</span>
                <span>{product.loanAmount.currency} {product.loanAmount.maximum.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Interest Rate */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Interest Rate</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className="capitalize">{product.interestRate.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                <span>{product.interestRate.value}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Calculation:</span>
                <span className="capitalize">{product.interestRate.calculationMethod.replace('_', ' ')}</span>
              </div>
              {product.interestRate.compoundingFrequency && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Compounding:</span>
                  <span className="capitalize">{product.interestRate.compoundingFrequency}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Repayment Terms */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Repayment Terms</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Min Period:</span>
                <span>{product.repaymentPeriod.minimum} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Max Period:</span>
                <span>{product.repaymentPeriod.maximum} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Default Period:</span>
                <span>{product.repaymentPeriod.default} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                <span className="capitalize">{product.installmentFrequency}</span>
              </div>
            </div>
          </Card>

          {/* Eligibility Criteria */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Eligibility Criteria</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Target Segment:</span>
                <span className="capitalize">{product.eligibilityCriteria.targetSegment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Min Membership:</span>
                <span>{product.eligibilityCriteria.minimumMembershipMonths} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Min Age:</span>
                <span>{product.eligibilityCriteria.minimumAge} years</span>
              </div>
              {product.eligibilityCriteria.maximumAge && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Max Age:</span>
                  <span>{product.eligibilityCriteria.maximumAge} years</span>
                </div>
              )}
              {product.eligibilityCriteria.minimumIncome && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Min Income:</span>
                  <span>{product.eligibilityCriteria.minimumIncome.toLocaleString()}</span>
                </div>
              )}
            </div>
            {product.eligibilityCriteria.requiredDocuments.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Required Documents:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.eligibilityCriteria.requiredDocuments.map((doc, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{doc}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Fees and Charges */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Fees and Charges</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
                <span>{product.fees.processingFee.value}{product.fees.processingFee.type === 'percentage' ? '%' : ' ETB'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Late Payment Fee:</span>
                <span>{product.fees.latePaymentFee.value}{product.fees.latePaymentFee.type === 'percentage' ? '%' : ' ETB'}</span>
              </div>
              {product.fees.earlyRepaymentFee && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Early Repayment:</span>
                  <span>{product.fees.earlyRepaymentFee.value}{product.fees.earlyRepaymentFee.type === 'percentage' ? '%' : ' ETB'}</span>
                </div>
              )}
              {product.fees.disbursementFee && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Disbursement Fee:</span>
                  <span>{product.fees.disbursementFee.value}{product.fees.disbursementFee.type === 'percentage' ? '%' : ' ETB'}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Risk Management */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Risk Management</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Grace Period:</span>
                <span>{product.riskManagement.defaultRiskRules.gracePeriod} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Escalation Period:</span>
                <span>{product.riskManagement.defaultRiskRules.escalationPeriod} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Write-off Period:</span>
                <span>{product.riskManagement.defaultRiskRules.writeOffPeriod} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Collateral Required:</span>
                <Badge variant={product.riskManagement.collateralRequired ? "default" : "secondary"}>
                  {product.riskManagement.collateralRequired ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Guarantor Required:</span>
                <Badge variant={product.riskManagement.guarantorRequired ? "default" : "secondary"}>
                  {product.riskManagement.guarantorRequired ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Disbursement & Repayment */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Disbursement & Repayment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Disbursement Method:</span>
                <span className="capitalize">{product.disbursement.method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Processing Time:</span>
                <span>{product.disbursement.processingTime} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Auto Disbursement:</span>
                <Badge variant={product.disbursement.autoDisbursement ? "default" : "secondary"}>
                  {product.disbursement.autoDisbursement ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Auto Deduction:</span>
                <Badge variant={product.repayment.autoDeduction ? "default" : "secondary"}>
                  {product.repayment.autoDeduction ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            {product.repayment.channels.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Repayment Channels:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.repayment.channels.map((channel, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {channel.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Product Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Product Settings</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Early Repayment:</span>
                <Badge variant={product.settings.allowEarlyRepayment ? "default" : "secondary"}>
                  {product.settings.allowEarlyRepayment ? "Allowed" : "Not Allowed"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Partial Repayment:</span>
                <Badge variant={product.settings.allowPartialRepayment ? "default" : "secondary"}>
                  {product.settings.allowPartialRepayment ? "Allowed" : "Not Allowed"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Top-up:</span>
                <Badge variant={product.settings.allowTopUp ? "default" : "secondary"}>
                  {product.settings.allowTopUp ? "Allowed" : "Not Allowed"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Requires Approval:</span>
                <Badge variant={product.settings.requireApproval ? "default" : "secondary"}>
                  {product.settings.requireApproval ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Max Applications:</span>
                <span>{product.settings.maxApplicationsPerUser} per user</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cooling Off Period:</span>
                <span>{product.settings.coolingOffPeriod} days</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanProductManagement;
