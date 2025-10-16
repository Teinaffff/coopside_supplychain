import { useState } from "react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { Checkbox } from "../../../../common/ui/checkbox";
import { Textarea } from "../../../../common/ui/textarea";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    systemName: "CoopSide Supply Chain",
    systemVersion: "1.0.0",
    defaultCurrency: "ETB",
    timezone: "Africa/Addis_Ababa",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    language: "en",
    maxFileSize: 10,
    allowedFileTypes: ["pdf", "jpg", "png", "doc", "docx"],
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requirePasswordComplexity: true,
    enableTwoFactor: false,
    enableAuditLog: true,
    enableNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    maintenanceMessage: "System is under maintenance. Please try again later.",
    apiRateLimit: 1000,
    backupFrequency: "daily",
    dataRetentionDays: 365,
    enableAnalytics: true,
    enableErrorReporting: true
  });

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving system settings:", settings);
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">System Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure general system preferences and behavior</p>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) => handleInputChange('systemName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="systemVersion">System Version</Label>
              <Input
                id="systemVersion"
                value={settings.systemVersion}
                onChange={(e) => handleInputChange('systemVersion', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Select value={settings.defaultCurrency} onValueChange={(value) => handleInputChange('defaultCurrency', value)}>
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
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Addis_Ababa">Africa/Addis_Ababa</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select value={settings.dateFormat} onValueChange={(value) => handleInputChange('dateFormat', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select value={settings.timeFormat} onValueChange={(value) => handleInputChange('timeFormat', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour</SelectItem>
                    <SelectItem value="24h">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="passwordMinLength">Password Min Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => handleInputChange('passwordMinLength', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requirePasswordComplexity"
                  checked={settings.requirePasswordComplexity}
                  onCheckedChange={(checked) => handleInputChange('requirePasswordComplexity', checked)}
                />
                <Label htmlFor="requirePasswordComplexity">Require Password Complexity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableTwoFactor"
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => handleInputChange('enableTwoFactor', checked)}
                />
                <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableAuditLog"
                  checked={settings.enableAuditLog}
                  onCheckedChange={(checked) => handleInputChange('enableAuditLog', checked)}
                />
                <Label htmlFor="enableAuditLog">Enable Audit Logging</Label>
              </div>
            </div>
          </div>
        </Card>

        {/* File Upload Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">File Upload Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleInputChange('maxFileSize', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes.join(", ")}
                onChange={(e) => handleInputChange('allowedFileTypes', e.target.value.split(", "))}
                placeholder="pdf, jpg, png, doc, docx"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
              />
              <Label htmlFor="enableNotifications">Enable Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
              <Label htmlFor="emailNotifications">Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
              />
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
            </div>
          </div>
        </Card>

        {/* Maintenance Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Maintenance Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            </div>
            <div>
              <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
              <Textarea
                id="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* API Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
              <Input
                id="apiRateLimit"
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => handleInputChange('apiRateLimit', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dataRetentionDays">Data Retention (days)</Label>
              <Input
                id="dataRetentionDays"
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => handleInputChange('dataRetentionDays', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableAnalytics"
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
                />
                <Label htmlFor="enableAnalytics">Enable Analytics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableErrorReporting"
                  checked={settings.enableErrorReporting}
                  onCheckedChange={(checked) => handleInputChange('enableErrorReporting', checked)}
                />
                <Label htmlFor="enableErrorReporting">Enable Error Reporting</Label>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;
