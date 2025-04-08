
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
          <p className="text-gray-600 mb-8">You need to be logged in as a seller to access this page</p>
          <Link to="/login">
            <Button className="bg-bookblue hover:bg-blue-700">Login as Seller</Button>
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <Link to="/add-book">
            <Button className="bg-bookblue hover:bg-blue-700 mt-4 sm:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <DashboardMetricCard title="Total Books" value={sellerBooks.length} color="bg-green-500" />
          <DashboardMetricCard title="Total Orders" value={sellerOrders.length} color="bg-orange-500" />
        </div>
        
        <Card className="bg-cream-50 p-4 mb-8">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <div className="bg-gray-100 p-4 font-semibold">
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
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-gray-500">${book.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No books added yet</p>
              )}
              
              <div className="mt-4">
                <Link to="/manage-books">
                  <Button variant="outline" size="sm">
                    View All Books
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="bg-gray-100 p-4 font-semibold">
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
                        <p className="font-medium">
                          {order.items.length > 0 
                            ? order.items[0].bookTitle 
                            : 'Unknown Book'}
                          {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                        </p>
                        <p className="text-sm text-gray-500">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'ontheway' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No orders received yet</p>
              )}
              
              <div className="mt-4">
                <Link to="/seller-orders">
                  <Button variant="outline" size="sm">
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
