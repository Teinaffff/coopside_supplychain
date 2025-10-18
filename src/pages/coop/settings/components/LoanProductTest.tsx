import { useState } from 'react';
import { Button } from '../../../../common/ui/button';
import { Card } from '../../../../common/ui/card';
import loanProductService from '../../../../services/loanProductService';
import { checkAuthStatus, clearAuthTokens } from '../../../../lib/auth-utils';
import { setMockAuth, setMockAuthWithUUID, setMockAuthWithLongId, fixExistingToken } from '../../../../lib/mock-auth';

const LoanProductTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGetAllLoanTypes = async () => {
    setIsLoading(true);
    try {
      addResult('Testing GET /v1/loan-types...');
      const response = await loanProductService.getAllLoanTypes();
      addResult(`✅ Success: Found ${response.data?.length || 0} loan types`);
      console.log('Get all loan types response:', response);
    } catch (error: any) {
      addResult(`❌ Error: ${error?.message || 'Unknown error'}`);
      console.error('Get all loan types error:', error);
    }
    setIsLoading(false);
  };

  const testCreateLoanType = async () => {
    setIsLoading(true);
    try {
      addResult('Testing POST /v1/loan-types...');
      const testData = {
        code: 'TEST_PRODUCT_' + Date.now(),
        name: 'Test Product',
        description: 'This is a test product',
        defaultInterestRate: 12.5,
        minInterestRate: 10.0,
        maxInterestRate: 18.0,
        defaultRepaymentPeriodMonths: 6,
        minRepaymentPeriodMonths: 1,
        maxRepaymentPeriodMonths: 12,
        minLoanAmount: 10000,
        maxLoanAmount: 500000,
        processingFeeType: 'PERCENTAGE' as const,
        processingFeeValue: 2.5,
        minProcessingFee: 500,
        maxProcessingFee: 10000,
        latePaymentPenaltyRate: 2.0,
        prepaymentAllowed: true,
        prepaymentPenaltyRate: 1.0,
        collateralRequired: false,
        guarantorRequired: true,
        minCreditScore: 650,
        requiredDocuments: JSON.stringify(['ID', 'Proof of Income']),
        requiresPartnerApproval: true,
        requiresAdminApproval: false,
        autoApproveThreshold: 50000,
        minScoreForAutoApprove: 750,
        displayOrder: 1,
        additionalSettings: null,
        termsAndConditions: 'Test terms and conditions'
      };
      
      const response = await loanProductService.createLoanType(testData);
      addResult(`✅ Success: Created loan type with ID ${response.data?.id}`);
      console.log('Create loan type response:', response);
    } catch (error: any) {
      addResult(`❌ Error: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
      console.error('Create loan type error:', error);
      console.error('Error response:', error?.response?.data);
    }
    setIsLoading(false);
  };

  const testGetActiveLoanTypes = async () => {
    setIsLoading(true);
    try {
      addResult('Testing GET /v1/loan-types/active...');
      const response = await loanProductService.getActiveLoanTypes();
      addResult(`✅ Success: Found ${response.data?.length || 0} active loan types`);
      console.log('Get active loan types response:', response);
    } catch (error: any) {
      addResult(`❌ Error: ${error?.message || 'Unknown error'}`);
      console.error('Get active loan types error:', error);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const checkAuth = () => {
    addResult('Checking authentication status...');
    const authStatus = checkAuthStatus();
    addResult(`Auth Status: Access Token: ${authStatus.hasAccessToken ? '✅' : '❌'}, Refresh Token: ${authStatus.hasRefreshToken ? '✅' : '❌'}`);
  };

  const clearAuth = () => {
    clearAuthTokens();
    addResult('Auth tokens cleared. Please log in again.');
  };

  const setMockAuthToken = () => {
    setMockAuth("1");
    addResult('Mock authentication token set for user ID: 1');
  };

  const setMockAuthUUID = () => {
    setMockAuthWithUUID();
    addResult('Mock authentication token set with UUID format');
  };

  const setMockAuthLongId = () => {
    setMockAuthWithLongId();
    addResult('Mock authentication token set with long ID format');
  };

  const fixToken = () => {
    const result = fixExistingToken();
    if (result) {
      addResult('Fixed existing token with numeric user ID format');
    } else {
      addResult('No existing token to fix or error occurred');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">API Test Panel</h3>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button 
          onClick={testGetAllLoanTypes} 
          disabled={isLoading}
          variant="outline"
        >
          Test Get All
        </Button>
        <Button 
          onClick={testCreateLoanType} 
          disabled={isLoading}
          variant="outline"
        >
          Test Create
        </Button>
        <Button 
          onClick={testGetActiveLoanTypes} 
          disabled={isLoading}
          variant="outline"
        >
          Test Get Active
        </Button>
        <Button 
          onClick={checkAuth} 
          variant="outline"
        >
          Check Auth
        </Button>
        <Button 
          onClick={clearAuth} 
          variant="outline"
        >
          Clear Auth
        </Button>
        <Button 
          onClick={setMockAuthToken} 
          variant="outline"
        >
          Set Mock Auth
        </Button>
        <Button 
          onClick={setMockAuthUUID} 
          variant="outline"
        >
          Set UUID Auth
        </Button>
        <Button 
          onClick={setMockAuthLongId} 
          variant="outline"
        >
          Set Long ID Auth
        </Button>
        <Button 
          onClick={fixToken} 
          variant="outline"
        >
          Fix Token
        </Button>
        <Button 
          onClick={clearResults} 
          variant="outline"
        >
          Clear Results
        </Button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
        <h4 className="font-medium mb-2">Test Results:</h4>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click a test button above.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default LoanProductTest;
