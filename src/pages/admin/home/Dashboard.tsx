import React from "react";
import Loader from "../../../common/Loader";
import { recentTransactions } from "../../../common/data/data";
import { DashboardStats } from "../../components/DashboardStats";
import TodayActivityCard from "../../components/cards/TodayActivityCard";
import EntityDistributionChart from "../../components/charts/EntityDistributionChart";
import TopSellingChart from "../../components/charts/TopSellingChart";
import UsersStatsChart from "../../components/charts/UsersStatsChart";
import RecentTransactionTable from "../../components/tables/RecentTransactionTable";
import { useHomeStats } from "../hooks/use-home";

const Dashboard: React.FC = () => {
  const { kpi, isLoading } = useHomeStats({ enabled: true });

  return isLoading ? (
    <Loader />
  ) : (
    <div className="space-y-6">
      {/* Stats Cards */}
      <DashboardStats statsData={kpi} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - Charts Grid */}
        <div className="col-span-9 space-y-6">
          <UsersStatsChart />
          <div className="grid grid-cols-2 gap-4">
            <EntityDistributionChart />
            <TopSellingChart />
          </div>
        </div>

        {/* Right Side - Larger Height Card */}
        <div className="col-span-3">
          <TodayActivityCard />
        </div>
      </div>

      {/* Latest Transactions Table */}
      <div className="space-y-4">
        <RecentTransactionTable data={recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
