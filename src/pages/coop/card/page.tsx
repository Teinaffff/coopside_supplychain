import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { Button } from "../../../common/ui/button";
import { Input } from "../../../common/ui/input";
import toast from "react-hot-toast";
// import { Checkbox } from "../../../common/ui/checkbox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../common/ui/select";
import { Badge } from "../../../common/ui/badge";
import { DataTable } from "../../../common/ui/data-table";
// Dialog components not in use in the current admin design

type Transaction = {
  id: string;
  date: string; // ISO
  merchant: string;
  category: string;
  amount: number;
  status: "posted" | "pending" | "reversed";
};

type Profile = {
  name: string;
  customerId: string;
  email: string;
  phone: string;
  linkedAccounts: number;
};

const profiles: Record<string, Profile> = {
  "Abebe Kebede": {
    name: "Abebe Kebede",
    customerId: "C-10045",
    email: "abebe@example.com",
    phone: "+251-9-000-0000",
    linkedAccounts: 2,
  },
  "Lulit Bekele": {
    name: "Lulit Bekele",
    customerId: "C-10078",
    email: "lulit@example.com",
    phone: "+251-9-111-2222",
    linkedAccounts: 1,
  },
  "Kebede Alemu": {
    name: "Kebede Alemu",
    customerId: "C-10112",
    email: "kebede@example.com",
    phone: "+251-9-333-4444",
    linkedAccounts: 3,
  },
};

const usageByUser: Record<string, Transaction[]> = {
  "Abebe Kebede": [
    { id: "ab-1001", date: "2025-02-01", merchant: "Ethiopian Airlines", category: "Travel", amount: 12500, status: "posted" },
    { id: "ab-1002", date: "2025-02-03", merchant: "Friendship Supermarket", category: "Groceries", amount: 2350, status: "posted" },
    { id: "ab-1003", date: "2025-02-04", merchant: "Uber", category: "Transport", amount: 420, status: "pending" },
  ],
  "Lulit Bekele": [
    { id: "lu-2001", date: "2025-02-02", merchant: "Jumia", category: "Shopping", amount: 2999, status: "reversed" },
    { id: "lu-2002", date: "2025-02-05", merchant: "Safaricom", category: "Utilities", amount: 980, status: "posted" },
  ],
  "Kebede Alemu": [
    { id: "ke-3001", date: "2025-02-06", merchant: "Total", category: "Fuel", amount: 1850, status: "posted" },
  ],
};

const formatETB = (value: number) => new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
}).format(value);

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    posted: { label: "Posted", variant: "default" },
    pending: { label: "Pending", variant: "outline" },
    reversed: { label: "Reversed", variant: "destructive" },
  };
  const v = map[status] ?? { label: status, variant: "outline" };
  return <Badge variant={v.variant}>{v.label}</Badge>;
};

const TxColumns: ColumnDef<Transaction>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "merchant", header: "Merchant" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatETB(row.original.amount),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => statusBadge(row.original.status),
  },
];

type IssuedCard = {
  id: string;
  holderName: string;
  cardNumber: string;
  creditLimit: number;
  issuedDate: string;
  status: "delivered" | "undelivered";
};

const issuedCardsMock: IssuedCard[] = [
  { id: "ic-001", holderName: "Abebe Kebede", cardNumber: "1234 5678 9012 3456", creditLimit: 150000, issuedDate: "2025-02-01", status: "delivered" },
  { id: "ic-002", holderName: "Lulit Bekele", cardNumber: "1234 2222 3333 4444", creditLimit: 80000, issuedDate: "2025-02-03", status: "undelivered" },
  { id: "ic-003", holderName: "Kebede Alemu", cardNumber: "5678 9999 1111 2222", creditLimit: 200000, issuedDate: "2025-02-05", status: "delivered" },
];

const issuanceColumns: ColumnDef<IssuedCard>[] = [
  { accessorKey: "holderName", header: "Holder" },
  { accessorKey: "cardNumber", header: "Card Number" },
  { accessorKey: "creditLimit", header: "Limit (ETB)", cell: ({ row }) => formatETB(row.original.creditLimit) },
  { accessorKey: "issuedDate", header: "Issued" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={row.original.status === "delivered" ? "default" : "outline"}>{row.original.status}</Badge> },
];

const CardManagementPage: React.FC = () => {
  // Manual override toggles removed in current design
  // Removed alerts and categories for simplified analytics per new admin spec
  const [profileSearch, setProfileSearch] = useState("Abebe Kebede");
  const currentProfile: Profile | undefined = profiles[profileSearch] ?? undefined;
  const currentTransactions: Transaction[] = usageByUser[profileSearch] ?? [];
  // KYC validation state
  const [kycRef, setKycRef] = useState("");
  const [isKycValidated, setIsKycValidated] = useState(false);
  
  const handleValidateKyc = () => {
    if (!kycRef.trim()) {
      toast.error("Please enter KYC Reference");
      return;
    }
    // Mock validation logic – treat references starting with "KYC" as valid
    if (kycRef.trim().toUpperCase().startsWith("KYC")) {
      toast.success("KYC validated successfully");
      setIsKycValidated(true);
    } else {
      toast.error("KYC reference not found");
      setIsKycValidated(false);
    }
  };
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Credit Card Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="issuance">
            <TabsList>
              <TabsTrigger value="issuance">Card Issuance</TabsTrigger>
              <TabsTrigger value="controls">Card Replacement and Security</TabsTrigger>
              <TabsTrigger value="profile">Unified Profile</TabsTrigger>
              {/* <TabsTrigger value="limits">Limits & Billing</TabsTrigger> */}
            </TabsList>
            <TabsContent value="issuance">
              <div className="space-y-4 mt-2">
                <Card>
                  <CardHeader><CardTitle>Issue New Credit Card</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input placeholder="Full Name" />
                      <Input placeholder="National ID" />
                      <Input placeholder="Phone" />
                      <Input placeholder="Email (optional)" />
                      <Input placeholder="Address" />
                      <Input type="number" placeholder="Credit Limit (ETB)" />
                      <Input placeholder="Expiry (MM/YY)" />
                      <Input placeholder="KYC Reference" value={kycRef} onChange={(e) => setKycRef(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {/* <Button variant="secondary" onClick={handleValidateKyc} disabled={isKycValidated}>
                        {isKycValidated ? "KYC Validated" : "Validate KYC"}
                      </Button> */}
                      <Button className="bg-cyan-600 hover:bg-cyan-700">Issue Card</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Issued Cards</CardTitle></CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="delivered">Delivered</TabsTrigger>
                        <TabsTrigger value="undelivered">Undelivered</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <DataTable columns={issuanceColumns} data={issuedCardsMock} searchKey="holderName" searchPlaceholder="search holder" />
                      </TabsContent>
                      <TabsContent value="delivered">
                        <DataTable columns={issuanceColumns} data={issuedCardsMock.filter(c=>c.status==="delivered")} searchKey="holderName" searchPlaceholder="search holder" />
                      </TabsContent>
                      <TabsContent value="undelivered">
                        <DataTable columns={issuanceColumns} data={issuedCardsMock.filter(c=>c.status==="undelivered")} searchKey="holderName" searchPlaceholder="search holder" />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="controls">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                
                
                <Card>
                  <CardHeader>
                    <CardTitle>Replacement Processing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input placeholder="Reason (lost, damaged, expired)" />
                   
                    <div className="flex items-center justify-end"><Button>Order Replacement</Button></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Credentials</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Input placeholder="Customer Name" />
                    <div className="flex items-center justify-end gap-2">
                      
                      <Button>Reset Password</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
               
               
               
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <Card className="md:col-span-1">
                  <CardHeader><CardTitle>Customer Profile</CardTitle></CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <Input
                      placeholder="Search customer name (e.g., Abebe Kebede)"
                      value={profileSearch}
                      onChange={(e) => setProfileSearch(e.target.value)}
                      className="mb-2"
                    />
                    <div>Name: {currentProfile?.name ?? "—"}</div>
                    <div>Customer ID: {currentProfile?.customerId ?? "—"}</div>
                    <div>Email: {currentProfile?.email ?? "—"}</div>
                    <div>Phone: {currentProfile?.phone ?? "—"}</div>
                    <div>Linked Accounts: {currentProfile?.linkedAccounts ?? 0}</div>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>Cards & History</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded bg-muted text-sm">Primary Card • Status: Active • Limit: ETB 150,000 • Authorized Users: 1</div>
                    <div className="p-3 rounded bg-muted text-sm">Authorized Card • Status: Locked • Limit: ETB 20,000</div>
                    <div>
                      <div className="font-medium mb-2">Interaction History</div>
                      <div className="grid gap-2 text-sm">
                        <div>2025-02-06 • Chat • PIN reset request</div>
                        <div>2025-02-04 • Call • Limit inquiry</div>
                        <div>2025-02-01 • Secure Message • Dispute opened</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="md:col-span-3">
                  <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
                  <CardContent>
                    <DataTable columns={TxColumns} data={currentTransactions} searchKey="merchant" searchPlaceholder="search merchant" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="production">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <Card>
                  <CardHeader><CardTitle>New Applications</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Input placeholder="Applicant Name" />
                    <Input placeholder="National ID" />
                    <div className="flex items-center justify-end"><Button>Submit to Underwriting</Button></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Card Production</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>Order #5231 • Printed • In Transit</div>
                    <div>Order #5177 • Reissued • Delivered</div>
                    <div>Order #5140 • Replacement • Pending</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Shipments</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>AWB 779220 • DHL • ETA 2025-02-10</div>
                    <div>AWB 779112 • EMS • Delivered</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="limits">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <Card>
                  <CardHeader><CardTitle>Adjust Limits</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Input type="number" placeholder="New Credit Limit (ETB)" />
                    <Input type="number" placeholder="Cash Advance Limit (ETB)" />
                    <div className="flex items-center justify-end"><Button>Apply</Button></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Statement Generation</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Input placeholder="Cycle (YYYY-MM)" />
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary">Preview</Button>
                      <Button>Generate</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Billing Corrections</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Input placeholder="Correction Notes" />
                    <div className="flex items-center justify-end"><Button>Post Correction</Button></div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

           

            <TabsContent value="waivers">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
               
              </div>
            </TabsContent>

          

            <TabsContent value="security">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                
               
                
              </div>
            </TabsContent>

            <TabsContent value="servicing">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Statements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="secondary">View Latest Statement</Button>
                    <Button>Download PDF</Button>
                  </CardContent>
                </Card>
             
                <Card>
                  <CardHeader>
                    <CardTitle>Rewards & Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-3 rounded bg-muted">Points: 12,480</div>
                    <div className="p-3 rounded bg-muted">Tier: Silver</div>
                    <Button>Redeem</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="support">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Secure Messaging</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input placeholder="Subject" />
                    <Input placeholder="Message" />
                    <Button>Send</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>FAQs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>• How do I lock my card?</div>
                    <div>• How do I dispute a transaction?</div>
                    <div>• How do I change my PIN?</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <div>Phone: +251-11-000-0000</div>
                    <div>Email: support@example.com</div>
                    <div>Hours: 24/7</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardManagementPage;


