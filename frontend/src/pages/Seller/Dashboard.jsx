// src/pages/Seller/SellerDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import DashboardMetricCard from '../../components/DashboardMetricCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const SellerDashboard = () => {
  const { getBooksBySellerId, getOrdersBySellerId } = useStore();
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Seller Dashboard</h1>
          <p className="text-muted-foreground mb-8">You need to be logged in as a seller to access this page</p>
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Login as Seller</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const sellerBooks = getBooksBySellerId(currentUser.id);
  const sellerOrders = getOrdersBySellerId(currentUser.id);
  
  // Prepare chart data
  const chartData = [
    { name: 'Books', value: sellerBooks.length },
    { name: 'Orders', value: sellerOrders.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          
          <Link to="/add-book">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 sm:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <DashboardMetricCard title="Total Books" value={sellerBooks.length} color="bg-success" />
          <DashboardMetricCard title="Total Orders" value={sellerOrders.length} color="bg-warning" />
        </div>
        
        <Card className="bg-card text-card-foreground p-4 mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground">Overview</h2>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden bg-card text-card-foreground">
            <div className="bg-muted p-4 font-semibold text-foreground">
              Recent Books
            </div>
            <div className="p-4">
              {sellerBooks.length > 0 ? (
                <div className="space-y-3">
                  {sellerBooks.slice(0, 5).map(book => (
                    <div key={book.id} className="flex items-center gap-3">
                      <img 
                        src={book.imageUrl} 
                        alt={book.title} 
                        className="w-12 h-16 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{book.title}</p>
                        <p className="text-sm text-muted-foreground">${book.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No books added yet</p>
              )}
              
              <div className="mt-4">
                <Link to="/manage-books">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    View All Books
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden bg-card text-card-foreground">
            <div className="bg-muted p-4 font-semibold text-foreground">
              Recent Orders
            </div>
            <div className="p-4">
              {sellerOrders.length > 0 ? (
                <div className="space-y-3">
                  {sellerOrders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center gap-3">
                      {order.items.length > 0 && (
                        <img 
                          src={order.items[0].bookImageUrl} 
                          alt={order.items[0].bookTitle} 
                          className="w-12 h-16 object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {order.items.length > 0 
                            ? order.items[0].bookTitle 
                            : 'Unknown Book'}
                          {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                        </p>
                        <p className="text-sm text-muted-foreground">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Order Date: {order.orderDate}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'delivered' 
                            ? 'bg-success/20 text-success' 
                            : order.status === 'ontheway' 
                              ? 'bg-info/20 text-info' 
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No orders received yet</p>
              )}
              
              <div className="mt-4">
                <Link to="/seller-orders">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    View All Orders
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;