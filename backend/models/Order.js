
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  bookId: { 
    type: String, 
    required: true 
  },
  bookTitle: { 
    type: String, 
    required: true 
  },
  bookImageUrl: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  }
});

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  items: [orderItemSchema],
  address: { 
    type: String, 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'delivered', 'ontheway'], 
    default: 'pending' 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sellerName: { 
    type: String, 
    required: true 
  },
  orderDate: { 
    type: String, 
    default: () => new Date().toLocaleDateString() 
  },
  deliveryDate: { 
    type: String, 
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toLocaleDateString();
    } 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
