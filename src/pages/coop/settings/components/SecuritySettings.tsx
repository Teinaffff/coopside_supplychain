import { useState } from "react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { Checkbox } from "../../../../common/ui/checkbox";
import { Textarea } from "../../../../common/ui/textarea";
import { Shield, Key, Lock, Eye, AlertTriangle } from "lucide-react";

const SecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState({
    // Password Policy
    passwordMinLength: 8,
    passwordMaxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordHistoryCount: 5,
    passwordExpiryDays: 90,
    passwordExpiryWarningDays: 7,
    
    // Account Lockout
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    lockoutResetTime: 15, // minutes
    
    // Session Management
    sessionTimeout: 30, // minutes
    maxConcurrentSessions: 3,
    requireReauthForSensitive: true,
    
    // Two-Factor Authentication
    enable2FA: false,
    require2FAForAdmins: true,
    backupCodesCount: 10,
    
    // IP Restrictions
    enableIPWhitelist: false,
    allowedIPs: [],
    enableIPBlacklist: false,
    blockedIPs: [],
    
    // API Security
    enableAPIRateLimit: true,
    apiRateLimitPerMinute: 60,
    enableAPILogging: true,
    requireAPIKey: true,
    
    // Data Encryption
    enableDataEncryption: true,
    encryptionAlgorithm: "AES-256",
    enableFieldLevelEncryption: false,
    
    // Audit & Monitoring
    enableAuditLog: true,
    auditLogRetentionDays: 365,
    enableSecurityAlerts: true,
    alertEmail: "",
    
    // Compliance
    enableGDPRCompliance: false,
    enableDataAnonymization: false,
    dataRetentionPeriod: 2555, // days (7 years)
    
    // Advanced Security
    enableHoneypot: false,
    enableBruteForceProtection: true,
    enableSuspiciousActivityDetection: true,
    enableGeolocationTracking: false
  });

  const [newIP, setNewIP] = useState("");
  const [newBlockedIP, setNewBlockedIP] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: 'allowedIPs' | 'blockedIPs', value: string) => {
    if (value.trim()) {
      setSecuritySettings(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      if (field === 'allowedIPs') setNewIP("");
      if (field === 'blockedIPs') setNewBlockedIP("");
    }
  };

  const handleArrayRemove = (field: 'allowedIPs' | 'blockedIPs', index: number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log("Saving security settings:", securitySettings);
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Security Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure security policies and access controls</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Save Security Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Policy */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Password Policy</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passwordMinLength">Minimum Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => handleInputChange('passwordMinLength', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="passwordMaxLength">Maximum Length</Label>
                <Input
                  id="passwordMaxLength"
                  type="number"
                  value={securitySettings.passwordMaxLength}
                  onChange={(e) => handleInputChange('passwordMaxLength', Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireUppercase"
                  checked={securitySettings.requireUppercase}
                  onCheckedChange={(checked) => handleInputChange('requireUppercase', checked)}
                />
                <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireLowercase"
                  checked={securitySettings.requireLowercase}
                  onCheckedChange={(checked) => handleInputChange('requireLowercase', checked)}
                />
                <Label htmlFor="requireLowercase">Require Lowercase Letters</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireNumbers"
                  checked={securitySettings.requireNumbers}
                  onCheckedChange={(checked) => handleInputChange('requireNumbers', checked)}
                />
                <Label htmlFor="requireNumbers">Require Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireSpecialChars"
                  checked={securitySettings.requireSpecialChars}
                  onCheckedChange={(checked) => handleInputChange('requireSpecialChars', checked)}
                />
                <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passwordHistoryCount">Password History Count</Label>
                <Input
                  id="passwordHistoryCount"
                  type="number"
                  value={securitySettings.passwordHistoryCount}
                  onChange={(e) => handleInputChange('passwordHistoryCount', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="passwordExpiryDays">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiryDays"
                  type="number"
                  value={securitySettings.passwordExpiryDays}
                  onChange={(e) => handleInputChange('passwordExpiryDays', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Account Lockout */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold">Account Lockout</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={securitySettings.lockoutDuration}
                onChange={(e) => handleInputChange('lockoutDuration', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="lockoutResetTime">Lockout Reset Time (minutes)</Label>
              <Input
                id="lockoutResetTime"
                type="number"
                value={securitySettings.lockoutResetTime}
                onChange={(e) => handleInputChange('lockoutResetTime', Number(e.target.value))}
              />
            </div>
          </div>
        </Card>

        {/* Session Management */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Session Management</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="maxConcurrentSessions">Max Concurrent Sessions</Label>
              <Input
                id="maxConcurrentSessions"
                type="number"
                value={securitySettings.maxConcurrentSessions}
                onChange={(e) => handleInputChange('maxConcurrentSessions', Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireReauthForSensitive"
                checked={securitySettings.requireReauthForSensitive}
                onCheckedChange={(checked) => handleInputChange('requireReauthForSensitive', checked)}
              />
              <Label htmlFor="requireReauthForSensitive">Require Re-authentication for Sensitive Operations</Label>
            </div>
          </div>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable2FA"
                checked={securitySettings.enable2FA}
                onCheckedChange={(checked) => handleInputChange('enable2FA', checked)}
              />
              <Label htmlFor="enable2FA">Enable Two-Factor Authentication</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="require2FAForAdmins"
                checked={securitySettings.require2FAForAdmins}
                onCheckedChange={(checked) => handleInputChange('require2FAForAdmins', checked)}
              />
              <Label htmlFor="require2FAForAdmins">Require 2FA for Administrators</Label>
            </div>
            <div>
              <Label htmlFor="backupCodesCount">Number of Backup Codes</Label>
              <Input
                id="backupCodesCount"
                type="number"
                value={securitySettings.backupCodesCount}
                onChange={(e) => handleInputChange('backupCodesCount', Number(e.target.value))}
              />
            </div>
          </div>
        </Card>

        {/* IP Restrictions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold">IP Restrictions</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableIPWhitelist"
                checked={securitySettings.enableIPWhitelist}
                onCheckedChange={(checked) => handleInputChange('enableIPWhitelist', checked)}
              />
              <Label htmlFor="enableIPWhitelist">Enable IP Whitelist</Label>
            </div>
            
            {securitySettings.enableIPWhitelist && (
              <div>
                <Label>Allowed IP Addresses</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                    placeholder="Enter IP address (e.g., 192.168.1.1)"
                  />
                  <Button
                    type="button"
                    onClick={() => handleArrayAdd('allowedIPs', newIP)}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-1">
                  {securitySettings.allowedIPs.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      <span className="text-sm">{ip}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArrayRemove('allowedIPs', index)}
                        className="p-0 h-auto text-red-600"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableIPBlacklist"
                checked={securitySettings.enableIPBlacklist}
                onCheckedChange={(checked) => handleInputChange('enableIPBlacklist', checked)}
              />
              <Label htmlFor="enableIPBlacklist">Enable IP Blacklist</Label>
            </div>

            {securitySettings.enableIPBlacklist && (
              <div>
                <Label>Blocked IP Addresses</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newBlockedIP}
                    onChange={(e) => setNewBlockedIP(e.target.value)}
                    placeholder="Enter IP address to block"
                  />
                  <Button
                    type="button"
                    onClick={() => handleArrayAdd('blockedIPs', newBlockedIP)}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-1">
                  {securitySettings.blockedIPs.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      <span className="text-sm">{ip}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArrayRemove('blockedIPs', index)}
                        className="p-0 h-auto text-red-600"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* API Security */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API Security</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableAPIRateLimit"
                checked={securitySettings.enableAPIRateLimit}
                onCheckedChange={(checked) => handleInputChange('enableAPIRateLimit', checked)}
              />
              <Label htmlFor="enableAPIRateLimit">Enable API Rate Limiting</Label>
            </div>
            <div>
              <Label htmlFor="apiRateLimitPerMinute">API Rate Limit (requests/minute)</Label>
              <Input
                id="apiRateLimitPerMinute"
                type="number"
                value={securitySettings.apiRateLimitPerMinute}
                onChange={(e) => handleInputChange('apiRateLimitPerMinute', Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableAPILogging"
                checked={securitySettings.enableAPILogging}
                onCheckedChange={(checked) => handleInputChange('enableAPILogging', checked)}
              />
              <Label htmlFor="enableAPILogging">Enable API Logging</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireAPIKey"
                checked={securitySettings.requireAPIKey}
                onCheckedChange={(checked) => handleInputChange('requireAPIKey', checked)}
              />
              <Label htmlFor="requireAPIKey">Require API Key for All Requests</Label>
            </div>
          </div>
        </Card>

        {/* Audit & Monitoring */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audit & Monitoring</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableAuditLog"
                checked={securitySettings.enableAuditLog}
                onCheckedChange={(checked) => handleInputChange('enableAuditLog', checked)}
              />
              <Label htmlFor="enableAuditLog">Enable Audit Logging</Label>
            </div>
            <div>
              <Label htmlFor="auditLogRetentionDays">Audit Log Retention (days)</Label>
              <Input
                id="auditLogRetentionDays"
                type="number"
                value={securitySettings.auditLogRetentionDays}
                onChange={(e) => handleInputChange('auditLogRetentionDays', Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableSecurityAlerts"
                checked={securitySettings.enableSecurityAlerts}
                onCheckedChange={(checked) => handleInputChange('enableSecurityAlerts', checked)}
              />
              <Label htmlFor="enableSecurityAlerts">Enable Security Alerts</Label>
            </div>
            <div>
              <Label htmlFor="alertEmail">Security Alert Email</Label>
              <Input
                id="alertEmail"
                type="email"
                value={securitySettings.alertEmail}
                onChange={(e) => handleInputChange('alertEmail', e.target.value)}
                placeholder="security@example.com"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;
