import React, { useState } from 'react';
import { Card } from '../../../../common/ui/card';
import { Button } from '../../../../common/ui/button';
import { debugAuthToken, fixAuthToken } from '../../../../lib/debug-auth';
import { checkAuthStatus } from '../../../../lib/auth-utils';

const AuthDebugPage = () => {
  const [debugResult, setDebugResult] = useState<any>(null);
  const [fixResult, setFixResult] = useState<any>(null);

  const handleDebug = () => {
    const result = debugAuthToken();
    setDebugResult(result);
    console.log('Debug result:', result);
  };

  const handleFix = () => {
    const result = fixAuthToken();
    setFixResult(result);
    console.log('Fix result:', result);
    
    // Re-debug after fix
    setTimeout(() => {
      const newDebugResult = debugAuthToken();
      setDebugResult(newDebugResult);
    }, 100);
  };

  const handleCheckAuth = () => {
    const authStatus = checkAuthStatus();
    console.log('Auth status:', authStatus);
    alert(`Auth Status:\nAccess Token: ${authStatus.hasAccessToken}\nRefresh Token: ${authStatus.hasRefreshToken}`);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Authentication Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Debug Actions</h2>
          <div className="space-y-2">
            <Button onClick={handleCheckAuth} className="w-full">
              Check Auth Status
            </Button>
            <Button onClick={handleDebug} variant="outline" className="w-full">
              Debug Token
            </Button>
            <Button onClick={handleFix} variant="outline" className="w-full">
              Fix Token
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Debug Results</h2>
          <div className="space-y-4">
            {debugResult && (
              <div>
                <h3 className="font-medium">Token Debug:</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                  {JSON.stringify(debugResult, null, 2)}
                </pre>
              </div>
            )}
            
            {fixResult && (
              <div>
                <h3 className="font-medium">Token Fix:</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                  {JSON.stringify(fixResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Instructions</h2>
        <div className="text-sm space-y-2">
          <p>1. Click "Check Auth Status" to see current authentication state</p>
          <p>2. Click "Debug Token" to analyze the current token format</p>
          <p>3. Click "Fix Token" to create a new valid token if needed</p>
          <p>4. Check the browser console for detailed logs</p>
        </div>
      </Card>
    </div>
  );
};

export default AuthDebugPage;
