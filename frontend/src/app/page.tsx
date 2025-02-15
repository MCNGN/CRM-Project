import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';   

// Dummy data
const salesData = [
  { week: 'Week 1', sales: 4000 },
  { week: 'Week 2', sales: 3000 },
  { week: 'Week 3', sales: 5000 },
  { week: 'Week 4', sales: 4500 },
];

const recentSales = [
  { customer: "Olivia Martin", product: "Premium Plan", amount: "$199.00", date: "2024-03-15" },
  { customer: "Jackson Lee", product: "Basic Plan", amount: "$99.00", date: "2024-03-14" },
  { customer: "Isabella Nguyen", product: "Custom Package", amount: "$599.00", date: "2024-03-13" },
];

const stats = [
  { title: "Total Revenue", value: "$45,231", description: "+20.1% from last month" },
  { title: "New Customers", value: "2,345", description: "+180.1% from last month" },
  { title: "Active Users", value: "1,123", description: "+19% from last month" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sales Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardTitle className="mb-4">Sales Overview</CardTitle>
            <div className="h-64">
              {/* <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer> */}
            </div>
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
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{sale.customer}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.amount}</TableCell>
                      <TableCell>{sale.date}</TableCell>
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