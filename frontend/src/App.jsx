
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import BooksList from "./pages/Books/BooksList";
import BookDetails from "./pages/Books/BookDetails";
import Cart from "./pages/User/Cart";
import Wishlist from "./pages/User/Wishlist";
import Orders from "./pages/User/Orders";
import Dashboard from "./pages/Seller/Dashboard";
import SellerOrders from "./pages/Seller/SellerOrders";
import ManageBooks from "./pages/Seller/ManageBooks";
import AddBook from "./pages/Seller/AddBook";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<BooksList />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/seller-orders" element={<SellerOrders />} />
              <Route path="/manage-books" element={<ManageBooks />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StoreProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
