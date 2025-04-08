
// Constants and mock data structures for the application
export const USER_ROLES = {
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin'
};

// Example of a book structure (for documentation purposes)
/*
Book structure:
{
  id: string,
  title: string,
  author: string,
  genre: string,
  price: number,
  imageUrl: string,
  description: string,
  sellerId: string,
  sellerName: string
}
*/

// Example of an order structure (for documentation purposes)
/*
Order structure:
{
  id: string,
  userId: string,
  userName: string,
  items: [
    {
      bookId: string,
      bookTitle: string,
      bookImageUrl: string,
      quantity: number,
      price: number
    }
  ],
  address: string,
  totalAmount: number,
  status: 'pending' | 'delivered' | 'ontheway',
  orderDate: string,
  deliveryDate: string,
  sellerId: string,
  sellerName: string
}
*/
