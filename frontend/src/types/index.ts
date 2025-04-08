
export type UserRole = 'user' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  imageUrl: string;
  description: string;
  sellerId: string;
  sellerName: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: {
    bookId: string;
    bookTitle: string;
    bookImageUrl: string;
    quantity: number;
    price: number;
  }[];
  address: string;
  totalAmount: number;
  status: 'pending' | 'delivered' | 'ontheway';
  orderDate: string;
  deliveryDate: string;
  sellerId: string;
  sellerName: string;
}

export interface WishlistItem {
  userId: string;
  bookId: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalBooks: number;
  totalOrders: number;
}
