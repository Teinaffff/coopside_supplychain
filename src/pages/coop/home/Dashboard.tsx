import React, { useMemo, useState } from "react";
import Loader from "../../../common/Loader";
import {
  memberStatsData,
  requestsMockData,
} from "../../../common/data/data";
import { DashboardStats } from "../../components/DashboardStats";
import MembershipLineChart from "../../components/charts/MembershipLineChart";
import RevenueGrowthChart from "../../components/charts/RevenueGrowthChart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../common/ui/table";
import { Badge } from "../../../common/ui/badge";
import { Button } from "../../../common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../common/ui/dialog";
import { Input } from "../../../common/ui/input";
import { Label } from "../../../common/ui/label";

const Dashboard: React.FC = () => {
  const [loading] = useState<boolean>(false);

  const recentApps = useMemo(() => requestsMockData.slice(0, 3), []);

  return loading ? (
    <Loader />
  ) : (
    <div className="space-y-4">
      <DashboardStats statsData={memberStatsData as any} />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" className="text-cyan-600">View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApps.map((r) => (
                  <TableRow key={r.requestId}>
                    <TableCell className="font-medium">{r.requestedBy}</TableCell>
                    <TableCell>{new Date(r.requestedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">—</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          r.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : r.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : r.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                        variant="outline"
                      >
                        {r.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle>Membership Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <MembershipLineChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueGrowthChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle>Card Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-80 overflow-hidden rounded-2xl p-5 text-white shadow-xl">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
              <div className="pointer-events-none absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 20px 20px, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
              <div className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{backgroundImage:"linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)"}} />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-xs tracking-widest opacity-80">VIRTUAL CARD</div>
                  <div className="mt-2 h-7 w-10 rounded-sm bg-gradient-to-br from-yellow-200 via-amber-300 to-amber-500 shadow-inner" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tracking-wider opacity-90">COOP BANK</div>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] tracking-wider">CONTACTLESS</div>
                </div>
              </div>

              <div className="relative mt-10 select-none text-2xl tracking-[0.35em]">
                1234 5678 1234 5679
              </div>

              <div className="relative mt-6 grid grid-cols-3 text-xs">
                <div className="opacity-80">
                  <div className="uppercase tracking-wider opacity-70">Card Holder</div>
                  <div className="mt-1 text-sm">Melaku Tesfaye</div>
                </div>
                <div className="opacity-80">
                  <div className="uppercase tracking-wider opacity-70">Expiry</div>
                  <div className="mt-1 text-sm">08/28</div>
                </div>
                <div className="flex items-end justify-end">
                  <div className="h-8 w-12 rounded bg-white/20 backdrop-blur-sm" />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/20" />
            </div>
            <div className="mt-4 flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">Issue Card</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[520px]">
                  <DialogHeader>
                    <DialogTitle>Issue New Card</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="holder" className="text-right">Card holder</Label>
                      <Input id="holder" className="col-span-3" placeholder="Full name" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="limit" className="text-right">Credit limit</Label>
                      <Input id="limit" className="col-span-3" placeholder="ETB 10,000" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expiry" className="text-right">Expiry</Label>
                      <Input id="expiry" className="col-span-3" placeholder="MM/YY" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">Issue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Revoke Card</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Revoke Existing Card</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cardno" className="text-right">Card number</Label>
                      <Input id="cardno" className="col-span-3" placeholder="1234 5678 1234 5679" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">Reason</Label>
                      <Input id="reason" className="col-span-3" placeholder="Lost, Stolen, Compromised..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="destructive">Revoke</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
