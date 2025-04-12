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
  
  console.log("URL ID:", id); // Debug
  console.log("Books:", books); // Debug
  const book = books.find(b => b._id === id);
  console.log("Found book:", book); // Debug
  
  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Book not found</h1>
          <Button variant="outline" onClick={() => navigate(-1)} className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    );
  }
  
  const isWishlisted = currentUser ? isInWishlist(currentUser.id, book._id) : false;
  
  const handleAddToWishlist = () => {
    if (currentUser) {
      console.log("Adding to wishlist:", { userId: currentUser.id, bookId: book._id }); // Debug
      addToWishlist(currentUser.id, book._id);
    }
  };
  
  const handleRemoveFromWishlist = () => {
    if (currentUser) {
      console.log("Removing from wishlist:", { userId: currentUser.id, bookId: book._id }); // Debug
      removeFromWishlist(currentUser.id, book._id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to books
        </Button>
        <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-8 flex justify-center">
              <img 
                src={book.imageUrl}
                alt={book.title}
                className="w-full max-w-xs object-contain h-auto"
              />
            </div>
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold mb-2 text-foreground">{book.title}</h1>
              <p className="text-muted-foreground text-lg mb-4">By {book.author}</p>
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2 text-foreground">Genre:</span>
                  <span className="text-muted-foreground">{book.genre}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2 text-foreground">Seller:</span>
                  <span className="text-muted-foreground">{book.sellerName}</span>
                </div>
                <p className="text-2xl font-bold text-primary my-4">${book.price.toFixed(2)}</p>
                <p className="text-muted-foreground mb-6">{book.description}</p>
                {currentUser && currentUser.role === 'user' && (
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => addToCart(book)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant={isWishlisted ? "destructive" : "outline"}
                      onClick={isWishlisted ? handleRemoveFromWishlist : handleAddToWishlist}
                      className={isWishlisted ? "" : "border-accent text-accent hover:bg-accent hover:text-accent-foreground"}
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