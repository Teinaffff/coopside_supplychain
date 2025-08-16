import { useState } from "react";
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

const agentData = [
  { name: "Product A", orders: 1245, revenue: 85000 },
  { name: "Product B", orders: 1132, revenue: 72000 },
  { name: "Product C", orders: 998, revenue: 68000 },
  { name: "Product D", orders: 887, revenue: 55000 },
  { name: "Product E", orders: 776, revenue: 42000 },
];

const AgentPerformanceChart = () => {
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
            <CardTitle>Top Selling Products</CardTitle>
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
        ) : agentData.length === 0 ? (
          <div className="flex justify-center items-center">
            No data available for the selected year.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={agentData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                scale={"point"}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8884d8" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentPerformanceChart;
