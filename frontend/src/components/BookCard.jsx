import React from "react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, ShoppingCart, Trash } from "lucide-react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const { currentUser } = useAuth();
  const {
    addToCart,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useStore();

  const handleAddToWishlist = () => {
    if (currentUser) {
      addToWishlist(currentUser.id, book._id); // Fix: _id
    }
  };

  const handleRemoveFromWishlist = () => {
    if (currentUser) {
      removeFromWishlist(currentUser.id, book._id); // Fix: _id
    }
  };

  const isWishlisted = currentUser
    ? isInWishlist(currentUser.id, book._id) // Fix: _id
    : false;

  return (
    <Card className="h-full flex flex-col bg-card text-card-foreground">
      <div className="p-4 flex-1">
        <div className="aspect-[3/4] relative rounded overflow-hidden">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-lg truncate">{book.title}</h3>
          <p className="text-sm text-muted-foreground">Author: {book.author}</p>
          <p className="text-sm text-muted-foreground">Genre: {book.genre}</p>
          <p className="text-lg font-bold mt-2">
            Price: ${book.price.toFixed(2)}
          </p>
        </div>
      </div>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex flex-wrap gap-2">
          {currentUser && currentUser.role === "user" && (
            <>
              <Button
                variant={isWishlisted ? "destructive" : "secondary"}
                size="sm"
                onClick={
                  isWishlisted ? handleRemoveFromWishlist : handleAddToWishlist
                }
                className="flex-1 min-w-[120px]"
              >
                {isWishlisted ? (
                  <>
                    <Trash className="h-4 w-4 mr-1" />
                    Remove
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-1" />
                    Wishlist
                  </>
                )}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => addToCart(book)}
                className="flex-1 min-w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </>
          )}
          <Link to={`/book/${book._id}`} className="flex-1 min-w-[120px]"> {/* Fix: _id */}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;