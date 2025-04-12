import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';
import axios from '../../lib/axiosConfig';

const AdminUsers = () => {
  const { currentUser } = useAuth();
  const { deleteUser } = useStore();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('/api/users');
          setUsers(response.data.filter(u => u.role === 'user'));
        } catch (error) {
          console.error("Fetch users error:", error);
        }
      };
      fetchUsers();
    }
  }, [currentUser]);

  if (currentUser?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Users List</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground">Email</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell className="text-foreground">{user.name}</TableCell>
                <TableCell className="text-foreground">{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUser(user._id)}
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

export default AdminUsers;