import React, { useState } from "react";
import Loader from "../../../common/Loader";
import { memberStatsData, recentTransactions } from "../../../common/data/data";
import { DashboardStats } from "../../components/DashboardStats";
import ProfitTrendLineChart from "../../components/charts/ProfitTrendLineChart";
import MembershipLineChart from "../../components/charts/MembershipLineChart";
import ProductBarChart from "../../components/charts/ProductBarChart";
import SalesDistributionChart from "../../components/charts/SalesDistributionChart";
import RecentTransactionTable from "../../components/tables/RecentTransactionTable";

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
