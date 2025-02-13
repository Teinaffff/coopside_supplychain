import React, { useState } from "react";
import Loader from "../../../common/Loader";
import { memberStatsData } from "../../../common/data/data";
import { DashboardStats } from "../../pc/components/DashboardStats";
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    <Loader />
  ) : (
    <div className="space-y-4">
      <DashboardStats statsData={memberStatsData} />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        Memeber Dashboard Page
      </div>
    </div>
  );
};

export default Dashboard;
