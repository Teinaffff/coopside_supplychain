import { Clock, Eye, XCircle } from "lucide-react";
import React from "react";
import { Button } from "../../../../common/ui/button";
import { Card } from "../../../../common/ui/card";

// New reusable component for displaying request details
const RequestDetail: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="mb-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
);

// New reusable component for displaying progress
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="mb-4">
    <div className="relative w-full h-3 bg-gray-200 rounded-md dark:bg-gray-700">
      <div
        className="absolute h-full bg-cyan-500 rounded-md dark:bg-cyan-400"
        style={{ width: progress + '%' }}
      ></div>
    </div>
    <p className="text-right text-sm text-gray-500 mt-1">{progress}%</p>
  </div>
);

const ActiveRequest: React.FC = () => {
  const progress = 70;
  return (
    <Card className="px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Active Request</h2>
        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 pb-2 rounded-full text-sm dark:bg-cyan-900 dark:text-cyan-100">
          Under Review
        </span>
      </div>
      <div className="grid grid-cols-3">
        <div className="flex justify-between items-center mb-4 col-span-2">
          <RequestDetail label="Request Type" value="License Renewal" />
          <RequestDetail label="Submitted Date" value="2025-01-03" />
        </div>
      </div>
      <ProgressBar progress={progress} />
      <div className="flex items-center bg-gray-100 text-gray-500 gap-2 rounded-md px-4 py-2 mb-4 dark:bg-gray-800 dark:text-gray-200">
        <Clock size={18} />
        <span>Additional documentation required</span>
        <span className="font-medium">24-01-03</span>
      </div>
      <div className="flex gap-4">
        <Button
          variant={"ghost"}
          className="px-2 py-2 border rounded-md text-gray-700 gap-1 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <Eye size={18} />
          View Details
        </Button>
        <Button
          variant={"ghost"}
          className="px-2 py-2 gap-1 border rounded-md text-red-600 border-red-200 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-300"
        >
          <XCircle size={18} />
          Cancel Request
        </Button>
      </div>
    </Card>
  );
};

export default ActiveRequest;
