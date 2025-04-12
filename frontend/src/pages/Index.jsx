import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import Navbar from '../components/Navbar';
import SparkleEffect from '../components/SparkleEffect'; // Add this
import { Button } from '@/components/ui/button';

const Index = () => {
  const { books } = useStore();
  const { currentUser } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState(books.slice(0, 4));

  useEffect(() => {
    const randomBooks = [...books].sort(() => 0.5 - Math.random()).slice(0, 4);
    setFeaturedBooks(randomBooks);
  }, [books]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <SparkleEffect /> {/* Add this */}

      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BookEase</h1>
          <p className="text-xl md:text-2xl mb-8">Your one-stop destination for all your favorite books</p>
          <Link to="/books">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
            >
              Explore Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/books">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Browse All Books
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;