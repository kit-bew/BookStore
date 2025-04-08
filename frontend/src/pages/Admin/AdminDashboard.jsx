import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import DashboardMetricCard from '../../components/DashboardMetricCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const AdminDashboard = () => {
  const { getDashboardStats } = useStore();
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">You need to be logged in as an admin to access this page</p>
          <Link to="/login">
            <Button className="bg-bookblue hover:bg-blue-700">Login as Admin</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = getDashboardStats();

  const chartData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Sellers', value: stats.totalSellers },
    { name: 'Books', value: stats.totalBooks },
    { name: 'Orders', value: stats.totalOrders },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardMetricCard title="Users" value={stats.totalUsers} color="bg-red-500" />
          <DashboardMetricCard title="Sellers" value={stats.totalSellers} color="bg-blue-500" />
          <DashboardMetricCard title="Books" value={stats.totalBooks} color="bg-green-500" />
          <DashboardMetricCard title="Total Orders" value={stats.totalOrders} color="bg-orange-500" />
        </div>

        <Card className="bg-cream-50 p-4">
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0000FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
