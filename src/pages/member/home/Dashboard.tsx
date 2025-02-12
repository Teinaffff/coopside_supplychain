import {
  ArrowDown,
  ArrowUp,
  CalendarCheck,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import React, { useState } from "react";
import Loader from "../../../common/Loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../common/ui/card";
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-lg font-medium text-emerald-600">
                Completed
              </CardTitle>
              <div className="p-3 bg-emerald-100 rounded-full my-0">
                <CheckCircle className="text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">50</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-emerald-600 text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  20%
                </span>
                {"  "}
                <span> from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0  py-3">
              <CardTitle className="text-lg font-medium text-orange-500">
                Pending
              </CardTitle>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">20</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-orange-500 text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  10 %
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-red-500">
                Cancelled
              </CardTitle>
              <div className="p-3 bg-red-100 rounded-full">
                <X className="text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-red-500 font-bold">10</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-red-500 text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  5%
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-cyan-500 dark:text-slate-200">
                Booked
              </CardTitle>
              <div className="p-3 bg-cyan-100 rounded-full">
                <CalendarCheck className="text-cyan-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-500 dark:text-slate-200">
                10
              </div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-lg flex items-center text-cyan-500 dark:text-slate-200">
                  <ArrowDown className="w-5 h-5" />
                  5%
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          Union Dashboard Page
        </div>
      </div>
    </>
  );
};

export default Dashboard;
