import React from "react";
import { StatCardProps } from "../../constants/interface/general";
import StatCard from "./StatCard";

type Props = {
  statsData: StatCardProps[];
};

export const DashboardStats: React.FC<Props> = ({ statsData }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard key={stat.title} index={index} {...stat} />
      ))}
    </div>
  );
};
