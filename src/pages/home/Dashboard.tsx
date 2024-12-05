import {
  ArrowDown,
  ArrowUp,
  Ban,
  CheckCheck,
  Loader,
  PlaneTakeoff,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader1 from "../../common/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "../../common/ui/card";
import DefaultLayout from "../../layout/DefaultLayout";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    <Loader1 />
  ) : (
    <DefaultLayout>
      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-[#00A9E8]">
                Registered
              </CardTitle>
              <CheckCheck color="#00A9E8" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00A9E8]">50</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-cyan-500 text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  20%
                </span>
                {"  "}
                <span> from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-[#8080A9]">
                Pending
              </CardTitle>
              <Loader color="#8080A9" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#8080A9]">20</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-[#8080A9] text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  10 %
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-[#DE8224]">
                Cancelled
              </CardTitle>
              <Ban color="#DE8224" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-[#DE8224] font-bold">10</div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-[#DE8224] text-lg flex items-center">
                  <ArrowUp className="w-5 h-5" />
                  5%
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-[#505050] dark:text-slate-200">
                Deleted
              </CardTitle>
              <PlaneTakeoff className="dark:text-slate-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#505050] dark:text-slate-200">
                10
              </div>
              <p className="text-xs text-muted-foreground flex items-center space-x-2">
                <span className="text-lg flex items-center text-[#505050] dark:text-slate-200">
                  <ArrowDown className="w-5 h-5" />
                  5%
                </span>{" "}
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          Dashboard Page
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
