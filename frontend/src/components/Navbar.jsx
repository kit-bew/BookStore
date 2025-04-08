import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ShoppingCart, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-bookblue text-white p-4">
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
          <Link to="/" className="hover:text-gray-200 transition-colors">
            Home
          </Link>

          {!currentUser ? (
            <>
              <Link
                to="/login"
                className="hover:text-gray-200 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-200 transition-colors"
              >
                Register
              </Link>
            </>
          ) : currentUser.role === "user" ? (
            <>
              <Link
                to="/books"
                className="hover:text-gray-200 transition-colors"
              >
                Books
              </Link>
              <Link
                to="/wishlist"
                className="hover:text-gray-200 transition-colors"
              >
                Wishlist
              </Link>
              <Link
                to="/orders"
                className="hover:text-gray-200 transition-colors"
              >
                My Orders
              </Link>
              <Link
                to="/cart"
                className="hover:text-gray-200 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="hover:text-gray-200 transition-colors p-0"
              >
                Logout ({currentUser.name})
              </Button>
            </>
          ) : currentUser.role === "seller" ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-gray-200 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/manage-books"
                className="hover:text-gray-200 transition-colors"
              >
                My Books
              </Link>
              <Link
                to="/seller-orders"
                className="hover:text-gray-200 transition-colors"
              >
                Orders
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="hover:text-gray-200 transition-colors p-0"
              >
                Logout ({currentUser.name})
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/admin-dashboard"
                className="hover:text-gray-200 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/manage-users"
                className="hover:text-gray-200 transition-colors"
              >
                Users
              </Link>
              <Link
                to="/manage-sellers"
                className="hover:text-gray-200 transition-colors"
              >
                Sellers
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="hover:text-gray-200 transition-colors p-0"
              >
                Logout ({currentUser.name})
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center space-x-4">
          {currentUser && (
            <>
              {currentUser.role === "user" && (
                <Link to="/cart" className="text-white">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              )}
              <button onClick={handleLogout} className="text-white">
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
            className="text-white"
          >
            <UserCircle className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
