# 🧺 Urban Steam - Complete Laundry Management System

A full-stack laundry management platform with three integrated applications: Customer App, Partner App, and Admin Panel.

## 📱 Applications

### 1. **Customer App** (`/customer`)
- **Platform**: React 18 + Vite + Capacitor (Web + Android)
- **Port**: 3001
- **Features**: Order booking, tracking, payments, wallet, referrals

### 2. **Partner App** (`/partner`) 
- **Platform**: Next.js 15 + Capacitor (Web + Android)
- **Port**: 3002
- **Version**: v1.1 (Build 10)
- **Features**: Pickup/delivery management, KYC, hub operations

### 3. **Admin Panel** (`/admin panel`)
- **Platform**: Next.js 15 + MongoDB (Web only)
- **Port**: 3000
- **Features**: Partner management, analytics, order oversight

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or remote)
- Android Studio (for mobile builds)

### Installation
```bash
# Clone repository
git clone https://github.com/TechnovaTech/Laundry-main.git
cd laundry-main

# Install dependencies for all apps
cd "admin panel" && npm install
cd ../customer && npm install  
cd ../partner && npm install
```

### Development
```bash
# Run all apps simultaneously
# Terminal 1: Admin Panel
cd "admin panel" && npm run dev

# Terminal 2: Customer App  
cd customer && npm run dev

# Terminal 3: Partner App
cd partner && npm run dev
```

**Access URLs:**
- Admin Panel: http://localhost:3000
- Customer App: http://localhost:3001  
- Partner App: http://localhost:3002

## 🎨 Design System

### Colors
- **Primary Gradient**: `linear-gradient(to right, #452D9B, #07C8D0)`
- **Purple**: `#452D9B`
- **Cyan**: `#07C8D0`
- **Disabled**: `#9ca3af`

### Button Styling
```css
/* Primary buttons */
background: linear-gradient(to right, #452D9B, #07C8D0);

/* Disabled buttons */
background: #9ca3af;
```

## 📱 Mobile Development

### Android Build Commands
```bash
# Customer App
cd customer
npm run build:mobile
npm run cap:open:android

# Partner App  
cd partner
npm run build
npx cap sync
npx cap open android
```

### Google Authentication
- **Customer App**: Web + Android OAuth clients
- **Partner App**: Android OAuth client configured
- **SHA-1 Fingerprints**: Configured for Google Play Store

## 🗄️ Database

### MongoDB Configuration
```env
MONGODB_URI=mongodb://localhost:27017/laundry
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Collections
- `partners` - Delivery partner data
- `customers` - Customer profiles  
- `orders` - Order management
- `addresses` - Customer addresses
- `payments` - Payment records

## 🔧 Environment Setup

### Admin Panel (`.env.local`)
```env
MONGODB_URI=mongodb://localhost:27017/laundry
JWT_SECRET=your-secret-key-here
NODE_ENV=development
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Customer App (`.env`)
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Partner App (`.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📦 Latest Releases

### Partner App v1.1
- **APK**: `Partner-App-v1.7-GoogleAuth-Complete-Fix.apk`
- **AAB**: `Urban-Steam-Captain-v1.1.aab` (Google Play ready)
- **Features**: Google Auth fix, improved stability

### Customer App
- **Latest Build**: Available in `/customer` directory
- **Features**: Complete booking flow, payment integration

## 🔐 Authentication

### Google OAuth Setup
1. **Google Cloud Console**: 3 OAuth clients (Web, Android Customer, Android Partner)
2. **SHA-1 Fingerprints**: Configured for Google Play Store
3. **Package Names**: 
   - Customer: `com.urbansteam.customer`
   - Partner: `com.urbansteam.partner`

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Customer App  │    │   Partner App   │    │   Admin Panel   │
│   (React+Vite)  │    │   (Next.js 15)  │    │   (Next.js 15)  │
│   Port: 3001    │    │   Port: 3002    │    │   Port: 3000    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │       MongoDB            │
                    │   (Database Layer)       │
                    └─────────────────────────────┘
```

## 🛠️ Development Tools

### Build Scripts
- **Customer**: `npm run build:mobile` (Android build)
- **Partner**: `npm run build` + `npx cap sync` (Android build)  
- **Admin**: `npm run build` (Web build)

### Testing
- **Customer**: React Testing Library
- **Partner**: Next.js testing utilities
- **Admin**: Jest + MongoDB Memory Server

## 📚 Documentation

- **Google Auth Setup**: `/partner/GOOGLE_SIGNIN_SETUP.md`
- **API Documentation**: Available in admin panel
- **Mobile Build Guides**: In respective app directories

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is proprietary software developed by TechnovaTech.

## 🔗 Links

- **Repository**: https://github.com/TechnovaTech/Laundry-main.git
- **Issues**: https://github.com/TechnovaTech/Laundry-main/issues
- **Releases**: https://github.com/TechnovaTech/Laundry-main/releases

---

**Built with ❤️ by TechnovaTech Team**