// MongoDB Database Schema for E-commerce Admin Panel

// Products Collection Schema
const ProductSchema = {
  _id: "ObjectId",
  name: "String", // Product name
  description: "String", // Product description
  mrp: "Number", // Maximum Retail Price
  salePrice: "Number", // Current selling price
  category: "String", // Product category (Running, Casual, Sports, Formal)
  brand: "String", // Brand name
  model: "String", // Model from Google Sheets
  images: ["String"], // Array of image URLs
  variants: {
    sizes: ["String"], // Available sizes (S, M, L, XL)
    colors: ["String"] // Available colors
  },
  stock: {
    // Stock per variant combination
    "Red-S": "Number",
    "Red-M": "Number",
    "Red-L": "Number",
    "Blue-S": "Number",
    "Blue-M": "Number",
    "Blue-L": "Number"
    // Dynamic keys based on color-size combinations
  },
  reorderLevel: "Number", // Minimum stock level before reorder alert
  isActive: "Boolean", // Product visibility status
  createdAt: "Date",
  updatedAt: "Date"
};

// Orders Collection Schema
const OrderSchema = {
  _id: "ObjectId",
  orderId: "String", // Unique order identifier (ORD-001)
  customerId: "ObjectId", // Reference to User collection
  customerInfo: {
    name: "String",
    email: "String",
    phone: "String"
  },
  items: [{
    productId: "ObjectId", // Reference to Product collection
    productName: "String",
    variant: "String", // e.g., "Red - Size M"
    quantity: "Number",
    price: "Number", // Price at time of purchase
    total: "Number" // quantity * price
  }],
  shippingAddress: {
    street: "String",
    city: "String",
    state: "String",
    pincode: "String",
    country: "String"
  },
  paymentInfo: {
    method: "String", // Credit Card, UPI, Net Banking, etc.
    transactionId: "String",
    status: "String", // Paid, Pending, Failed
    amount: "Number"
  },
  orderStatus: "String", // Processing, Shipped, Delivered, Cancelled
  totalAmount: "Number",
  orderDate: "Date",
  shippedDate: "Date",
  deliveredDate: "Date",
  trackingNumber: "String",
  notes: "String", // Admin notes
  createdAt: "Date",
  updatedAt: "Date"
};

// Users Collection Schema
const UserSchema = {
  _id: "ObjectId",
  name: "String",
  email: "String", // Unique
  phone: "String",
  password: "String", // Hashed
  profileImage: "String", // URL
  addresses: [{
    type: "String", // Home, Work, Other
    street: "String",
    city: "String",
    state: "String",
    pincode: "String",
    country: "String",
    isDefault: "Boolean"
  }],
  preferences: {
    newsletter: "Boolean",
    smsUpdates: "Boolean",
    emailUpdates: "Boolean"
  },
  accountStatus: "String", // active, blocked, suspended
  totalOrders: "Number",
  totalSpent: "Number",
  lastOrderDate: "Date",
  wishlist: ["ObjectId"], // Array of Product IDs
  cart: [{
    productId: "ObjectId",
    variant: "String",
    quantity: "Number",
    addedAt: "Date"
  }],
  createdAt: "Date",
  updatedAt: "Date",
  lastLoginAt: "Date"
};

// Categories Collection Schema
const CategorySchema = {
  _id: "ObjectId",
  name: "String", // Running, Casual, Sports, Formal
  description: "String",
  image: "String", // Category image URL
  isActive: "Boolean",
  sortOrder: "Number", // Display order
  createdAt: "Date",
  updatedAt: "Date"
};

// Brands Collection Schema
const BrandSchema = {
  _id: "ObjectId",
  name: "String", // Nike, Adidas, Puma, etc.
  logo: "String", // Brand logo URL
  description: "String",
  isActive: "Boolean",
  createdAt: "Date",
  updatedAt: "Date"
};

// Analytics Collection Schema (for caching analytics data)
const AnalyticsSchema = {
  _id: "ObjectId",
  type: "String", // daily, weekly, monthly
  date: "Date", // Date for the analytics period
  metrics: {
    totalRevenue: "Number",
    totalOrders: "Number",
    averageOrderValue: "Number",
    newCustomers: "Number",
    returningCustomers: "Number",
    conversionRate: "Number",
    topProducts: [{
      productId: "ObjectId",
      productName: "String",
      unitsSold: "Number",
      revenue: "Number"
    }],
    categoryPerformance: [{
      category: "String",
      revenue: "Number",
      orders: "Number",
      percentage: "Number"
    }]
  },
  createdAt: "Date"
};

// Inventory Logs Collection Schema (for tracking stock changes)
const InventoryLogSchema = {
  _id: "ObjectId",
  productId: "ObjectId",
  variant: "String", // e.g., "Red-M"
  changeType: "String", // restock, sale, adjustment, return
  previousStock: "Number",
  newStock: "Number",
  quantity: "Number", // Change amount
  reason: "String", // Reason for change
  orderId: "ObjectId", // If related to an order
  adminId: "ObjectId", // Admin who made the change
  createdAt: "Date"
};

// Admin Users Collection Schema
const AdminUserSchema = {
  _id: "ObjectId",
  username: "String", // Unique
  email: "String", // Unique
  password: "String", // Hashed
  role: "String", // super_admin, admin, manager
  permissions: [{
    module: "String", // products, orders, users, analytics
    actions: ["String"] // create, read, update, delete
  }],
  isActive: "Boolean",
  lastLoginAt: "Date",
  createdAt: "Date",
  updatedAt: "Date"
};

// MongoDB Indexes for Performance
const Indexes = {
  Products: [
    { name: "text", description: "text" }, // Text search
    { category: 1 },
    { brand: 1 },
    { isActive: 1 },
    { createdAt: -1 }
  ],
  Orders: [
    { customerId: 1 },
    { orderStatus: 1 },
    { orderDate: -1 },
    { orderId: 1 }, // Unique
    { "paymentInfo.status": 1 }
  ],
  Users: [
    { email: 1 }, // Unique
    { phone: 1 },
    { accountStatus: 1 },
    { createdAt: -1 },
    { totalSpent: -1 }
  ],
  Analytics: [
    { type: 1, date: -1 },
    { createdAt: -1 }
  ],
  InventoryLogs: [
    { productId: 1, createdAt: -1 },
    { changeType: 1 },
    { createdAt: -1 }
  ]
};

// Sample MongoDB Queries for Admin Panel

const SampleQueries = {
  // Get low stock products
  getLowStockProducts: `
    db.products.aggregate([
      {
        $addFields: {
          stockEntries: { $objectToArray: "$stock" }
        }
      },
      {
        $addFields: {
          lowStockVariants: {
            $filter: {
              input: "$stockEntries",
              cond: { $lte: ["$$this.v", "$reorderLevel"] }
            }
          }
        }
      },
      {
        $match: {
          "lowStockVariants.0": { $exists: true }
        }
      }
    ])
  `,

  // Get sales analytics for a date range
  getSalesAnalytics: `
    db.orders.aggregate([
      {
        $match: {
          orderDate: {
            $gte: ISODate("2024-01-01"),
            $lte: ISODate("2024-01-31")
          },
          orderStatus: { $ne: "Cancelled" }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$orderDate" }
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  `,

  // Get top selling products
  getTopSellingProducts: `
    db.orders.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.productName" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.total" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ])
  `,

  // Get user order history
  getUserOrderHistory: `
    db.orders.find(
      { customerId: ObjectId("user_id") },
      { 
        orderId: 1, 
        orderDate: 1, 
        totalAmount: 1, 
        orderStatus: 1,
        items: 1 
      }
    ).sort({ orderDate: -1 })
  `
};

export {
  ProductSchema,
  OrderSchema,
  UserSchema,
  CategorySchema,
  BrandSchema,
  AnalyticsSchema,
  InventoryLogSchema,
  AdminUserSchema,
  Indexes,
  SampleQueries
};