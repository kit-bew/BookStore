import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

// Sample data for books
const SAMPLE_BOOKS = [
  {
    id: "1",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    genre: "Business",
    price: 19.99,
    imageUrl: "",
    description:
      "A classic bestseller on personal development and success principles.",
    sellerId: "2",
    sellerName: "Test Seller"
  }
]
// Sample orders data
const SAMPLE_ORDERS = [
  {
    id: "order1",
    userId: "1",
    userName: "Test User",
    items: [
      {
        bookId: "1",
        bookTitle: "Think and Grow Rich",
        bookImageUrl: "",
        quantity: 1,
        price: 19.99
      }
    ],
    address: "123 Main St, City, Country",
    totalAmount: 19.99,
    status: "delivered",
    orderDate: "2023-12-18",
    deliveryDate: "2023-12-25",
    sellerId: "2",
    sellerName: "Test Seller"
  }
]

const StoreContext = createContext(undefined)

export const StoreProvider = ({ children }) => {
  const [books, setBooks] = useState(SAMPLE_BOOKS)
  const [filteredBooks, setFilteredBooks] = useState(SAMPLE_BOOKS)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState(SAMPLE_ORDERS)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("bookease-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    const savedWishlist = localStorage.getItem("bookease-wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bookease-cart", JSON.stringify(cart))
  }, [cart])

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bookease-wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const addToCart = book => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.book.id === book.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      toast.success(`${book.title} added to cart`)
      return [...prevCart, { book, quantity: 1 }]
    })
  }

  const removeFromCart = bookId => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.book.id !== bookId)
      if (updatedCart.length !== prevCart.length) {
        toast.success("Item removed from cart")
      }
      return updatedCart
    })
  }

  const updateCartItemQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const addToWishlist = (userId, bookId) => {
    const isAlreadyInWishlist = wishlist.some(
      item => item.userId === userId && item.bookId === bookId
    )

    if (!isAlreadyInWishlist) {
      setWishlist(prevWishlist => [...prevWishlist, { userId, bookId }])
      toast.success("Added to wishlist")
    }
  }

  const removeFromWishlist = (userId, bookId) => {
    setWishlist(prevWishlist =>
      prevWishlist.filter(
        item => !(item.userId === userId && item.bookId === bookId)
      )
    )
    toast.success("Removed from wishlist")
  }

  const isInWishlist = (userId, bookId) => {
    return wishlist.some(
      item => item.userId === userId && item.bookId === bookId
    )
  }

  const placeOrder = (userId, userName, address) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return ""
    }

    // Group cart items by seller
    const itemsBySeller = {}
    cart.forEach(item => {
      const sellerId = item.book.sellerId
      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = []
      }
      itemsBySeller[sellerId].push(item)
    })

    // Create an order for each seller
    const orderIds = []

    Object.entries(itemsBySeller).forEach(([sellerId, items]) => {
      const orderId = `order-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`
      orderIds.push(orderId)

      const sellerName = items[0].book.sellerName // Assuming all items have the same seller

      const orderItems = items.map(item => ({
        bookId: item.book.id,
        bookTitle: item.book.title,
        bookImageUrl: item.book.imageUrl,
        quantity: item.quantity,
        price: item.book.price
      }))

      const totalAmount = items.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
      )

      const orderDate = new Date().toISOString().split("T")[0]
      // Delivery date - 7 days from now
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 7)

      const newOrder = {
        id: orderId,
        userId,
        userName,
        items: orderItems,
        address,
        totalAmount,
        status: "pending",
        orderDate,
        deliveryDate: deliveryDate.toISOString().split("T")[0],
        sellerId,
        sellerName
      }

      setOrders(prevOrders => [...prevOrders, newOrder])
    })

    clearCart()
    toast.success("Order placed successfully!")

    return orderIds.join(",")
  }

  const getOrdersByUserId = userId => {
    return orders.filter(order => order.userId === userId)
  }

  const getOrdersBySellerId = sellerId => {
    return orders.filter(order => order.sellerId === sellerId)
  }

  const getDashboardStats = () => {
    // In a real app, this would come from an API
    return {
      totalUsers: 3,
      totalSellers: 2,
      totalBooks: books.length,
      totalOrders: orders.length
    }
  }

  const getBooksBySellerId = sellerId => {
    return books.filter(book => book.sellerId === sellerId)
  }

  const addBook = book => {
    const newBook = {
      ...book,
      id: `book-${Date.now()}`
    }

    setBooks(prevBooks => [...prevBooks, newBook])
    setFilteredBooks(prevBooks => [...prevBooks, newBook])
    toast.success(`${book.title} added successfully`)
  }

  const updateBook = book => {
    setBooks(prevBooks => prevBooks.map(b => (b.id === book.id ? book : b)))
    setFilteredBooks(prevBooks =>
      prevBooks.map(b => (b.id === book.id ? book : b))
    )
    toast.success(`${book.title} updated successfully`)
  }

  const deleteBook = bookId => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId))
    setFilteredBooks(prevBooks => prevBooks.filter(book => book.id !== bookId))
    toast.success("Book deleted successfully")
  }

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
        deleteBook
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
