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
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'ontheway':
        return <Badge className="bg-blue-500">On the way</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Address</TableHead>
            {userType === 'admin' && <TableHead>Buyer</TableHead>}
            {(userType === 'user' || userType === 'admin') && <TableHead>Seller</TableHead>}
            <TableHead>Order Date</TableHead>
            <TableHead>Delivery By</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
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
                    <div className="font-medium">
                      {order.items.length > 0 ? order.items[0].bookTitle : 'Unknown Book'}
                      {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell className="max-w-[200px] truncate">{order.address}</TableCell>
              {userType === 'admin' && <TableCell>{order.userName}</TableCell>}
              {(userType === 'user' || userType === 'admin') && <TableCell>{order.sellerName}</TableCell>}
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>{order.deliveryDate}</TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
