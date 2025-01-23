import React from "react";
import ActiveRequest from "./components/ActiveRequest";
import RequestHistoryTable from "./components/RequestHistoryTable";
import StartNewRequest from "./components/StartNewRequest";
import { requestHistoryData } from "../../../common/data/data";
import { CircleAlert } from "lucide-react";

const ApplicationPage = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex-1 space-y-6">
        <div className="flex space-x-2 items-center bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md border border-l-2 border-l-yellow-500">
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
    </div>
  );
};

export default ApplicationPage;
