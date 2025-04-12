// src/pages/Seller/SellerOrders.jsx
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Orders</h1>
          <p className="text-muted-foreground mb-8">You need to be logged in as a seller to access this page</p>
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Login as Seller</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const sellerOrders = getOrdersBySellerId(currentUser.id);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Orders</h1>
        
        {sellerOrders.length > 0 ? (
          <OrderTable orders={sellerOrders} userType="seller" />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-8">You haven't received any orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;