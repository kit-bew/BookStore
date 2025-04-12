// src/components/OrderTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const OrderTable = ({ orders, userType }) => {
  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-success text-success-foreground">Delivered</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-accent text-accent">Pending</Badge>;
      case 'ontheway':
        return <Badge className="bg-info text-info-foreground">On the way</Badge>;
      default:
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">{status}</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-input bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">Product</TableHead>
            <TableHead className="text-foreground">Order ID</TableHead>
            <TableHead className="text-foreground">Address</TableHead>
            {userType === 'admin' && <TableHead className="text-foreground">Buyer</TableHead>}
            {(userType === 'user' || userType === 'admin') && <TableHead className="text-foreground">Seller</TableHead>}
            <TableHead className="text-foreground">Order Date</TableHead>
            <TableHead className="text-foreground">Delivery By</TableHead>
            <TableHead className="text-foreground">Price</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  {order.items.length > 0 && (
                    <img
                      src={order.items[0].bookImageUrl}
                      alt={order.items[0].bookTitle}
                      className="h-12 w-10 object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-foreground">
                      {order.items.length > 0 ? order.items[0].bookTitle : 'Unknown Book'}
                      {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-foreground">{order.id}</TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">{order.address}</TableCell>
              {userType === 'admin' && <TableCell className="text-muted-foreground">{order.userName}</TableCell>}
              {(userType === 'user' || userType === 'admin') && <TableCell className="text-muted-foreground">{order.sellerName}</TableCell>}
              <TableCell className="text-muted-foreground">{order.orderDate}</TableCell>
              <TableCell className="text-muted-foreground">{order.deliveryDate}</TableCell>
              <TableCell className="text-foreground">${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;