"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Sale {
  customer: string;
  product: string;
  amount: string;
  date: string;
}

interface Stat {
  title: string;
  value: string;
  description: string;
}

interface Segment {
  segment: string;
  count: string;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Dashboard() {
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [customerLifetimeValue, setCustomerLifetimeValue] = useState();
  const [customerSegments, setCustomerSegments] = useState<Segment[]>([]);
  const [salesData, setSalesData] = useState();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("https://crm-backend.rafifaz.com/api/data");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setRecentSales(data.recentSales);
          setStats(data.stats);
          setCustomerLifetimeValue(data.customerLifetimeValue);
          setCustomerSegments(data.customerSegments);
          setSalesData(data.salesData);
        } else {
          console.error("Failed to fetch sales data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSalesData();
  }, []);

  
  return (
    <div className="w-full p-8">
      <div className="h-full">
        <h1 className="text-3xl font-bold mb-8">Sales Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <CardTitle className="mb-4">Sales Overview</CardTitle>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={salesData}
                  margin={{
                    top: 40,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 20)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="sales" fill="var(--color-mobile)" radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value: number) => formatNumber(Number(value))}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {sale.customer}
                      </TableCell>
                      <TableCell>{sale.amount}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Customer Lifetime Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {customerLifetimeValue}
              </div>
              <p className="text-xs text-muted-foreground">
                Total value generated by customers over their lifetime.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Customer Segmentation</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerSegments.map((segment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {segment.segment}
                      </TableCell>
                      <TableCell>{segment.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
