import { useState } from "react";
import { Card } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { Settings, Users, Shield } from "lucide-react";
import UserRoleSettings from "../settings/components/UserRoleSettings";

const SystemUserRolesPage = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System User & Roles</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage system users, roles, and permissions for the cooperative management system
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users & Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserRoleSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemUserRolesPage;
