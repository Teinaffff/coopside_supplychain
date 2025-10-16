import { useState, useEffect } from "react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import { Textarea } from "../../../../common/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { Checkbox } from "../../../../common/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../common/ui/tabs";
import { LoanProduct, LoanProductFormData } from "../../../../constants/interface/coop/loan-product";
import { Plus, Trash2 } from "lucide-react";

interface LoanProductFormProps {
  onSubmit: (data: LoanProductFormData) => void;
  initialData?: LoanProduct;
}

const LoanProductForm = ({ onSubmit, initialData }: LoanProductFormProps) => {
  const [formData, setFormData] = useState<LoanProductFormData>({
    productName: "",
    productCode: "",
    description: "",
    isActive: true,
    loanAmountMin: 0,
    loanAmountMax: 0,
    currency: "ETB",
    interestRateType: "fixed",
    interestRateValue: 0,
    interestRateCalculationMethod: "reducing_balance",
    compoundingFrequency: "monthly",
    repaymentPeriodMin: 0,
    repaymentPeriodMax: 0,
    repaymentPeriodDefault: 0,
    installmentFrequency: "monthly",
    targetSegment: "consumers",
    minimumMembershipMonths: 0,
    minimumAge: 18,
    maximumAge: 65,
    minimumIncome: 0,
    requiredDocuments: [],
    creditScoreMinimum: 0,
    processingFeeType: "percentage",
    processingFeeValue: 0,
    latePaymentFeeType: "percentage",
    latePaymentFeeValue: 0,
    earlyRepaymentFeeType: "percentage",
    earlyRepaymentFeeValue: 0,
    disbursementFeeType: "percentage",
    disbursementFeeValue: 0,
    gracePeriod: 0,
    escalationPeriod: 0,
    writeOffPeriod: 0,
    maximumLoanToValueRatio: 0,
    maximumDebtToIncomeRatio: 0,
    collateralRequired: false,
    guarantorRequired: false,
  });

  const [newDocument, setNewDocument] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName,
        productCode: initialData.productCode,
        description: initialData.description || "",
        isActive: initialData.isActive,
        loanAmountMin: initialData.loanAmount.minimum,
        loanAmountMax: initialData.loanAmount.maximum,
        currency: initialData.loanAmount.currency,
        interestRateType: initialData.interestRate.type,
        interestRateValue: initialData.interestRate.value,
        interestRateCalculationMethod: initialData.interestRate.calculationMethod,
        compoundingFrequency: initialData.interestRate.compoundingFrequency || "monthly",
        repaymentPeriodMin: initialData.repaymentPeriod.minimum,
        repaymentPeriodMax: initialData.repaymentPeriod.maximum,
        repaymentPeriodDefault: initialData.repaymentPeriod.default,
        installmentFrequency: initialData.installmentFrequency,
        targetSegment: initialData.eligibilityCriteria.targetSegment,
        minimumMembershipMonths: initialData.eligibilityCriteria.minimumMembershipMonths,
        minimumAge: initialData.eligibilityCriteria.minimumAge,
        maximumAge: initialData.eligibilityCriteria.maximumAge,
        minimumIncome: initialData.eligibilityCriteria.minimumIncome || 0,
        requiredDocuments: initialData.eligibilityCriteria.requiredDocuments,
        creditScoreMinimum: initialData.eligibilityCriteria.creditScoreMinimum || 0,
        processingFeeType: initialData.fees.processingFee.type,
        processingFeeValue: initialData.fees.processingFee.value,
        latePaymentFeeType: initialData.fees.latePaymentFee.type,
        latePaymentFeeValue: initialData.fees.latePaymentFee.value,
        earlyRepaymentFeeType: initialData.fees.earlyRepaymentFee?.type || "percentage",
        earlyRepaymentFeeValue: initialData.fees.earlyRepaymentFee?.value || 0,
        disbursementFeeType: initialData.fees.disbursementFee?.type || "percentage",
        disbursementFeeValue: initialData.fees.disbursementFee?.value || 0,
        gracePeriod: initialData.riskManagement.defaultRiskRules.gracePeriod,
        escalationPeriod: initialData.riskManagement.defaultRiskRules.escalationPeriod,
        writeOffPeriod: initialData.riskManagement.defaultRiskRules.writeOffPeriod,
        maximumLoanToValueRatio: initialData.riskManagement.maximumLoanToValueRatio || 0,
        maximumDebtToIncomeRatio: initialData.riskManagement.maximumDebtToIncomeRatio || 0,
        collateralRequired: initialData.riskManagement.collateralRequired,
        guarantorRequired: initialData.riskManagement.guarantorRequired
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof LoanProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: 'requiredDocuments', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      if (field === 'requiredDocuments') setNewDocument("");
    }
  };

  const handleArrayRemove = (field: 'requiredDocuments', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="terms">Loan Terms</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="fees">Fees & Charges</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  placeholder="e.g., Consumer Loan"
                  required
                />
              </div>
              <div>
                <Label htmlFor="productCode">Product Code *</Label>
                <Input
                  id="productCode"
                  value={formData.productCode}
                  onChange={(e) => handleInputChange('productCode', e.target.value)}
                  placeholder="e.g., CL001"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the loan product"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Product is active</Label>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Loan Terms */}
        <TabsContent value="terms" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Loan Amount & Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">ETB (Ethiopian Birr)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="loanAmountMin">Minimum Amount *</Label>
                <Input
                  id="loanAmountMin"
                  type="number"
                  value={formData.loanAmountMin}
                  onChange={(e) => handleInputChange('loanAmountMin', Number(e.target.value))}
                  placeholder="1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="loanAmountMax">Maximum Amount *</Label>
                <Input
                  id="loanAmountMax"
                  type="number"
                  value={formData.loanAmountMax}
                  onChange={(e) => handleInputChange('loanAmountMax', Number(e.target.value))}
                  placeholder="50000"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Interest Rate Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="interestRateType">Interest Rate Type *</Label>
                <Select value={formData.interestRateType} onValueChange={(value) => handleInputChange('interestRateType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Rate</SelectItem>
                    <SelectItem value="variable">Variable Rate</SelectItem>
                    <SelectItem value="tiered">Tiered Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interestRateValue">Interest Rate (%) *</Label>
                <Input
                  id="interestRateValue"
                  type="number"
                  step="0.01"
                  value={formData.interestRateValue}
                  onChange={(e) => handleInputChange('interestRateValue', Number(e.target.value))}
                  placeholder="12.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="interestRateCalculationMethod">Calculation Method *</Label>
                <Select value={formData.interestRateCalculationMethod} onValueChange={(value) => handleInputChange('interestRateCalculationMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple Interest</SelectItem>
                    <SelectItem value="compound">Compound Interest</SelectItem>
                    <SelectItem value="reducing_balance">Reducing Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
                <Select value={formData.compoundingFrequency} onValueChange={(value) => handleInputChange('compoundingFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Repayment Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="repaymentPeriodMin">Min Period (months) *</Label>
                <Input
                  id="repaymentPeriodMin"
                  type="number"
                  value={formData.repaymentPeriodMin}
                  onChange={(e) => handleInputChange('repaymentPeriodMin', Number(e.target.value))}
                  placeholder="3"
                  required
                />
              </div>
              <div>
                <Label htmlFor="repaymentPeriodMax">Max Period (months) *</Label>
                <Input
                  id="repaymentPeriodMax"
                  type="number"
                  value={formData.repaymentPeriodMax}
                  onChange={(e) => handleInputChange('repaymentPeriodMax', Number(e.target.value))}
                  placeholder="12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="repaymentPeriodDefault">Default Period (months) *</Label>
                <Input
                  id="repaymentPeriodDefault"
                  type="number"
                  value={formData.repaymentPeriodDefault}
                  onChange={(e) => handleInputChange('repaymentPeriodDefault', Number(e.target.value))}
                  placeholder="6"
                  required
                />
              </div>
              <div>
                <Label htmlFor="installmentFrequency">Installment Frequency *</Label>
                <Select value={formData.installmentFrequency} onValueChange={(value) => handleInputChange('installmentFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Eligibility Criteria */}
        <TabsContent value="eligibility" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Eligibility Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="targetSegment">Target Segment *</Label>
                <Select value={formData.targetSegment} onValueChange={(value) => handleInputChange('targetSegment', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumers">Consumers</SelectItem>
                    <SelectItem value="agents">Agents</SelectItem>
                    <SelectItem value="sellers">Sellers</SelectItem>
                    <SelectItem value="institutions">Institutions</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minimumMembershipMonths">Min Membership (months) *</Label>
                <Input
                  id="minimumMembershipMonths"
                  type="number"
                  value={formData.minimumMembershipMonths}
                  onChange={(e) => handleInputChange('minimumMembershipMonths', Number(e.target.value))}
                  placeholder="6"
                  required
                />
              </div>
              <div>
                <Label htmlFor="minimumAge">Minimum Age *</Label>
                <Input
                  id="minimumAge"
                  type="number"
                  value={formData.minimumAge}
                  onChange={(e) => handleInputChange('minimumAge', Number(e.target.value))}
                  placeholder="18"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maximumAge">Maximum Age</Label>
                <Input
                  id="maximumAge"
                  type="number"
                  value={formData.maximumAge || ''}
                  onChange={(e) => handleInputChange('maximumAge', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="65"
                />
              </div>
              <div>
                <Label htmlFor="minimumIncome">Minimum Income</Label>
                <Input
                  id="minimumIncome"
                  type="number"
                  value={formData.minimumIncome || ''}
                  onChange={(e) => handleInputChange('minimumIncome', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="5000"
                />
              </div>
              <div>
                <Label htmlFor="creditScoreMinimum">Min Credit Score</Label>
                <Input
                  id="creditScoreMinimum"
                  type="number"
                  value={formData.creditScoreMinimum || ''}
                  onChange={(e) => handleInputChange('creditScoreMinimum', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="600"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Required Documents</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    placeholder="Add document type"
                  />
                  <Button
                    type="button"
                    onClick={() => handleArrayAdd('requiredDocuments', newDocument)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      <span className="text-sm">{doc}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArrayRemove('requiredDocuments', index)}
                        className="p-0 h-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Fees and Charges */}
        <TabsContent value="fees" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fees and Charges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="processingFeeType">Processing Fee Type</Label>
                <Select value={formData.processingFeeType} onValueChange={(value) => handleInputChange('processingFeeType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="processingFeeValue">Processing Fee Value</Label>
                <Input
                  id="processingFeeValue"
                  type="number"
                  step="0.01"
                  value={formData.processingFeeValue}
                  onChange={(e) => handleInputChange('processingFeeValue', Number(e.target.value))}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="latePaymentFeeType">Late Payment Fee Type</Label>
                <Select value={formData.latePaymentFeeType} onValueChange={(value) => handleInputChange('latePaymentFeeType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="latePaymentFeeValue">Late Payment Fee Value</Label>
                <Input
                  id="latePaymentFeeValue"
                  type="number"
                  step="0.01"
                  value={formData.latePaymentFeeValue}
                  onChange={(e) => handleInputChange('latePaymentFeeValue', Number(e.target.value))}
                  placeholder="200"
                />
              </div>
              <div>
                <Label htmlFor="earlyRepaymentFeeType">Early Repayment Fee Type</Label>
                <Select value={formData.earlyRepaymentFeeType || 'percentage'} onValueChange={(value) => handleInputChange('earlyRepaymentFeeType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="earlyRepaymentFeeValue">Early Repayment Fee Value</Label>
                <Input
                  id="earlyRepaymentFeeValue"
                  type="number"
                  step="0.01"
                  value={formData.earlyRepaymentFeeValue || ''}
                  onChange={(e) => handleInputChange('earlyRepaymentFeeValue', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="1"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Risk Management */}
        <TabsContent value="risk" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Risk Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="gracePeriod">Grace Period (days) *</Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  value={formData.gracePeriod}
                  onChange={(e) => handleInputChange('gracePeriod', Number(e.target.value))}
                  placeholder="7"
                  required
                />
              </div>
              <div>
                <Label htmlFor="escalationPeriod">Escalation Period (days) *</Label>
                <Input
                  id="escalationPeriod"
                  type="number"
                  value={formData.escalationPeriod}
                  onChange={(e) => handleInputChange('escalationPeriod', Number(e.target.value))}
                  placeholder="30"
                  required
                />
              </div>
              <div>
                <Label htmlFor="writeOffPeriod">Write-off Period (days) *</Label>
                <Input
                  id="writeOffPeriod"
                  type="number"
                  value={formData.writeOffPeriod}
                  onChange={(e) => handleInputChange('writeOffPeriod', Number(e.target.value))}
                  placeholder="90"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maximumLoanToValueRatio">Max Loan-to-Value Ratio (%)</Label>
                <Input
                  id="maximumLoanToValueRatio"
                  type="number"
                  step="0.01"
                  value={formData.maximumLoanToValueRatio || ''}
                  onChange={(e) => handleInputChange('maximumLoanToValueRatio', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="80"
                />
              </div>
              <div>
                <Label htmlFor="maximumDebtToIncomeRatio">Max Debt-to-Income Ratio (%)</Label>
                <Input
                  id="maximumDebtToIncomeRatio"
                  type="number"
                  step="0.01"
                  value={formData.maximumDebtToIncomeRatio || ''}
                  onChange={(e) => handleInputChange('maximumDebtToIncomeRatio', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="40"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="collateralRequired"
                  checked={formData.collateralRequired}
                  onCheckedChange={(checked) => handleInputChange('collateralRequired', checked)}
                />
                <Label htmlFor="collateralRequired">Collateral Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="guarantorRequired"
                  checked={formData.guarantorRequired}
                  onCheckedChange={(checked) => handleInputChange('guarantorRequired', checked)}
                />
                <Label htmlFor="guarantorRequired">Guarantor Required</Label>
              </div>
            </div>
          </Card>
        </TabsContent>

      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button type="submit" className="px-8">
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default LoanProductForm;
