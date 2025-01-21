import React from "react";
import { Card } from "../../../../common/ui/card";
import { Clock, Eye, XCircle } from "lucide-react";
import { Button } from "../../../../common/ui/button";

const ActiveRequest: React.FC = () => {
  const progress = 70;
  return (
    <Card className="px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Active Request</h2>
        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 pb-2 rounded-full text-sm">
          Under Review
        </span>
      </div>
      <div className="grid grid-cols-3">
        <div className="flex justify-between items-center mb-4 col-span-2">
          <div>
            <p className="text-sm text-gray-500">Request Type</p>
            <p className="text-base font-medium">License Renewal</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Submitted Date</p>
            <p className="text-base font-medium">2025-01-03</p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="relative w-full h-3 bg-gray-200 rounded-md">
          <div
            className="absolute h-full bg-cyan-500 rounded-md"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-1">70%</p>
      </div>
      <div className="flex items-center bg-gray-100 text-gray-500 gap-2 rounded-md px-4 py-2 mb-4">
        <Clock size={18} />
        <span>Additional documentation required</span>
        <span className="font-medium">24-01-03</span>
      </div>
      <div className="flex gap-4">
        <Button
          variant={"ghost"}
          className="px-2 py-2 border rounded-md text-gray-700 gap-1"
        >
          <Eye size={18} />
          View Details
        </Button>
        <Button
          variant={"ghost"}
          className="px-2 py-2  gap-1 border rounded-md text-red-600 border-red-200 hover:text-red-600 hover:bg-red-50"
        >
          <XCircle size={18} />
          Cancel Request
        </Button>
      </div>
    </Card>
  );
};

export default ActiveRequest;
