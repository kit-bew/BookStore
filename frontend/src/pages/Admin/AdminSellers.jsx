// src/pages/Admin/AdminSellers.jsx
import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';
import axios from '../../lib/axiosConfig';

const AdminSellers = () => {
  const { currentUser } = useAuth();
  const { deleteSeller } = useStore();
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const fetchSellers = async () => {
        try {
          const response = await axios.get('/api/sellers');
          setSellers(response.data);
        } catch (error) {
          console.error("Fetch sellers error:", error);
        }
      };
      fetchSellers();
    }
  }, [currentUser]);

  if (currentUser?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Sellers List</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground">Email</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map(seller => (
              <TableRow key={seller._id}>
                <TableCell className="text-foreground">{seller.name}</TableCell>
                <TableCell className="text-foreground">{seller.email}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSeller(seller._id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSellers;