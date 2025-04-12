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
    
    placeOrder(address); // Fix: Use updated signature
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Your Cart</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty</p>
          <Button onClick={() => navigate('/books')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue shopping
        </Button>
        
        <h1 className="text-3xl font-bold mb-8 text-foreground">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="bg-card text-card-foreground rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-foreground">Product</TableHead>
                    <TableHead className="text-foreground">Title</TableHead>
                    <TableHead className="text-foreground">Price</TableHead>
                    <TableHead className="text-foreground">Quantity</TableHead>
                    <TableHead className="text-foreground">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.book._id}> {/* Fix: _id */}
                      <TableCell>
                        <img 
                          src={item.book.imageUrl} 
                          alt={item.book.title} 
                          className="w-16 h-20 object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{item.book.title}</TableCell>
                      <TableCell className="text-muted-foreground">${item.book.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                            onClick={() => updateCartItemQuantity(item.book._id, item.quantity - 1)} // Fix: _id
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-foreground">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                            onClick={() => updateCartItemQuantity(item.book._id, item.quantity + 1)} // Fix: _id
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-foreground">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(item.book._id)} // Fix: _id
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
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
          <div className="w-full lg:w-1/3">
            <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Free</span>
                </div>
              </div>
              <div className="border-t border-muted pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              {!isCheckingOut ? (
                <Button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Shipping Information</h3>
                  <Textarea
                    placeholder="Enter your full address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    required
                    className="w-full bg-background border-input text-foreground"
                  />
                  <Button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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