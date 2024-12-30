import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building,
  CreditCard,
  TrendingUp,
  Calendar,
  MessageSquare,
  AlertCircle,
  Activity,
  Package,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { useAuth } from "../../../hooks/useAuth";

const DashboardContent = () => {

  const { user } = useAuth();

  console.log(user);

  const stats = [
    {
      label: "Total Users",
      value: "2,543",
      icon: Users,
      trend: "+12.5%",
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Active Rooms",
      value: "185",
      icon: Building,
      trend: "+5.2%",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Revenue",
      value: "$12,543",
      icon: CreditCard,
      trend: "+18.7%",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Growth",
      value: "23.5%",
      icon: TrendingUp,
      trend: "+2.4%",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const chartData = [
    { name: "Jan", value: 400, orders: 240, visitors: 1200 },
    { name: "Feb", value: 300, orders: 139, visitors: 1000 },
    { name: "Mar", value: 600, orders: 380, visitors: 1600 },
    { name: "Apr", value: 800, orders: 430, visitors: 1800 },
    { name: "May", value: 700, orders: 350, visitors: 1700 },
    { name: "Jun", value: 900, orders: 470, visitors: 2100 },
  ];

  const pieData = [
    { name: "Desktop", value: 400, color: "#FF6B6B" },
    { name: "Mobile", value: 300, color: "#4ECDC4" },
    { name: "Tablet", value: 200, color: "#45B7D1" },
    { name: "Smart TV", value: 100, color: "#FFA07A" },
    { name: "Others", value: 50, color: "#98D8C8" },
  ];

  const radarData = [
    { subject: "Performance", A: 120, B: 110, fullMark: 150 },
    { subject: "Reliability", A: 98, B: 130, fullMark: 150 },
    { subject: "Usability", A: 86, B: 130, fullMark: 150 },
    { subject: "Security", A: 99, B: 100, fullMark: 150 },
    { subject: "Functionality", A: 85, B: 90, fullMark: 150 },
    { subject: "Support", A: 65, B: 85, fullMark: 150 },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "New user registration",
      time: "2 minutes ago",
      icon: Users,
      color: "text-blue-500 bg-blue-100",
    },
    {
      id: 2,
      title: "New order received",
      time: "1 hour ago",
      icon: ShoppingCart,
      color: "text-green-500 bg-green-100",
    },
    {
      id: 3,
      title: "Server alert",
      time: "3 hours ago",
      icon: AlertCircle,
      color: "text-red-500 bg-red-100",
    },
  ];

  const tableData = [
    {
      id: 1,
      product: "Premium Plan",
      amount: "$99.00",
      status: "Completed",
      date: "2024-01-15",
      change: "+5.2%",
      trend: "up",
    },
    {
      id: 2,
      product: "Basic Plan",
      amount: "$29.00",
      status: "Pending",
      date: "2024-01-14",
      change: "-2.1%",
      trend: "down",
    },
    {
      id: 3,
      product: "Enterprise Plan",
      amount: "$299.00",
      status: "Completed",
      date: "2024-01-13",
      change: "+12.5%",
      trend: "up",
    },
  ];

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`Value ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* // display user name saying welcome back */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back {user.fullName}!
        </h2>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
                <span className="text-sm text-green-500">{stat.trend}</span>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Revenue Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FF6B6B"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Device Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity and Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-3"
              >
                <div className={`p-2 rounded-full ${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Change</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tableData.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">{item.product}</td>
                    <td>{item.amount}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="flex items-center">
                      <span
                        className={
                          item.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {item.trend === "up" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )}
                      </span>
                      <span
                        className={`ml-1 ${
                          item.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Performance Metrics
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid gridType="circular" />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar
                name="Product A"
                dataKey="A"
                stroke="#FF6B6B"
                fill="#FF6B6B"
                fillOpacity={0.6}
              />
              <Radar
                name="Product B"
                dataKey="B"
                stroke="#4ECDC4"
                fill="#4ECDC4"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardContent;
