import React, { useState } from "react";
import Loader from "../../../common/Loader";
import { memberStatsData, recentTransactions } from "../../../common/data/data";
import { DashboardStats } from "../../pc/components/DashboardStats";
import ProfitTrendLineChart from "../../pc/components/charts/ProfitTrendLineChart";
import MembershipLineChart from "../../pc/components/charts/MembershipLineChart";
import ProductBarChart from "../../pc/components/charts/ProductBarChart";
import SalesDistributionChart from "../../pc/components/charts/SalesDistributionChart";
import RecentTransactionTable from "../../pc/components/tables/RecentTransactionTable";
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    <Loader />
  ) : (
    <div className="space-y-4">
      <DashboardStats statsData={memberStatsData} />

      <div className="grid xl:grid-cols-2 gap-4">
        <ProfitTrendLineChart />
        <MembershipLineChart />
        <ProductBarChart />
        <SalesDistributionChart />
      </div>

      <div className="flex flex-col space-y-4">
        {/* <TopMembersTable data={topMembers} /> */}
        <RecentTransactionTable data={recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
