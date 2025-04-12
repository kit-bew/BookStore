import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import BookCard from '../../components/BookCard';
import Navbar from '../../components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BooksList = () => {
  const { books, filteredBooks, setFilteredBooks } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  
  const genres = Array.from(new Set(books.map(book => book.genre)));

  useEffect(() => {
    let filtered = books;
    
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGenre && selectedGenre !== 'all') {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }
    
    setFilteredBooks(filtered);
  }, [searchTerm, selectedGenre, books, setFilteredBooks]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Books List</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border-input text-foreground"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="bg-background border-input text-foreground">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent className="bg-card text-card-foreground">
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <BookCard key={book._id} book={book} /> // Fix: _id
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h2 className="text-xl text-muted-foreground">No books found matching your criteria</h2>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('all');
                }}
                className="text-accent hover:text-accent/80"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksList;