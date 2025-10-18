# Loan Product Management System

This directory contains the comprehensive loan product management system that integrates with the backend API endpoints for managing loan types/products.

## Components

### 1. LoanProductManagementNew.tsx
The main component for managing loan products with full CRUD operations.

**Features:**
- List all loan products with search and filtering
- Create new loan products
- Edit existing loan products
- View detailed product information
- Activate/deactivate products
- Delete products
- Advanced filtering by status, requirements, and approval types

### 2. LoanProductFormNew.tsx
A comprehensive form for creating and editing loan products.

**Form Sections:**
- **Basic Info**: Product name, code, description, display order
- **Loan Terms**: Amount ranges, interest rates, repayment periods, eligibility criteria
- **Fees & Charges**: Processing fees, penalties, prepayment settings
- **Approval & Risk**: Approval requirements, risk management settings, terms and conditions

### 3. useLoanProducts.tsx
Custom React hooks for managing loan product data and API operations.

**Hooks:**
- `useLoanProducts()` - Get all loan products with filtering
- `useLoanProduct(id)` - Get single loan product by ID
- `useCreateLoanProduct()` - Create new loan product
- `useUpdateLoanProduct()` - Update existing loan product
- `useDeleteLoanProduct()` - Delete loan product
- `useActivateLoanProduct()` - Activate loan product
- `useDeactivateLoanProduct()` - Deactivate loan product
- `useCheckLoanProductCode()` - Check if product code exists
- `useActiveLoanProducts()` - Get only active products
- `useLoanProductsRequiringPartnerApproval()` - Get products requiring partner approval
- `useLoanProductsRequiringAdminApproval()` - Get products requiring admin approval
- `useLoanProductsByCollateralRequirement()` - Get products by collateral requirement

## API Integration

### Service: loanProductService.ts
Complete service layer with all API endpoints:

**Endpoints Implemented:**
- `GET /v1/loan-types` - Get all loan types with filters
- `GET /v1/loan-types/{id}` - Get loan type by ID
- `GET /v1/loan-types/code/{code}` - Get loan type by code
- `GET /v1/loan-types/active` - Get active loan types
- `GET /v1/loan-types/partner-approval` - Get products requiring partner approval
- `GET /v1/loan-types/admin-approval` - Get products requiring admin approval
- `GET /v1/loan-types/collateral/{required}` - Get products by collateral requirement
- `GET /v1/loan-types/exists/{code}` - Check if code exists
- `POST /v1/loan-types` - Create new loan type
- `PUT /v1/loan-types/{id}` - Update loan type
- `PUT /v1/loan-types/{id}/activate` - Activate loan type
- `PUT /v1/loan-types/{id}/deactivate` - Deactivate loan type
- `DELETE /v1/loan-types/{id}` - Delete loan type

## Data Models

### LoanProduct Interface
Matches the API response structure with all fields from the backend:

```typescript
interface LoanProduct {
  id: number;
  code: string;
  name: string;
  description: string;
  defaultInterestRate: number;
  minInterestRate: number;
  maxInterestRate: number;
  defaultRepaymentPeriodMonths: number;
  minRepaymentPeriodMonths: number;
  maxRepaymentPeriodMonths: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  processingFeeType: "PERCENTAGE" | "FIXED";
  processingFeeValue: number;
  minProcessingFee: number;
  maxProcessingFee: number;
  latePaymentPenaltyRate: number;
  prepaymentAllowed: boolean;
  prepaymentPenaltyRate: number;
  collateralRequired: boolean;
  guarantorRequired: boolean;
  minCreditScore: number;
  requiredDocuments: string[];
  requiresPartnerApproval: boolean;
  requiresAdminApproval: boolean;
  autoApproveThreshold: number;
  minScoreForAutoApprove: number;
  isActive: boolean;
  displayOrder: number;
  additionalSettings: any;
  termsAndConditions: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: number | null;
}
```

## Usage

### Basic Usage
```tsx
import LoanProductManagementNew from './components/LoanProductManagementNew';

function LoanSettingsPage() {
  return (
    <div>
      <h1>Loan Settings</h1>
      <LoanProductManagementNew />
    </div>
  );
}
```

### Using Hooks
```tsx
import { useLoanProducts, useCreateLoanProduct } from './hooks/useLoanProducts';

function MyComponent() {
  const { loanProducts, isLoading } = useLoanProducts();
  const createMutation = useCreateLoanProduct();

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div>
      {isLoading ? 'Loading...' : loanProducts.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Features

### Search and Filtering
- Search by product name, code, or description
- Filter by status (Active/Inactive)
- Filter by collateral requirements
- Filter by guarantor requirements
- Filter by approval type (Partner/Admin)

### Form Validation
- Required field validation
- Range validation for amounts and rates
- Code uniqueness validation
- Business logic validation

### Error Handling
- API error handling with user-friendly messages
- Form validation errors
- Loading states for all operations

### Responsive Design
- Mobile-friendly table layout
- Responsive form design
- Adaptive modal sizing

## Utility Functions

### loan-product-utils.ts
Helper functions for data transformation and formatting:

- `transformToLegacyFormat()` - Convert API format to legacy format
- `transformToApiFormat()` - Convert legacy format to API format
- `formatCurrency()` - Format currency values
- `formatPercentage()` - Format percentage values
- `formatDate()` - Format date values
- `validateLoanProductForm()` - Validate form data

## Integration

The system is integrated into the main loan settings page at:
`/coop/loan-monitoring/settings`

The component is used in:
- `LoanSettingsPage.tsx` - Main settings page
- Can be imported and used in other components as needed

## Dependencies

- React Query for data fetching and caching
- React Hook Form for form management
- Tailwind CSS for styling
- Lucide React for icons
- Custom UI components from `../../../common/ui/`

## Testing

The system includes comprehensive error handling and validation. All API operations are wrapped in try-catch blocks with user feedback via toast notifications.

## Future Enhancements

- Bulk operations (bulk activate/deactivate)
- Export functionality
- Advanced reporting
- Product templates
- Version history tracking
- Audit logging
