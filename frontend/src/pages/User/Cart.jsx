
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Minus, Plus, Trash, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity, placeOrder } = useStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!currentUser) {
      toast.error('You must be logged in to place an order');
      navigate('/login');
      return;
    }
    
    if (!address) {
      toast.error('Please provide a delivery address');
      return;
    }
    
    placeOrder(currentUser.id, currentUser.name, address);
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Button onClick={() => navigate('/books')} className="bg-bookblue hover:bg-blue-700">
            Browse Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue shopping
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Product</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.book.id}>
                      <TableCell>
                        <img 
                          src={item.book.imageUrl} 
                          alt={item.book.title} 
                          className="w-16 h-20 object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.book.title}</TableCell>
                      <TableCell>${item.book.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateCartItemQuantity(item.book.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateCartItemQuantity(item.book.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(item.book.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              {!isCheckingOut ? (
                <Button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-bookblue hover:bg-blue-700"
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium">Shipping Information</h3>
                  <Textarea
                    placeholder="Enter your full address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    required
                    className="w-full"
                  />
                  
                  <Button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-bookblue hover:bg-blue-700"
                    disabled={!address}
                  >
                    Place Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
