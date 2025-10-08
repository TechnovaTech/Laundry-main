# 🧺 Laundry Management System

A comprehensive full-stack laundry management platform with three integrated applications: Admin Panel, Customer App, and Partner App.

## 📋 Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Applications](#running-the-applications)
- [Workflow](#workflow)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)

---

## 🎯 Overview

This laundry management system streamlines the entire laundry service workflow from order placement to delivery. It consists of three interconnected applications:

1. **Admin Panel** - Web dashboard for business management
2. **Customer App** - Mobile-first web app for customers
3. **Partner App** - Mobile app for delivery partners

---

## 📁 Project Structure

```
laundry-main/
├── admin panel/          # Next.js admin dashboard
│   ├── app/
│   │   ├── admin/       # Admin pages
│   │   ├── api/         # API routes
│   │   └── components/  # Shared components
│   ├── models/          # MongoDB models
│   ├── lib/             # Utilities
│   └── middleware.ts    # CORS middleware
│
├── customer/            # React customer app
│   ├── src/
│   │   ├── pages/       # App pages
│   │   ├── components/  # UI components
│   │   └── assets/      # Images & icons
│   └── android/         # Capacitor Android build
│
└── partner/             # Next.js partner app
    ├── src/
    │   ├── app/         # App pages
    │   └── components/  # UI components
    └── android/         # Capacitor Android build
```

---

## 🛠 Technology Stack

### Admin Panel
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Inline styles, Tailwind CSS
- **Authentication**: Custom auth system

### Customer App
- **Framework**: React + Vite
- **Language**: TypeScript
- **Mobile**: Capacitor (iOS/Android)
- **UI Library**: Shadcn/ui, Lucide icons
- **Styling**: Tailwind CSS

### Partner App
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Mobile**: Capacitor (iOS/Android)
- **Styling**: Tailwind CSS

---

## ✨ Features

### Admin Panel Features
- 📊 **Dashboard**: Real-time statistics and analytics
- 📦 **Order Management**: View, track, and manage all orders
- 👥 **Customer Management**: Customer database and profiles
- 🚚 **Delivery Partner Management**: Partner onboarding and tracking
- 💰 **Pricing Management**: Service pricing configuration
- 🎁 **Wallet & Points**: Loyalty program management
- ⭐ **Reviews & Ratings**: Customer feedback management
- 📈 **Reports**: Dynamic charts with real-time data
  - Orders trend analysis
  - Revenue by day
  - Partner performance metrics
  - Customer loyalty insights
- 🔔 **Notifications**: Push notification system
- ⚙️ **Settings**: System configuration
- 👔 **Role Management**: User permissions

### Customer App Features
- 🏠 **Home**: Service overview and quick booking
- 📅 **Booking**: Multi-step order placement
  - Service selection
  - Address management
  - Time slot selection
  - Payment options
- 📜 **Booking History**: Order tracking and history
- ⭐ **Rate Orders**: Review and rating system with UI popup
- 💳 **Wallet**: Points and balance management
- 👤 **Profile**: Account management
- 🔔 **Notifications**: Order updates
- 💰 **Pricing**: Service price list

### Partner App Features
- 🏠 **Home**: Dashboard with earnings and stats
- 📦 **Orders**: Available and assigned orders
- 🗺️ **Map View**: Route optimization
- 📍 **Order Details**: Pickup and delivery information
- 💰 **Earnings**: Payment tracking
- 👤 **Profile**: Partner account management

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/TechnovaTech/Laundry-main.git
cd laundry-main
```

### Install Dependencies

#### Admin Panel
```bash
cd "admin panel"
npm install
```

#### Customer App
```bash
cd customer
npm install
```

#### Partner App
```bash
cd partner
npm install
```

---

## ⚙️ Configuration

### Admin Panel Environment Variables
Create `.env.local` in `admin panel/`:
```env
MONGODB_URI=mongodb://localhost:27017/laundry
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Customer App Environment Variables
Create `.env.local` in `customer/`:
```env
VITE_API_URL=http://localhost:3000
```

### Partner App Environment Variables
Create `.env.local` in `partner/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🏃 Running the Applications

### Start MongoDB
```bash
mongod
```

### Run Admin Panel
```bash
cd "admin panel"
npm run dev
# Runs on http://localhost:3000
```

### Run Customer App
```bash
cd customer
npm run dev
# Runs on http://localhost:3001
```

### Run Partner App
```bash
cd partner
npm run dev
# Runs on http://localhost:3002
```

---

## 🔄 Workflow

### 1. Customer Order Flow
```
Customer Opens App
    ↓
Browse Services & Pricing
    ↓
Select Service (Wash & Fold, Dry Clean, etc.)
    ↓
Add/Select Delivery Address
    ↓
Choose Pickup Time Slot
    ↓
Choose Delivery Time Slot
    ↓
Review Order & Payment Method
    ↓
Place Order
    ↓
Order Created in Database (Status: Pending)
    ↓
Customer Receives Confirmation
```

### 2. Admin Order Management Flow
```
Admin Logs into Dashboard
    ↓
Views New Orders (Status: Pending)
    ↓
Assigns Delivery Partner
    ↓
Order Status Updated (Status: Confirmed)
    ↓
Monitors Order Progress
    ↓
Views Reports & Analytics
    ↓
Manages Customer Reviews
```

### 3. Partner Delivery Flow
```
Partner Logs into App
    ↓
Views Assigned Orders
    ↓
Accepts Order
    ↓
Navigates to Pickup Location (Status: Picked Up)
    ↓
Collects Laundry from Customer
    ↓
Delivers to Laundry Hub (Status: At Hub)
    ↓
Laundry Processed (Status: Processing → Ready)
    ↓
Partner Picks Up from Hub (Status: Out for Delivery)
    ↓
Delivers to Customer (Status: Delivered)
    ↓
Customer Rates Service
    ↓
Partner Receives Payment
```

### 4. Review & Rating Flow
```
Order Delivered
    ↓
Customer Opens Booking History
    ↓
Clicks "Rate Service"
    ↓
Selects Star Rating (1-5)
    ↓
Writes Feedback (Optional)
    ↓
Submits Review
    ↓
Success Popup Displayed
    ↓
Review Saved to Database
    ↓
Admin Views Review in Reviews Panel
    ↓
Admin Can Delete Review if Needed
```

### 5. Reports & Analytics Flow
```
Admin Opens Reports Page
    ↓
System Fetches Real-time Data:
  - Total Orders Count
  - Total Revenue Sum
  - Active Partners Count
  - Orders Trend (Last 7 Days)
  - Revenue by Day (Last 7 Days)
  - Partner Performance Metrics
  - Customer Loyalty Data
    ↓
Dynamic Charts Rendered:
  - Line Chart: Orders Trend
  - Bar Chart: Revenue by Day
  - Horizontal Bar: Partner Performance
  - Map: Top Order Locations
  - Bar Chart: Loyalty Points
    ↓
Admin Can Export PDF/CSV
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Orders API
```
GET    /api/orders              # Get all orders
GET    /api/orders/:id          # Get order by ID
POST   /api/orders              # Create new order
PUT    /api/orders/:id          # Update order
DELETE /api/orders/:id          # Delete order
```

### Reviews API
```
GET    /api/reviews             # Get all reviews
POST   /api/reviews             # Create review
DELETE /api/reviews/:id         # Delete review
POST   /api/orders/:id/review   # Submit review for order
```

### Reports API
```
GET    /api/reports             # Get reports data
POST   /api/reports/test-data   # Create test data
```

### Customers API
```
GET    /api/customers           # Get all customers
POST   /api/customers/test      # Create test customer
```

---

## 🗄️ Database Schema

### Order Model
```javascript
{
  orderId: String (unique),
  customerId: ObjectId (ref: Customer),
  partnerId: ObjectId (ref: Partner),
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: Enum [pending, confirmed, picked_up, processing, 
                ready, out_for_delivery, delivered, cancelled],
  pickupAddress: {
    street, city, state, pincode
  },
  deliveryAddress: {
    street, city, state, pincode
  },
  pickupSlot: { date, timeSlot },
  deliverySlot: { date, timeSlot },
  paymentStatus: Enum [pending, paid, failed],
  paymentMethod: String,
  reviewId: ObjectId (ref: Review),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  orderId: ObjectId (ref: Order),
  customerId: ObjectId (ref: Customer),
  rating: Number (1-5),
  comment: String,
  status: Enum [pending, approved, rejected],
  createdAt: Date
}
```

### Customer Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  addresses: [{
    street, city, state, pincode, isDefault
  }],
  walletBalance: Number,
  loyaltyPoints: Number,
  createdAt: Date
}
```

### Partner Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  vehicleType: String,
  vehicleNumber: String,
  status: Enum [active, inactive],
  earnings: Number,
  rating: Number,
  createdAt: Date
}
```

---

## 🔐 CORS Configuration

The admin panel includes CORS middleware to allow cross-origin requests from customer and partner apps:

```typescript
// middleware.ts
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 📱 Building Mobile Apps

### Customer App (Android)
```bash
cd customer
npm run build
npx cap sync android
npx cap open android
# Build APK in Android Studio
```

### Partner App (Android)
```bash
cd partner
npm run build
npx cap sync android
npx cap open android
# Build APK in Android Studio
```

---

## 🧪 Testing

### Create Test Data
```bash
# Create test customers
POST http://localhost:3000/api/customers/test

# Create test reviews
POST http://localhost:3000/api/reviews/test

# Create test orders and partners
POST http://localhost:3000/api/reports/test-data
```

---

## 📊 Key Metrics

- **Total Orders**: Real-time count from database
- **Total Revenue**: Sum of all order amounts
- **Active Partners**: Count of active delivery partners
- **Average Delivery Time**: Calculated from order timestamps
- **Customer Satisfaction**: Average rating from reviews
- **Partner Performance**: Deliveries per partner

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Authors

- **TechnovaTech** - [GitHub](https://github.com/TechnovaTech)
- **yash9424** - [GitHub](https://github.com/yash9424)

---

## 🐛 Known Issues

- Hydration warnings from browser extensions (suppressed)
- Date formatting may vary by locale
- Mobile apps require Capacitor configuration

---

## 🔮 Future Enhancements

- [ ] Real-time order tracking with WebSockets
- [ ] Push notifications via Firebase
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Automated partner assignment
- [ ] Customer chat support
- [ ] Invoice generation
- [ ] Subscription plans

---

## 📞 Support

For support, email support@laundryapp.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- Capacitor for mobile app capabilities
- Shadcn/ui for beautiful components

---

**Made with ❤️ by TechnovaTech**
