
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Manage Books</h1>
          <p className="text-gray-600 mb-8">You need to be logged in as a seller to access this page</p>
          <Link to="/login">
            <Button className="bg-bookblue hover:bg-blue-700">Login as Seller</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const sellerBooks = getBooksBySellerId(currentUser.id);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold">My Books</h1>
          
          <Link to="/add-book">
            <Button className="bg-bookblue hover:bg-blue-700 mt-4 sm:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </Link>
        </div>
        
        {sellerBooks.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <img 
                        src={book.imageUrl} 
                        alt={book.title} 
                        className="w-16 h-20 object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>${book.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/edit-book/${book.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteBook(book.id)}
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
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">You haven't added any books yet</p>
            <Link to="/add-book">
              <Button className="bg-bookblue hover:bg-blue-700">
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
