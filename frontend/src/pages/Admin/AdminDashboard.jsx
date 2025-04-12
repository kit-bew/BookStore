import React, { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBooks: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const fetchStats = async () => {
        const data = await getDashboardStats();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalSellers: data.totalSellers || 0,
          totalBooks: data.totalBooks || 0,
          totalOrders: data.totalOrders || 0,
        });
      };
      fetchStats();
    }
  }, [currentUser, getDashboardStats]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">You need to be logged in as an admin to access this page</p>
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Login as Admin</Button>
          </Link>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Sellers', value: stats.totalSellers },
    { name: 'Books', value: stats.totalBooks },
    { name: 'Orders', value: stats.totalOrders },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardMetricCard title="Users" value={stats.totalUsers} color="bg-destructive" />
          <DashboardMetricCard title="Sellers" value={stats.totalSellers} color="bg-primary" />
          <DashboardMetricCard title="Books" value={stats.totalBooks} color="bg-success" />
          <DashboardMetricCard title="Total Orders" value={stats.totalOrders} color="bg-warning" />
        </div>
        <Card className="bg-card text-card-foreground p-4">
          <h2 className="text-xl font-bold mb-4 text-foreground">Statistics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    color: 'hsl(var(--card-foreground))', 
                    border: '1px solid hsl(var(--border))' 
                  }} 
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;