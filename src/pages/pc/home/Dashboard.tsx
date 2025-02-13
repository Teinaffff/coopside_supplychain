import React, { useState } from "react";
import {
  pcStatsData,
  recentTransactions,
  topMembers,
} from "../../../common/data/data";
import Loader from "../../../common/Loader";
import MembershipLineChart from "../components/charts/MembershipLineChart";
import ProductBarChart from "../components/charts/ProductBarChart";
import ProfitTrendLineChart from "../components/charts/ProfitTrendLineChart";
import SalesDistributionChart from "../components/charts/SalesDistributionChart";
import { DashboardStats } from "../components/DashboardStats";
import RecentTransactionTable from "../components/tables/RecentTransactionTable";
import TopMembersTable from "../components/tables/TopMembersTable";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    <Loader />
  ) : (
    <div className="space-y-4">
      <DashboardStats statsData={pcStatsData} />

      <div className="grid xl:grid-cols-2 gap-4">
        <ProfitTrendLineChart />
        <MembershipLineChart />
        <ProductBarChart />
        <SalesDistributionChart />
      </div>

      <div className="flex flex-col space-y-4">
        <TopMembersTable data={topMembers} />
        <RecentTransactionTable data={recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
