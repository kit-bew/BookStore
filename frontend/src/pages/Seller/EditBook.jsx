// src/pages/Seller/EditBook.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, updateBook } = useStore();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    _id: id,
    title: '',
    author: '',
    genre: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'seller') {
      navigate('/login');
      return;
    }
    const book = books.find((b) => b._id === id);
    if (book) {
      setFormData({
        _id: book._id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        price: book.price.toString(),
        imageUrl: book.imageUrl,
      });
    }
  }, [id, books, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBook({
      ...formData,
      price: parseFloat(formData.price),
    });
    navigate('/manage-books');
  };

  if (!currentUser || currentUser.role !== 'seller') {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">Edit Book</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-card p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-foreground">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-input text-foreground border-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="author" className="text-foreground">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="bg-input text-foreground border-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="genre" className="text-foreground">Genre</Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="bg-input text-foreground border-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-input text-foreground border-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-foreground">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="bg-input text-foreground border-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="imageUrl" className="text-foreground">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="bg-input text-foreground border-input"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;