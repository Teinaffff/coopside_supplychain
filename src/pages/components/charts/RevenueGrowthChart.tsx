import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../common/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const revenueData = [
  { name: "Q1", revenue: 45000, target: 40000 },
  { name: "Q2", revenue: 52000, target: 48000 },
  { name: "Q3", revenue: 48000, target: 50000 },
  { name: "Q4", revenue: 61000, target: 55000 },
];

const RevenueGrowthChart = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value, 10));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>{selectedYear} yearly data.</CardDescription>
          </div>
          <div>
            <Select
              onValueChange={(value) => handleYearChange(value)}
              value={selectedYear.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString() || ""}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : revenueData.length === 0 ? (
          <div className="flex justify-center items-center">
            No data available for the selected year.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={revenueData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                scale={"point"}
                padding={{ left: 30, right: 30 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Actual Revenue" />
              <Bar dataKey="target" fill="#82ca9d" name="Target Revenue" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueGrowthChart;