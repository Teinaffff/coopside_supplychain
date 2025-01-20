import React, { useEffect, useMemo, useState } from "react";
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
} from "../../../../common/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const filteredData = [
  {
    name: "Jan",
    lastYear: 4000,
    thisYear: 2400,
  },
  {
    name: "Feb",
    lastYear: 3000,
    thisYear: 1398,
  },
  {
    name: "Mar",
    lastYear: 2000,
    thisYear: 9800,
  },
  {
    name: "Apr",
    lastYear: 2780,
    thisYear: 3908,
  },
  {
    name: "May",
    lastYear: 1890,
    thisYear: 4800,
  },
  {
    name: "Jun",
    lastYear: 2390,
    thisYear: 3800,
  },
  {
    name: "Jul",
    lastYear: 3490,
    thisYear: 4300,
  },
  {
    name: "Aug",
    lastYear: 2000,
    thisYear: 9800,
  },
  {
    name: "Sep",
    lastYear: 2780,
    thisYear: 3908,
  },
  {
    name: "Oct",
    lastYear: 1890,
    thisYear: 4800,
  },
  {
    name: "Nov",
    lastYear: 2390,
    thisYear: 3800,
  },
  {
    name: "Dec",
    lastYear: 3490,
    thisYear: 4300,
  },
];

const ProfitTrendLineChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState<boolean>(false);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     await dispatch(fetchLineGraphsData(selectedYear) as any);
  //     setLoading(false);
  //   };
  //   loadData();
  // }, [dispatch, selectedYear]);

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value, 10));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profit Trends</CardTitle>
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
      <CardContent className="pl-2">
        {loading ? (
          <div>Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="flex justify-center items-center">
            No data available for the selected year.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="thisYear"
                name="Current Year"
                stroke="#39e662"
              />
              <Line
                type="monotone"
                dataKey="lastYear"
                name="Last Year"
                stroke="#ffa500"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitTrendLineChart;
