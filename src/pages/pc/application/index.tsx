import React from "react";
import ActiveRequest from "./components/ActiveRequest";
import RequestHistoryTable from "./components/RequestHistoryTable";
import StartNewRequest from "./components/StartNewRequest";
import { requestHistoryData } from "../../../common/data/data";
import { CircleAlert } from "lucide-react";
import { Card } from "../../../common/ui/card";

const ApplicationPage = () => {
  return (
    <Card className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-1 space-y-6">
        <div className="flex space-x-2 items-center bg-yellow-50 text-yellow-800  px-4 py-2 rounded-md border border-l-2 border-l-yellow-500 dark:bg-slate-800 dark:border-l-slate-500">
          <CircleAlert size={18} />
          <p>
            Your license expires on <strong>Feb 28, 2025</strong>. Submit
            renewal by <strong>Jan 30, 2025</strong>.
          </p>
        </div>
        <ActiveRequest />
        <RequestHistoryTable data={requestHistoryData} />
      </div>

      <div className="w-full md:w-1/3">
        <StartNewRequest />
      </div>
    </Card>
  );
};

export default ApplicationPage;
