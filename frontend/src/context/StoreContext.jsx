import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../lib/axiosConfig";
import { useAuth } from "./AuthContext";

const StoreContext = createContext(undefined);

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("bookease-token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
}, (error) => Promise.reject(error));

export const StoreProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get("/api/books");
        setBooks(booksResponse.data);
        setFilteredBooks(booksResponse.data);

        if (currentUser) {
          const endpoint =
            currentUser.role === "seller" ? "/api/orders/seller" :
            currentUser.role === "admin" ? "/api/orders/admin" :
            "/api/orders/user";
          const ordersResponse = await axios.get(endpoint);
          setOrders(ordersResponse.data);

          if (currentUser.role === "admin") {
            const usersResponse = await axios.get("/api/users");
            setUsers(usersResponse.data.filter(u => u.role === "user"));
            const sellersResponse = await axios.get("/api/sellers");
            setSellers(sellersResponse.data);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
        toast.error("Error loading data");
      }
    };
    fetchData();

    const savedCart = localStorage.getItem("bookease-cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem("bookease-wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("bookease-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("bookease-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.book._id === book._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.book._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${book.title} added to cart`);
      return [...prevCart, { book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.book._id !== bookId);
      if (updatedCart.length !== prevCart.length) {
        toast.success("Item removed from cart");
      }
      return updatedCart;
    });
  };

  const updateCartItemQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.book._id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const addToWishlist = (userId, bookId) => {
    if (!wishlist.some((item) => item.userId === userId && item.bookId === bookId)) {
      setWishlist((prev) => {
        const newWishlist = [...prev, { userId, bookId }];
        return newWishlist;
      });
      toast.success("Added to wishlist");
    }
  };

  const removeFromWishlist = (userId, bookId) => {
    setWishlist((prev) => {
      const newWishlist = prev.filter((item) => !(item.userId === userId && item.bookId === bookId));
      return newWishlist;
    });
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (userId, bookId) =>
    wishlist.some((item) => item.userId === userId && item.bookId === bookId);

  const placeOrder = async (address) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return "";
    }
    const itemsBySeller = {};
    cart.forEach((item) => {
      const sellerId = item.book.sellerId;
      if (!itemsBySeller[sellerId]) itemsBySeller[sellerId] = [];
      itemsBySeller[sellerId].push(item);
    });
    const orderIds = [];
    try {
      for (const [sellerId, items] of Object.entries(itemsBySeller)) {
        const orderItems = items.map((item) => ({
          bookId: item.book._id,
          bookTitle: item.book.title,
          bookImageUrl: item.book.imageUrl,
          quantity: item.quantity,
          price: item.book.price,
        }));
        const totalAmount = items.reduce(
          (sum, item) => sum + item.book.price * item.quantity,
          0
        );
        const newOrder = {
          items: orderItems,
          address,
          totalAmount,
          sellerId,
          sellerName: items[0].book.sellerName,
          userId: currentUser.id,
          userName: currentUser.name,
        };
        const response = await axios.post("/api/orders", newOrder);
        orderIds.push(response.data._id);
        setOrders((prev) => [...prev, response.data]);
      }
      clearCart();
      toast.success("Order placed successfully!");
      return orderIds.join(",");
    } catch (error) {
      console.error("Order error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error placing order");
      return "";
    }
  };

  const getOrdersByUserId = (userId) => orders.filter((order) => order.userId === userId);

  const getOrdersBySellerId = (sellerId) => orders.filter((order) => order.sellerId === sellerId);

  const getDashboardStats = async () => {
    try {
      const usersResponse = await axios.get('/api/users');
      const sellersResponse = await axios.get('/api/sellers');
      return {
        totalUsers: usersResponse.data.filter(u => u.role === 'user').length,
        totalSellers: sellersResponse.data.filter(u => u.role === 'seller').length,
        totalBooks: books.length,
        totalOrders: orders.length,
      };
    } catch (error) {
      console.error("Dashboard stats error:", error.response?.data || error.message);
      toast.error("Error fetching dashboard stats");
      return { totalUsers: 0, totalSellers: 0, totalBooks: 0, totalOrders: 0 };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Delete user error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  const deleteSeller = async (sellerId) => {
    try {
      await axios.delete(`/api/sellers/${sellerId}`);
      toast.success("Seller deleted successfully");
      setSellers((prev) => prev.filter((seller) => seller._id !== sellerId));
    } catch (error) {
      console.error("Delete seller error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error deleting seller");
    }
  };

  const getBooksBySellerId = (sellerId) => books.filter((book) => book.sellerId === sellerId);

  const addBook = async (book) => {
    try {
      const newBook = {
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        price: book.price,
        imageUrl: book.imageUrl || "https://via.placeholder.com/150",
        sellerId: currentUser?.id,
        sellerName: currentUser?.name,
      };
      const response = await axios.post("/api/books", newBook);
      setBooks((prev) => [...prev, response.data]);
      setFilteredBooks((prev) => [...prev, response.data]);
      toast.success(`${book.title} added successfully`);
    } catch (error) {
      console.error("Add book error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding book");
    }
  };

  const updateBook = async (book) => {
    try {
      const response = await axios.put(`/api/books/${book._id}`, book);
      setBooks((prev) => prev.map((b) => (b._id === book._id ? response.data : b)));
      setFilteredBooks((prev) => prev.map((b) => (b._id === book._id ? response.data : b)));
      toast.success(`${book.title} updated successfully`);
    } catch (error) {
      console.error("Update book error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error updating book");
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`/api/books/${bookId}`);
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
      setFilteredBooks((prev) => prev.filter((book) => book._id !== bookId));
      toast.success("Book deleted successfully");
    } catch (error) {
      console.error("Delete book error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error deleting book");
    }
  };

  return (
    <StoreContext.Provider
      value={{
        books,
        filteredBooks,
        setFilteredBooks,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        orders,
        placeOrder,
        getOrdersByUserId,
        getOrdersBySellerId,
        getDashboardStats,
        getBooksBySellerId,
        addBook,
        updateBook,
        deleteBook,
        deleteUser,
        deleteSeller,
        users,
        sellers,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};