
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import OrderTable from '../../components/OrderTable';
import { Button } from '@/components/ui/button';

const SellerOrders = () => {
  const { getOrdersBySellerId } = useStore();
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Orders</h1>
          <p className="text-gray-600 mb-8">You need to be logged in as a seller to access this page</p>
          <Link to="/login">
            <Button className="bg-bookblue hover:bg-blue-700">Login as Seller</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const sellerOrders = getOrdersBySellerId(currentUser.id);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>
        
        {sellerOrders.length > 0 ? (
          <OrderTable orders={sellerOrders} userType="seller" />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-8">You haven't received any orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
