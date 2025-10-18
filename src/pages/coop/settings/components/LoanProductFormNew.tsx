import { useState, useEffect } from "react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { Checkbox } from "../../../../common/ui/checkbox";
import { Textarea } from "../../../../common/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../common/ui/tabs";
import { Badge } from "../../../../common/ui/badge";
import { X, Plus } from "lucide-react";
import { LoanProduct, LoanProductFormData } from "../../../../constants/interface/coop/loan-product";

interface LoanProductFormProps {
  onSubmit: (data: LoanProductFormData) => void;
  initialData?: LoanProduct;
  isLoading?: boolean;
}

const LoanProductFormNew = ({ onSubmit, initialData, isLoading = false }: LoanProductFormProps) => {
  const [formData, setFormData] = useState<LoanProductFormData>({
    code: "",
    name: "",
    description: "",
    defaultInterestRate: 12.5,
    minInterestRate: 10.0,
    maxInterestRate: 18.0,
    defaultRepaymentPeriodMonths: 6,
    minRepaymentPeriodMonths: 1,
    maxRepaymentPeriodMonths: 12,
    minLoanAmount: 10000,
    maxLoanAmount: 500000,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 2.5,
    minProcessingFee: 500,
    maxProcessingFee: 10000,
    latePaymentPenaltyRate: 2.0,
    prepaymentAllowed: true,
    prepaymentPenaltyRate: 1.0,
    collateralRequired: false,
    guarantorRequired: true,
    minCreditScore: 650,
    requiredDocuments: [],
    requiresPartnerApproval: true,
    requiresAdminApproval: false,
    autoApproveThreshold: 50000,
    minScoreForAutoApprove: 750,
    displayOrder: 1,
    additionalSettings: null,
    termsAndConditions: "Loan must be repaid within agreed period. Late payments incur penalty fees."
  });

  const [newDocument, setNewDocument] = useState("");

  useEffect(() => {
    if (initialData) {
      // Parse requiredDocuments from JSON string to array
      let parsedDocuments: string[] = [];
      try {
        if (typeof initialData.requiredDocuments === 'string') {
          parsedDocuments = JSON.parse(initialData.requiredDocuments);
        } else if (Array.isArray(initialData.requiredDocuments)) {
          parsedDocuments = initialData.requiredDocuments;
        }
      } catch (error) {
        console.error('Error parsing requiredDocuments:', error);
        parsedDocuments = [];
      }

      setFormData({
        code: initialData.code,
        name: initialData.name,
        description: initialData.description,
        defaultInterestRate: initialData.defaultInterestRate,
        minInterestRate: initialData.minInterestRate,
        maxInterestRate: initialData.maxInterestRate,
        defaultRepaymentPeriodMonths: initialData.defaultRepaymentPeriodMonths,
        minRepaymentPeriodMonths: initialData.minRepaymentPeriodMonths,
        maxRepaymentPeriodMonths: initialData.maxRepaymentPeriodMonths,
        minLoanAmount: initialData.minLoanAmount,
        maxLoanAmount: initialData.maxLoanAmount,
        processingFeeType: initialData.processingFeeType,
        processingFeeValue: initialData.processingFeeValue,
        minProcessingFee: initialData.minProcessingFee,
        maxProcessingFee: initialData.maxProcessingFee,
        latePaymentPenaltyRate: initialData.latePaymentPenaltyRate,
        prepaymentAllowed: initialData.prepaymentAllowed,
        prepaymentPenaltyRate: initialData.prepaymentPenaltyRate,
        collateralRequired: initialData.collateralRequired,
        guarantorRequired: initialData.guarantorRequired,
        minCreditScore: initialData.minCreditScore,
        requiredDocuments: parsedDocuments,
        requiresPartnerApproval: initialData.requiresPartnerApproval,
        requiresAdminApproval: initialData.requiresAdminApproval,
        autoApproveThreshold: initialData.autoApproveThreshold,
        minScoreForAutoApprove: initialData.minScoreForAutoApprove,
        displayOrder: initialData.displayOrder,
        additionalSettings: initialData.additionalSettings,
        termsAndConditions: initialData.termsAndConditions
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof LoanProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'requiredDocuments', value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addDocument = () => {
    if (newDocument.trim() && !formData.requiredDocuments.includes(newDocument.trim())) {
      handleArrayInputChange('requiredDocuments', [...formData.requiredDocuments, newDocument.trim()]);
      setNewDocument("");
    }
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = formData.requiredDocuments.filter((_, i) => i !== index);
    handleArrayInputChange('requiredDocuments', updatedDocuments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.code || !formData.name || !formData.description) {
      console.error('Required fields missing');
      return;
    }
    
    // Transform data for API - convert requiredDocuments array to JSON string
    const apiData = {
      ...formData,
      requiredDocuments: JSON.stringify(formData.requiredDocuments)
    } as any; // Type assertion to handle the conversion
    
    onSubmit(apiData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="terms">Loan Terms</TabsTrigger>
          <TabsTrigger value="fees">Fees & Charges</TabsTrigger>
          <TabsTrigger value="approval">Approval & Risk</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Goods Purchase Financing"
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Product Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="e.g., GOODS_FINANCING"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the loan product..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Loan Terms */}
        <TabsContent value="terms" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Loan Amount & Interest</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minLoanAmount">Minimum Loan Amount (ETB) *</Label>
                <Input
                  id="minLoanAmount"
                  type="number"
                  value={formData.minLoanAmount}
                  onChange={(e) => handleInputChange('minLoanAmount', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxLoanAmount">Maximum Loan Amount (ETB) *</Label>
                <Input
                  id="maxLoanAmount"
                  type="number"
                  value={formData.maxLoanAmount}
                  onChange={(e) => handleInputChange('maxLoanAmount', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="defaultInterestRate">Default Interest Rate (%) *</Label>
                <Input
                  id="defaultInterestRate"
                  type="number"
                  value={formData.defaultInterestRate}
                  onChange={(e) => handleInputChange('defaultInterestRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="minInterestRate">Minimum Interest Rate (%) *</Label>
                <Input
                  id="minInterestRate"
                  type="number"
                  value={formData.minInterestRate}
                  onChange={(e) => handleInputChange('minInterestRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxInterestRate">Maximum Interest Rate (%) *</Label>
                <Input
                  id="maxInterestRate"
                  type="number"
                  value={formData.maxInterestRate}
                  onChange={(e) => handleInputChange('maxInterestRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Repayment Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="minRepaymentPeriodMonths">Minimum Period (Months) *</Label>
                <Input
                  id="minRepaymentPeriodMonths"
                  type="number"
                  value={formData.minRepaymentPeriodMonths}
                  onChange={(e) => handleInputChange('minRepaymentPeriodMonths', parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxRepaymentPeriodMonths">Maximum Period (Months) *</Label>
                <Input
                  id="maxRepaymentPeriodMonths"
                  type="number"
                  value={formData.maxRepaymentPeriodMonths}
                  onChange={(e) => handleInputChange('maxRepaymentPeriodMonths', parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="defaultRepaymentPeriodMonths">Default Period (Months) *</Label>
                <Input
                  id="defaultRepaymentPeriodMonths"
                  type="number"
                  value={formData.defaultRepaymentPeriodMonths}
                  onChange={(e) => handleInputChange('defaultRepaymentPeriodMonths', parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Eligibility Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minCreditScore">Minimum Credit Score *</Label>
                <Input
                  id="minCreditScore"
                  type="number"
                  value={formData.minCreditScore}
                  onChange={(e) => handleInputChange('minCreditScore', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="1000"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label>Required Documents</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      placeholder="Add required document..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                    />
                    <Button type="button" onClick={addDocument} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredDocuments.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {doc}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeDocument(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Fees & Charges */}
        <TabsContent value="fees" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Processing Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="processingFeeType">Processing Fee Type *</Label>
                <Select
                  value={formData.processingFeeType}
                  onValueChange={(value: "PERCENTAGE" | "FIXED") => handleInputChange('processingFeeType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="processingFeeValue">Processing Fee Value *</Label>
                <Input
                  id="processingFeeValue"
                  type="number"
                  value={formData.processingFeeValue}
                  onChange={(e) => handleInputChange('processingFeeValue', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="minProcessingFee">Minimum Processing Fee (ETB) *</Label>
                <Input
                  id="minProcessingFee"
                  type="number"
                  value={formData.minProcessingFee}
                  onChange={(e) => handleInputChange('minProcessingFee', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxProcessingFee">Maximum Processing Fee (ETB) *</Label>
                <Input
                  id="maxProcessingFee"
                  type="number"
                  value={formData.maxProcessingFee}
                  onChange={(e) => handleInputChange('maxProcessingFee', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Penalty & Prepayment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latePaymentPenaltyRate">Late Payment Penalty Rate (%) *</Label>
                <Input
                  id="latePaymentPenaltyRate"
                  type="number"
                  value={formData.latePaymentPenaltyRate}
                  onChange={(e) => handleInputChange('latePaymentPenaltyRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="prepaymentPenaltyRate">Prepayment Penalty Rate (%) *</Label>
                <Input
                  id="prepaymentPenaltyRate"
                  type="number"
                  value={formData.prepaymentPenaltyRate}
                  onChange={(e) => handleInputChange('prepaymentPenaltyRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prepaymentAllowed"
                    checked={formData.prepaymentAllowed}
                    onCheckedChange={(checked) => handleInputChange('prepaymentAllowed', checked)}
                  />
                  <Label htmlFor="prepaymentAllowed">Allow Prepayment</Label>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Approval & Risk */}
        <TabsContent value="approval" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Approval Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresPartnerApproval"
                    checked={formData.requiresPartnerApproval}
                    onCheckedChange={(checked) => handleInputChange('requiresPartnerApproval', checked)}
                  />
                  <Label htmlFor="requiresPartnerApproval">Requires Partner Approval</Label>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresAdminApproval"
                    checked={formData.requiresAdminApproval}
                    onCheckedChange={(checked) => handleInputChange('requiresAdminApproval', checked)}
                  />
                  <Label htmlFor="requiresAdminApproval">Requires Admin Approval</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="autoApproveThreshold">Auto Approve Threshold (ETB) *</Label>
                <Input
                  id="autoApproveThreshold"
                  type="number"
                  value={formData.autoApproveThreshold}
                  onChange={(e) => handleInputChange('autoApproveThreshold', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="minScoreForAutoApprove">Min Score for Auto Approve *</Label>
                <Input
                  id="minScoreForAutoApprove"
                  type="number"
                  value={formData.minScoreForAutoApprove}
                  onChange={(e) => handleInputChange('minScoreForAutoApprove', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="1000"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Risk Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="collateralRequired"
                    checked={formData.collateralRequired}
                    onCheckedChange={(checked) => handleInputChange('collateralRequired', checked)}
                  />
                  <Label htmlFor="collateralRequired">Collateral Required</Label>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="guarantorRequired"
                    checked={formData.guarantorRequired}
                    onCheckedChange={(checked) => handleInputChange('guarantorRequired', checked)}
                  />
                  <Label htmlFor="guarantorRequired">Guarantor Required</Label>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
            <div>
              <Label htmlFor="termsAndConditions">Terms and Conditions *</Label>
              <Textarea
                id="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                placeholder="Enter terms and conditions..."
                rows={4}
                required
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-6">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default LoanProductFormNew;
