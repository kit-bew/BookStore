import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext
import { ShoppingCart, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { toggleTheme } = useContext(ThemeContext); // Use ThemeContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold">
          BookEase
          {currentUser?.role === "admin" && (
            <span className="ml-2">(Admin)</span>
          )}
          {currentUser?.role === "seller" && (
            <span className="ml-2">(Seller)</span>
          )}
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-secondary transition-colors">
            Home
          </Link>

          {!currentUser ? (
            <>
              <Link
                to="/login"
                className="hover:text-secondary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-secondary transition-colors"
              >
                Register
              </Link>
            </>
          ) : currentUser.role === "user" ? (
            <>
              <Link
                to="/books"
                className="hover:text-secondary transition-colors"
              >
                Books
              </Link>
              <Link
                to="/wishlist"
                className="hover:text-secondary transition-colors"
              >
                Wishlist
              </Link>
              <Link
                to="/orders"
                className="hover:text-secondary transition-colors"
              >
                My Orders
              </Link>
              <Link
                to="/cart"
                className="hover:text-secondary transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="hover:text-secondary transition-colors p-0"
              >
                Logout ({currentUser.name})
              </Button>
            </>
          ) : currentUser.role === "seller" ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-secondary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/manage-books"
                className="hover:text-secondary transition-colors"
              >
                My Books
              </Link>
              <Link
                to="/seller-orders"
                className="hover:text-secondary transition-colors"
              >
                Orders
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="hover:text-secondary transition-colors p-0"
              >
                Logout ({currentUser.name})
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/admin"
                className="hover:text-secondary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="hover:text-secondary transition-colors"
              >
                Users
              </Link>
              <Link
                to="/admin/sellers"
                className="hover:text-secondary transition-colors"
              >
                Sellers
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="hover:text-secondary transition-colors p-0"
              >
                Logout ({currentUser.name})
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            Toggle Theme
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center space-x-4">
          {currentUser && (
            <>
              {currentUser.role === "user" && (
                <Link to="/cart" className="text-secondary">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              )}
              <button onClick={handleLogout} className="text-secondary">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
          <Link
            to={
              currentUser
                ? currentUser.role === "admin"
                  ? "/admin-dashboard"
                  : currentUser.role === "seller"
                  ? "/dashboard"
                  : "/profile"
                : "/login"
            }
            className="text-secondary"
          >
            <UserCircle className="h-6 w-6" />
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            Theme
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;