import { useState } from "react";
import { Card } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { Settings, CreditCard, FileText } from "lucide-react";
import LoanProductManagement from "../settings/components/LoanProductManagement";
import TermsTemplates from "../settings/components/TermsTemplates";

const LoanSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("loan-products");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure loan products and terms for the loan monitoring system
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="loan-products" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Loan Products
          </TabsTrigger>
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Terms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loan-products">
          <LoanProductManagement />
        </TabsContent>

        <TabsContent value="terms">
          <TermsTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanSettingsPage;
