# Shoe Collection - Modern E-Commerce Website

A modern, fully functional e-commerce website for shoes built with React, Redux Toolkit, TailwindCSS, and Firebase.

## Features

### 🛍️ Core E-Commerce Features
- **Product Catalog**: Browse shoes by category with filtering and sorting
- **Shopping Cart**: Add, remove, and update quantities
- **Checkout Process**: Secure payment integration
- **User Authentication**: Email/password and social login (Google, Microsoft, Apple)
- **User Profiles**: Order history and wishlist management

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **TailwindCSS Styling**: Clean, modern interface
- **Framer Motion Animations**: Smooth transitions and interactions
- **Premium Design**: Professional e-commerce appearance

### 🔧 Technical Features
- **React 18**: Latest React features and hooks
- **Redux Toolkit**: Centralized state management
- **React Router**: Client-side routing
- **Firebase Auth**: Secure authentication
- **Protected Routes**: Authenticated user access
- **Mock API**: Product data simulation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Copy your Firebase config to `src/utils/firebase.js`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Hero.jsx        # Hero section
│   ├── ProductCard.jsx # Product display card
│   ├── CategoryCard.jsx# Category display card
│   ├── ProductList.jsx # Product grid with filtering
│   ├── Footer.jsx      # Footer component
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── Shop.jsx        # Product listing page
│   ├── ProductDetails.jsx # Individual product page
│   ├── Cart.jsx        # Shopping cart
│   ├── Checkout.jsx    # Checkout process
│   ├── Login.jsx       # User login
│   ├── Signup.jsx      # User registration
│   └── Profile.jsx     # User profile
├── store/              # Redux store and slices
│   ├── store.js        # Store configuration
│   ├── authSlice.js    # Authentication state
│   ├── cartSlice.js    # Shopping cart state
│   └── productsSlice.js# Product filtering state
├── utils/              # Utility functions
│   └── firebase.js     # Firebase configuration
├── App.jsx             # Main app component
└── index.js            # App entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Features Implementation

### Authentication
- Email/password registration and login
- Social authentication (Google, Microsoft, Apple)
- Protected routes for authenticated users
- User profile management

### Shopping Experience
- Product browsing with search and filters
- Category-based navigation
- Shopping cart with quantity management
- Secure checkout process
- Order history tracking

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Accessible design patterns

## Firebase Setup

1. **Create Firebase Project**
   - Go to Firebase Console
   - Create new project
   - Enable Authentication and Firestore

2. **Configure Authentication**
   - Enable Email/Password provider
   - Enable Google, Microsoft, and Apple providers
   - Configure OAuth settings

3. **Update Configuration**
   Replace the config in `src/utils/firebase.js` with your Firebase project settings.

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Technologies Used

- **Frontend**: React 18, Redux Toolkit, React Router
- **Styling**: TailwindCSS, Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore (ready for integration)
- **Icons**: React Icons (Feather Icons)
- **Build Tool**: Create React App

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Shoe Collection** - Premium footwear for every occasion 👟
