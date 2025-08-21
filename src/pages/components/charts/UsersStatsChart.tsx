import React, { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

const entityData = [
  { name: "Jan", agents: 45, institutions: 12, sellers: 78, consumers: 234 },
  { name: "Feb", agents: 52, institutions: 15, sellers: 85, consumers: 267 },
  { name: "Mar", agents: 58, institutions: 18, sellers: 92, consumers: 298 },
  { name: "Apr", agents: 61, institutions: 20, sellers: 89, consumers: 312 },
  { name: "May", agents: 67, institutions: 23, sellers: 96, consumers: 345 },
  { name: "Jun", agents: 73, institutions: 25, sellers: 103, consumers: 378 },
];

const EntityStatsChart: React.FC = () => {
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
            <CardTitle>Entity Statistics</CardTitle>
            <CardDescription>{selectedYear} entity growth and activity data.</CardDescription>
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
      <CardContent className="pl-2">
        {loading ? (
          <div>Loading...</div>
        ) : entityData.length === 0 ? (
          <div className="flex justify-center items-center">
            No data available for the selected year.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={entityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="agents"
                name="Agents"
                stroke="#00aeef"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="institutions"
                name="Institutions"
                stroke="#f97316"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sellers"
                name="Sellers"
                stroke="#a855f7"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="consumers"
                name="Consumers"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityStatsChart;