import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Badge } from "../../../../common/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Filter, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../common/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { LoanProduct } from "../../../../constants/interface/coop/loan-product";
import LoanProductFormNew from "./LoanProductFormNew";
import { 
  useLoanProducts, 
  useCreateLoanProduct, 
  useUpdateLoanProduct, 
  useDeleteLoanProduct,
  useActivateLoanProduct,
  useDeactivateLoanProduct,
  useCheckLoanProductCode
} from "../../hooks/useLoanProducts";
import { LoanProductFilters } from "../../../../services/loanProductService";

const LoanProductManagementNew = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<LoanProduct | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<LoanProductFilters>({});

  // API hooks
  const { loanProducts, isLoading } = useLoanProducts(filters);
  const createMutation = useCreateLoanProduct();
  const deleteMutation = useDeleteLoanProduct();
  const activateMutation = useActivateLoanProduct();
  const deactivateMutation = useDeactivateLoanProduct();
  const checkCodeMutation = useCheckLoanProductCode();


  // Filter products based on search term
  const filteredProducts = loanProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (formData: any) => {
    try {
      // Check if code already exists
      const codeCheck = await checkCodeMutation.mutateAsync(formData.code);
      if (codeCheck.data.exists) {
        throw new Error('Product code already exists');
      }
      
      await createMutation.mutateAsync(formData);
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error('Error creating product:', error);
    }
  };


  const openDeleteModal = (product: LoanProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteMutation.mutateAsync(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggleStatus = async (product: LoanProduct) => {
    try {
      if (product.isActive) {
        await deactivateMutation.mutateAsync(product.id);
      } else {
        await activateMutation.mutateAsync(product.id);
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const openViewPage = (product: LoanProduct) => {
    navigate(`/coop/settings/loan-products/view/${product.id}`);
  };

  const openEditPage = (product: LoanProduct) => {
    navigate(`/coop/settings/loan-products/edit/${product.id}`);
  };

  const handleFilterChange = (key: keyof LoanProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
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
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Loan Product</DialogTitle>
            </DialogHeader>
            <LoanProductFormNew 
              onSubmit={handleCreateProduct} 
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products by name, code, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          {(Object.keys(filters).length > 0 || searchTerm) && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Status
                </label>
                <Select
                  value={filters.isActive?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('isActive', value === 'true' ? true : value === 'false' ? false : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Collateral Required
                </label>
                <Select
                  value={filters.collateralRequired?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('collateralRequired', value === 'true' ? true : value === 'false' ? false : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Required</SelectItem>
                    <SelectItem value="false">Not Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Guarantor Required
                </label>
                <Select
                  value={filters.guarantorRequired?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('guarantorRequired', value === 'true' ? true : value === 'false' ? false : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Required</SelectItem>
                    <SelectItem value="false">Not Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Approval Type
                </label>
                <Select
                  value={
                    filters.requiresPartnerApproval === true ? 'partner' :
                    filters.requiresAdminApproval === true ? 'admin' : 'all'
                  }
                  onValueChange={(value) => {
                    if (value === 'partner') {
                      handleFilterChange('requiresPartnerApproval', true);
                      handleFilterChange('requiresAdminApproval', undefined);
                    } else if (value === 'admin') {
                      handleFilterChange('requiresAdminApproval', true);
                      handleFilterChange('requiresPartnerApproval', undefined);
                    } else {
                      handleFilterChange('requiresPartnerApproval', undefined);
                      handleFilterChange('requiresAdminApproval', undefined);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="partner">Partner Approval</SelectItem>
                    <SelectItem value="admin">Admin Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
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
                  Requirements
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading loan products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No loan products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.code}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(product.minLoanAmount)} - {formatCurrency(product.maxLoanAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatPercentage(product.defaultInterestRate)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPercentage(product.minInterestRate)} - {formatPercentage(product.maxInterestRate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {product.minRepaymentPeriodMonths}-{product.maxRepaymentPeriodMonths} months
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Default: {product.defaultRepaymentPeriodMonths} months
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.collateralRequired && (
                          <Badge variant="outline" className="text-xs">Collateral</Badge>
                        )}
                        {product.guarantorRequired && (
                          <Badge variant="outline" className="text-xs">Guarantor</Badge>
                        )}
                        {product.requiresPartnerApproval && (
                          <Badge variant="outline" className="text-xs">Partner Approval</Badge>
                        )}
                        {product.requiresAdminApproval && (
                          <Badge variant="outline" className="text-xs">Admin Approval</Badge>
                        )}
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
                          onClick={() => handleToggleStatus(product)}
                          className="p-1"
                          disabled={activateMutation.isPending || deactivateMutation.isPending}
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
                          onClick={() => openEditPage(product)}
                          className="p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewPage(product)}
                          className="p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(product)}
                          className="p-1 text-red-600 hover:text-red-700"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>


      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={(open) => {
        setIsDeleteModalOpen(open);
        if (!open) {
          setProductToDelete(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Delete Loan Product
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this loan product? This action cannot be undone.
            </p>
            {productToDelete && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">{productToDelete.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{productToDelete.code}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                  {productToDelete.description}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default LoanProductManagementNew;
