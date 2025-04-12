import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ManageBooks = () => {
  const { getBooksBySellerId, deleteBook } = useStore();
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Manage Books</h1>
          <p className="text-muted-foreground mb-8">You need to be logged in as a seller to access this page</p>
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Login as Seller</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const sellerBooks = getBooksBySellerId(currentUser.id);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Books</h1>
          <Link to="/add-book">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 sm:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </Link>
        </div>
        
        {sellerBooks.length > 0 ? (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-foreground">Image</TableHead>
                  <TableHead className="text-foreground">Title</TableHead>
                  <TableHead className="text-foreground">Author</TableHead>
                  <TableHead className="text-foreground">Genre</TableHead>
                  <TableHead className="text-foreground">Price</TableHead>
                  <TableHead className="text-right text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerBooks.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell>
                      <img 
                        src={book.imageUrl} 
                        alt={book.title} 
                        className="w-16 h-20 object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{book.title}</TableCell>
                    <TableCell className="text-muted-foreground">{book.author}</TableCell>
                    <TableCell className="text-muted-foreground">{book.genre}</TableCell>
                    <TableCell className="text-foreground">${book.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/edit-book/${book._id}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteBook(book._id)}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm p-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't added any books yet</p>
            <Link to="/add-book">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Book
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;