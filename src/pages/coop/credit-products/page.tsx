import { useState } from "react";
import { Card } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import { Label } from "../../../common/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../common/ui/select";
import { Button } from "../../../common/ui/button";

const CreditProductManagement = () => {
  const [productName, setProductName] = useState("Consumer Loan");
  const [productCode, setProductCode] = useState("CL001");
  const [loanAmount, setLoanAmount] = useState("ETB 5.000");
  const [loanMinimum, setLoanMinimum] = useState("ETB 5.000");
  const [loanMaximum, setLoanMaximum] = useState("ETB 10.00");
  const [repaymentPeriod, setRepaymentPeriod] = useState("6-months");
  const [installmentFrequency, setInstallmentFrequency] = useState("monthly");
  const [targetSegment, setTargetSegment] = useState("consumers");
  const [minimumRequirements, setMinimumRequirements] = useState("6 months membership");
  const [requiredDocuments, setRequiredDocuments] = useState("ID, proof of membership");
  const [processingFee, setProcessingFee] = useState("1%");
  const [penaltyFees, setPenaltyFees] = useState("ETB 200");
  const [defaultRiskRules, setDefaultRiskRules] = useState("90-days");
  const [termsConditions, setTermsConditions] = useState("consumer-loan");
  const [disbursementMethod, setDisbursementMethod] = useState("wallet");
  const [repaymentChannels, setRepaymentChannels] = useState("salary");

  const handleSubmit = () => {
    const formData = {
      productName,
      productCode,
      loanAmount,
      loanMinimum,
      loanMaximum,
      repaymentPeriod,
      installmentFrequency,
      targetSegment,
      minimumRequirements,
      requiredDocuments,
      processingFee,
      penaltyFees,
      defaultRiskRules,
      termsConditions,
      disbursementMethod,
      repaymentChannels,
    };
    console.log("Form Data:", formData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Define Credit Product</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Basic Product Definition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="product-name">Product Name</Label>
            <Input id="product-name" placeholder="Consumer Loan" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="product-code">Product Code</Label>
            <Input id="product-code" placeholder="CL001" value={productCode} onChange={(e) => setProductCode(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Loan Terms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <Input id="loan-amount" placeholder="ETB 5.000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="loan-minimum">Minimum</Label>
            <Input id="loan-minimum" placeholder="ETB 5.000" value={loanMinimum} onChange={(e) => setLoanMinimum(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="loan-maximum">Maximum</Label>
            <Input id="loan-maximum" placeholder="ETB 10.00" value={loanMaximum} onChange={(e) => setLoanMaximum(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="repayment-period">Repayment Period</Label>
            <Select value={repaymentPeriod} onValueChange={setRepaymentPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="6 months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-months">3 months</SelectItem>
                <SelectItem value="6-months">6 months</SelectItem>
                <SelectItem value="12-months">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="installment-frequency">Installment Frequency</Label>
            <Select value={installmentFrequency} onValueChange={setInstallmentFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Monthly" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Eligibility Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="target-segment">Target Segment</Label>
            <Select value={targetSegment} onValueChange={setTargetSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Consumers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consumers">Consumers</SelectItem>
                <SelectItem value="agents">Agents</SelectItem>
                <SelectItem value="sellers">Sellers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="minimum-requirements">Minimum Requirements</Label>
            <Input id="minimum-requirements" placeholder="6 months membership" value={minimumRequirements} onChange={(e) => setMinimumRequirements(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="required-documents">Required Documents</Label>
            <Input id="required-documents" placeholder="ID, proof of membership" value={requiredDocuments} onChange={(e) => setRequiredDocuments(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Fees & Charges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="processing-fee">Processing Fee</Label>
            <Input id="processing-fee" placeholder="1%" value={processingFee} onChange={(e) => setProcessingFee(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="penalty-fees">Penalty Fees</Label>
            <Input id="penalty-fees" placeholder="ETB 200" value={penaltyFees} onChange={(e) => setPenaltyFees(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Monitoring & Risk</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="default-risk-rules">Default Risk Rules</Label>
            <Select value={defaultRiskRules} onValueChange={setDefaultRiskRules}>
              <SelectTrigger>
                <SelectValue placeholder="Over 90 days overdue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30-days">Over 30 days overdue</SelectItem>
                <SelectItem value="60-days">Over 60 days overdue</SelectItem>
                <SelectItem value="90-days">Over 90 days overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="terms-conditions">T&Cs Template</Label>
            <Select value={termsConditions} onValueChange={setTermsConditions}>
              <SelectTrigger>
                <SelectValue placeholder="Select Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consumer-loan">Consumer Loan T&Cs</SelectItem>
                <SelectItem value="sme-loan">SME Loan T&Cs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Disbursement & Repayment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="disbursement-method">Disbursement Method</Label>
            <Select value={disbursementMethod} onValueChange={setDisbursementMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Direct to cooperative wallet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wallet">Direct to cooperative wallet</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="repayment-channels">Repayment Channels</Label>
            <Select value={repaymentChannels} onValueChange={setRepaymentChannels}>
              <SelectTrigger>
                <SelectValue placeholder="Salary deduction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary deduction</SelectItem>
                <SelectItem value="cash">Cash Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
};

export default CreditProductManagement;
