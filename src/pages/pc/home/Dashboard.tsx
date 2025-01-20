import {
  ArrowDown,
  ArrowUp,
  Coins,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import Loader from "../../../common/Loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../common/ui/card";
import ProfitTrendLineChart from "../components/charts/ProfitTrendLineChart";
import MembershipLineChart from "../components/charts/MembershipLineChart";
import ProductBarChart from "../components/charts/ProductBarChart";
import SalesDistributionChart from "../components/charts/SalesDistributionChart";
import TopMembersTable from "../components/tables/TopMembersTable";
import { topMembers } from "../../../common/data/data";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-lg font-medium text-emerald-600">
                Members
              </CardTitle>
              <div className="p-3 bg-emerald-100 rounded-full my-0">
                <Users className="text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">50</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-emerald-600 text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  20%
                </span>
                {"  "}
                <span> from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0  py-3">
              <CardTitle className="text-lg font-medium text-orange-500">
                Savings
              </CardTitle>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">20</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-orange-500 text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  10 %
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-lg font-medium text-purple-500">
                Shares
              </CardTitle>
              <div className="p-3 bg-purple-100 rounded-full">
                <Coins className="text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-purple-500 font-bold">10</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-purple-500 text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  5%
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-lg font-medium text-cyan-500 dark:text-slate-200">
                Profits
              </CardTitle>
              <div className="p-3 bg-cyan-100 rounded-full">
                <TrendingUp className="text-cyan-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-500 dark:text-slate-200">
                10
              </div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-lg flex items-center text-cyan-500 dark:text-slate-200">
                  <ArrowDown className="w-5 h-5" />
                  5%
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid xl:grid-cols-2 gap-4">
          <ProfitTrendLineChart />
          <MembershipLineChart />
          <ProductBarChart />
          <SalesDistributionChart />
        </div>
        <div>
          <TopMembersTable data={topMembers} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
