import React from "react";
import { requirements } from "../../../../common/data/data";
import { CircleCheck, CircleCheckBig, CircleX } from "lucide-react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";

const StartNewRequest: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Start New Request</h2>
      <p className="text-sm text-gray-500 mb-4">
        Please ensure all requirements are met before starting a new request:
      </p>
      <ul className="space-y-2 mb-6">
        {requirements.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span
              className={item.completed ? "text-green-600" : "text-red-600"}
            >
              {item.completed ? (
                <CircleCheckBig size={18} />
              ) : (
                <CircleX size={18} />
              )}
            </span>
            <div className="flex flex-col">
              <span>{item.title}</span>
              <span className="text-gray-500 text-sm">{item.subtitle}</span>
            </div>
          </li>
        ))}
      </ul>
      <Button
        variant={"outline"}
        className="w-full text-white hover:text-white bg-slate-400 hover:bg-slate-500"
        disabled={false}
      >
        Start New Request
      </Button>
    </Card>
  );
};

export default StartNewRequest;
