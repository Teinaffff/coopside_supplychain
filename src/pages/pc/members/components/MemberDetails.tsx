import React from "react";
import MemberCard from "./MemberCard";
import MemberSharesTable from "./MemberSharesTable";
import { memberSharesData } from "../../../../common/data/data";

const MemberDetails = () => {
  const memberData = {
    name: "John Doe",
    email: "john.doe@example.com",
    memberId: "1234",
    investment: 1500,
    totalShares: 15,
    totalProfit: 500,
  };

  return (
    <div className="flex flex-col space-y-4">
      <MemberCard member={memberData} />
      <MemberSharesTable data={memberSharesData} />
    </div>
  );
};

export default MemberDetails;
