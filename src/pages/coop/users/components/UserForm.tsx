import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import { Button } from "../../../../common/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { Switch } from "../../../../common/ui/switch"; // Assuming a Switch component for toggle
import { generatePassword } from "../../../../lib/utils"; // Assuming a utility to generate passwords

type UserRole = "Agent" | "Institution" | "Factory" | "Consumer" | "Admin";
type UserPortal = "Coop" | "Partner";
type UserStatus = "Active" | "Inactive";

interface UserFormProps {
  initialData?: {
    id?: string;
    username: string;
    email: string;
    phone: string;
    role: UserRole;
    portal: UserPortal;
    status: UserStatus;
  };
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [username, setUsername] = useState(initialData?.username || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [role, setRole] = useState<UserRole>(initialData?.role || "Consumer");
  const [portal, setPortal] = useState<UserPortal>(initialData?.portal || "Consumer");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<UserStatus>(initialData?.status || "Active");

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setRole(initialData.role);
      setPortal(initialData.portal);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleGeneratePassword = () => {
    setPassword(generatePassword());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      username,
      email,
      phone,
      role,
      portal,
      password: initialData?.id ? undefined : password, // Don't send password on edit unless changed
      status,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit User" : "Create New User"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Institution">Institution</SelectItem>
                  <SelectItem value="Factory">Factory</SelectItem>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="portal">Portal</Label>
              <Select value={portal} onValueChange={setPortal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Portal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coop">Coop</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!initialData?.id && ( // Only show password field for new user creation
              <div className="col-span-full">
                <Label htmlFor="password">Password</Label>
                <div className="flex space-x-2">
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!initialData?.id} />
                  <Button type="button" variant="outline" onClick={handleGeneratePassword}>Generate</Button>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2 col-span-full">
              <Switch id="status-toggle" checked={status === "Active"} onCheckedChange={(checked) => setStatus(checked ? "Active" : "Inactive")} />
              <Label htmlFor="status-toggle">Status: {status}</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{initialData ? "Update User" : "Create User"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;

