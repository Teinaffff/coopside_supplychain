import { useState } from "react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { Checkbox } from "../../../../common/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../common/ui/tabs";
import { DollarSign, Percent, Calculator, CreditCard } from "lucide-react";

const FeeSettings = () => {
  const [feeSettings, setFeeSettings] = useState({
    // Processing Fees
    processingFeeType: "percentage",
    processingFeeValue: 2.5,
    processingFeeMin: 50,
    processingFeeMax: 5000,
    
    // Late Payment Fees
    latePaymentFeeType: "fixed",
    latePaymentFeeValue: 200,
    latePaymentFeePercentage: 2,
    latePaymentGracePeriod: 3, // days
    
    // Early Repayment Fees
    earlyRepaymentFeeType: "percentage",
    earlyRepaymentFeeValue: 1,
    earlyRepaymentFeeMin: 100,
    earlyRepaymentFeeMax: 2000,
    
    // Disbursement Fees
    disbursementFeeType: "fixed",
    disbursementFeeValue: 25,
    disbursementFeePercentage: 0.5,
    
    // Service Fees
    serviceFeeType: "fixed",
    serviceFeeValue: 100,
    serviceFeeFrequency: "monthly",
    
    // Insurance Fees
    insuranceFeeType: "percentage",
    insuranceFeeValue: 0.5,
    insuranceFeeMin: 50,
    insuranceFeeMax: 1000,
    
    // Penalty Fees
    penaltyFeeType: "percentage",
    penaltyFeeValue: 5,
    penaltyFeeMin: 100,
    penaltyFeeMax: 5000,
    
    // Overdraft Fees
    overdraftFeeType: "fixed",
    overdraftFeeValue: 50,
    overdraftFeeDaily: true,
    
    // Currency Settings
    defaultCurrency: "ETB",
    supportedCurrencies: ["ETB", "USD"],
    
    // Fee Calculation
    feeCalculationMethod: "simple",
    compoundFrequency: "monthly",
    roundingMethod: "round",
    
    // Fee Waivers
    allowFeeWaivers: true,
    maxWaiverPercentage: 50,
    requireApprovalForWaivers: true,
    
    // Fee Notifications
    notifyBeforeFee: true,
    feeNotificationDays: 7,
    enableFeeReminders: true,
    reminderFrequency: "weekly"
  });

  const handleInputChange = (field: string, value: any) => {
    setFeeSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving fee settings:", feeSettings);
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Fee Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure fees, charges, and payment policies</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Save Fee Settings
        </Button>
      </div>

      <Tabs defaultValue="processing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processing">Processing Fees</TabsTrigger>
          <TabsTrigger value="penalties">Penalties</TabsTrigger>
          <TabsTrigger value="services">Service Fees</TabsTrigger>
          <TabsTrigger value="calculation">Calculation</TabsTrigger>
        </TabsList>

        {/* Processing Fees */}
        <TabsContent value="processing" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Processing Fees</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="processingFeeType">Fee Type</Label>
                <Select value={feeSettings.processingFeeType} onValueChange={(value) => handleInputChange('processingFeeType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="processingFeeValue">Fee Value</Label>
                <Input
                  id="processingFeeValue"
                  type="number"
                  step="0.01"
                  value={feeSettings.processingFeeValue}
                  onChange={(e) => handleInputChange('processingFeeValue', Number(e.target.value))}
                  placeholder="2.5"
                />
              </div>
              <div>
                <Label htmlFor="processingFeeMin">Minimum Fee</Label>
                <Input
                  id="processingFeeMin"
                  type="number"
                  value={feeSettings.processingFeeMin}
                  onChange={(e) => handleInputChange('processingFeeMin', Number(e.target.value))}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="processingFeeMax">Maximum Fee</Label>
                <Input
                  id="processingFeeMax"
                  type="number"
                  value={feeSettings.processingFeeMax}
                  onChange={(e) => handleInputChange('processingFeeMax', Number(e.target.value))}
                  placeholder="5000"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Disbursement Fees</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="disbursementFeeType">Fee Type</Label>
                <Select value={feeSettings.disbursementFeeType} onValueChange={(value) => handleInputChange('disbursementFeeType', value)}>
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
                <Label htmlFor="disbursementFeeValue">Fee Value</Label>
                <Input
                  id="disbursementFeeValue"
                  type="number"
                  step="0.01"
                  value={feeSettings.disbursementFeeValue}
                  onChange={(e) => handleInputChange('disbursementFeeValue', Number(e.target.value))}
                  placeholder="25"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Penalties */}
        <TabsContent value="penalties" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold">Late Payment Fees</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latePaymentFeeType">Fee Type</Label>
                <Select value={feeSettings.latePaymentFeeType} onValueChange={(value) => handleInputChange('latePaymentFeeType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="latePaymentFeeValue">Fixed Fee Value</Label>
                <Input
                  id="latePaymentFeeValue"
                  type="number"
                  value={feeSettings.latePaymentFeeValue}
                  onChange={(e) => handleInputChange('latePaymentFeeValue', Number(e.target.value))}
                  placeholder="200"
                />
              </div>
              <div>
                <Label htmlFor="latePaymentFeePercentage">Percentage Fee</Label>
                <Input
                  id="latePaymentFeePercentage"
                  type="number"
                  step="0.01"
                  value={feeSettings.latePaymentFeePercentage}
                  onChange={(e) => handleInputChange('latePaymentFeePercentage', Number(e.target.value))}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="latePaymentGracePeriod">Grace Period (days)</Label>
                <Input
                  id="latePaymentGracePeriod"
                  type="number"
                  value={feeSettings.latePaymentGracePeriod}
                  onChange={(e) => handleInputChange('latePaymentGracePeriod', Number(e.target.value))}
                  placeholder="3"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Early Repayment Fees</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="earlyRepaymentFeeType">Fee Type</Label>
                <Select value={feeSettings.earlyRepaymentFeeType} onValueChange={(value) => handleInputChange('earlyRepaymentFeeType', value)}>
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
                <Label htmlFor="earlyRepaymentFeeValue">Fee Value</Label>
                <Input
                  id="earlyRepaymentFeeValue"
                  type="number"
                  step="0.01"
                  value={feeSettings.earlyRepaymentFeeValue}
                  onChange={(e) => handleInputChange('earlyRepaymentFeeValue', Number(e.target.value))}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="earlyRepaymentFeeMin">Minimum Fee</Label>
                <Input
                  id="earlyRepaymentFeeMin"
                  type="number"
                  value={feeSettings.earlyRepaymentFeeMin}
                  onChange={(e) => handleInputChange('earlyRepaymentFeeMin', Number(e.target.value))}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="earlyRepaymentFeeMax">Maximum Fee</Label>
                <Input
                  id="earlyRepaymentFeeMax"
                  type="number"
                  value={feeSettings.earlyRepaymentFeeMax}
                  onChange={(e) => handleInputChange('earlyRepaymentFeeMax', Number(e.target.value))}
                  placeholder="2000"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Penalty Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="penaltyFeeType">Penalty Fee Type</Label>
                <Select value={feeSettings.penaltyFeeType} onValueChange={(value) => handleInputChange('penaltyFeeType', value)}>
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
                <Label htmlFor="penaltyFeeValue">Penalty Fee Value</Label>
                <Input
                  id="penaltyFeeValue"
                  type="number"
                  step="0.01"
                  value={feeSettings.penaltyFeeValue}
                  onChange={(e) => handleInputChange('penaltyFeeValue', Number(e.target.value))}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="penaltyFeeMin">Minimum Penalty</Label>
                <Input
                  id="penaltyFeeMin"
                  type="number"
                  value={feeSettings.penaltyFeeMin}
                  onChange={(e) => handleInputChange('penaltyFeeMin', Number(e.target.value))}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="penaltyFeeMax">Maximum Penalty</Label>
                <Input
                  id="penaltyFeeMax"
                  type="number"
                  value={feeSettings.penaltyFeeMax}
                  onChange={(e) => handleInputChange('penaltyFeeMax', Number(e.target.value))}
                  placeholder="5000"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Service Fees */}
        <TabsContent value="services" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Service Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceFeeType">Service Fee Type</Label>
                <Select value={feeSettings.serviceFeeType} onValueChange={(value) => handleInputChange('serviceFeeType', value)}>
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
                <Label htmlFor="serviceFeeValue">Service Fee Value</Label>
                <Input
                  id="serviceFeeValue"
                  type="number"
                  step="0.01"
                  value={feeSettings.serviceFeeValue}
                  onChange={(e) => handleInputChange('serviceFeeValue', Number(e.target.value))}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="serviceFeeFrequency">Service Fee Frequency</Label>
                <Select value={feeSettings.serviceFeeFrequency} onValueChange={(value) => handleInputChange('serviceFeeFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One Time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Insurance Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insuranceFeeType">Insurance Fee Type</Label>
                <Select value={feeSettings.insuranceFeeType} onValueChange={(value) => handleInputChange('insuranceFeeType', value)}>
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
                <Label htmlFor="insuranceFeeValue">Insurance Fee Value</Label>
                <Input
                  id="insuranceFeeValue"
                  type="number"
                  step="0.01"
                  value={feeSettings.insuranceFeeValue}
                  onChange={(e) => handleInputChange('insuranceFeeValue', Number(e.target.value))}
                  placeholder="0.5"
                />
              </div>
              <div>
                <Label htmlFor="insuranceFeeMin">Minimum Insurance Fee</Label>
                <Input
                  id="insuranceFeeMin"
                  type="number"
                  value={feeSettings.insuranceFeeMin}
                  onChange={(e) => handleInputChange('insuranceFeeMin', Number(e.target.value))}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="insuranceFeeMax">Maximum Insurance Fee</Label>
                <Input
                  id="insuranceFeeMax"
                  type="number"
                  value={feeSettings.insuranceFeeMax}
                  onChange={(e) => handleInputChange('insuranceFeeMax', Number(e.target.value))}
                  placeholder="1000"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Overdraft Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="overdraftFeeType">Overdraft Fee Type</Label>
                <Select value={feeSettings.overdraftFeeType} onValueChange={(value) => handleInputChange('overdraftFeeType', value)}>
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
                <Label htmlFor="overdraftFeeValue">Overdraft Fee Value</Label>
                <Input
                  id="overdraftFeeValue"
                  type="number"
                  step="0.01"
                  value={feeSettings.overdraftFeeValue}
                  onChange={(e) => handleInputChange('overdraftFeeValue', Number(e.target.value))}
                  placeholder="50"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overdraftFeeDaily"
                  checked={feeSettings.overdraftFeeDaily}
                  onCheckedChange={(checked) => handleInputChange('overdraftFeeDaily', checked)}
                />
                <Label htmlFor="overdraftFeeDaily">Apply Daily</Label>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Calculation Settings */}
        <TabsContent value="calculation" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Calculation Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="feeCalculationMethod">Calculation Method</Label>
                <Select value={feeSettings.feeCalculationMethod} onValueChange={(value) => handleInputChange('feeCalculationMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="compound">Compound</SelectItem>
                    <SelectItem value="reducing_balance">Reducing Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="compoundFrequency">Compound Frequency</Label>
                <Select value={feeSettings.compoundFrequency} onValueChange={(value) => handleInputChange('compoundFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roundingMethod">Rounding Method</Label>
                <Select value={feeSettings.roundingMethod} onValueChange={(value) => handleInputChange('roundingMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="ceil">Ceiling</SelectItem>
                    <SelectItem value="floor">Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select value={feeSettings.defaultCurrency} onValueChange={(value) => handleInputChange('defaultCurrency', value)}>
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
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Waivers</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowFeeWaivers"
                  checked={feeSettings.allowFeeWaivers}
                  onCheckedChange={(checked) => handleInputChange('allowFeeWaivers', checked)}
                />
                <Label htmlFor="allowFeeWaivers">Allow Fee Waivers</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxWaiverPercentage">Maximum Waiver Percentage</Label>
                  <Input
                    id="maxWaiverPercentage"
                    type="number"
                    value={feeSettings.maxWaiverPercentage}
                    onChange={(e) => handleInputChange('maxWaiverPercentage', Number(e.target.value))}
                    placeholder="50"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requireApprovalForWaivers"
                    checked={feeSettings.requireApprovalForWaivers}
                    onCheckedChange={(checked) => handleInputChange('requireApprovalForWaivers', checked)}
                  />
                  <Label htmlFor="requireApprovalForWaivers">Require Approval for Waivers</Label>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifyBeforeFee"
                  checked={feeSettings.notifyBeforeFee}
                  onCheckedChange={(checked) => handleInputChange('notifyBeforeFee', checked)}
                />
                <Label htmlFor="notifyBeforeFee">Notify Before Fee Application</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feeNotificationDays">Notification Days Before</Label>
                  <Input
                    id="feeNotificationDays"
                    type="number"
                    value={feeSettings.feeNotificationDays}
                    onChange={(e) => handleInputChange('feeNotificationDays', Number(e.target.value))}
                    placeholder="7"
                  />
                </div>
                <div>
                  <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
                  <Select value={feeSettings.reminderFrequency} onValueChange={(value) => handleInputChange('reminderFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableFeeReminders"
                  checked={feeSettings.enableFeeReminders}
                  onCheckedChange={(checked) => handleInputChange('enableFeeReminders', checked)}
                />
                <Label htmlFor="enableFeeReminders">Enable Fee Reminders</Label>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeeSettings;
