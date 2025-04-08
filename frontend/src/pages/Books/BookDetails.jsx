
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, ShoppingCart, Trash } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useStore();
  const { currentUser } = useAuth();
  
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Book not found</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    );
  }
  
  const isWishlisted = currentUser ? isInWishlist(currentUser.id, book.id) : false;
  
  const handleAddToWishlist = () => {
    if (currentUser) {
      addToWishlist(currentUser.id, book.id);
    }
  };
  
  const handleRemoveFromWishlist = () => {
    if (currentUser) {
      removeFromWishlist(currentUser.id, book.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to books
        </Button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Book image */}
            <div className="md:w-1/3 p-8 flex justify-center">
              <img 
                src={book.imageUrl}
                alt={book.title}
                className="w-full max-w-xs object-contain h-auto"
              />
            </div>
            
            {/* Book details */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-gray-600 text-lg mb-4">By {book.author}</p>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">Genre:</span>
                  <span>{book.genre}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">Seller:</span>
                  <span>{book.sellerName}</span>
                </div>
                
                <p className="text-2xl font-bold text-bookblue my-4">${book.price.toFixed(2)}</p>
                
                <p className="text-gray-700 mb-6">{book.description}</p>
                
                {currentUser && currentUser.role === 'user' && (
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => addToCart(book)}
                      className="bg-bookblue hover:bg-blue-700"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    
                    <Button 
                      variant={isWishlisted ? "destructive" : "outline"}
                      onClick={isWishlisted ? handleRemoveFromWishlist : handleAddToWishlist}
                    >
                      {isWishlisted ? (
                        <>
                          <Trash className="mr-2 h-4 w-4" />
                          Remove from Wishlist
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Add to Wishlist
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
