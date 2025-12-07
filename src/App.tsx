import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { CartProvider } from './contexts/CartContext';
import LoginForm from './components/auth/LoginForm';
import Register from './pages/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductFormPageWrapper from './pages/ProductFormPageWrapper';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import ProductSetup from './pages/ProductSetup';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Brands from './pages/Brands';
import BrandFormPage from './pages/BrandFormPage';
import CategoryFormPage from './pages/CategoryFormPage';
import ColorFormPage from './pages/ColorFormPage';
import ColorsPage from './pages/ColorsPage';
import MaterialsPage from './pages/MaterialsPage';
import MaterialFormPage from './pages/MaterialFormPage';
import OccasionsPage from './pages/OccasionsPage';
import OccasionFormPage from './pages/OccasionFormPage';
import SeasonsPage from './pages/SeasonsPage';
import SeasonFormPage from './pages/SeasonFormPage';
import SizeFormPage from './pages/SizeFormPage';
import SizesPage from './pages/SizesPage';
import PatternsPage from './pages/PatternsPage';
import PatternFormPage from './pages/PatternFormPage';
import SleeveLengthsPage from './pages/SleeveLengthsPage';
import SleeveLengthFormPage from './pages/SleeveLengthFormPage';
import ColorFamiliesPage from './pages/ColorFamiliesPage';
import ColorFamilyFormPage from './pages/ColorFamilyFormPage';
import MasterDataPage from './pages/MasterDataPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DeliveryChargesPage from './pages/DeliveryChargesPage';
// Removed Cart, Checkout, Shop from dashboard

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductFormPageWrapper />} />
          <Route path="products/:id/edit" element={<ProductFormPageWrapper />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<CategoryFormPage />} />
          <Route path="categories/:id/edit" element={<CategoryFormPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="product-setup" element={<ProductSetup />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/new" element={<BrandFormPage />} />
          <Route path="brands/:id/edit" element={<BrandFormPage />} />
          
          {/* Master Data Routes */}
          <Route path="colors" element={<ColorsPage />} />
          <Route path="colors/new" element={<ColorFormPage />} />
          <Route path="colors/:id/edit" element={<ColorFormPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="materials/new" element={<MaterialFormPage />} />
          <Route path="materials/:id/edit" element={<MaterialFormPage />} />
          <Route path="occasions" element={<OccasionsPage />} />
          <Route path="occasions/new" element={<OccasionFormPage />} />
          <Route path="occasions/:id/edit" element={<OccasionFormPage />} />
          <Route path="seasons" element={<SeasonsPage />} />
          <Route path="seasons/new" element={<SeasonFormPage />} />
          <Route path="seasons/:id/edit" element={<SeasonFormPage />} />
          <Route path="sizes" element={<SizesPage />} />
          <Route path="sizes/new" element={<SizeFormPage />} />
          <Route path="sizes/:id/edit" element={<SizeFormPage />} />
          <Route path="patterns" element={<PatternsPage />} />
          <Route path="patterns/new" element={<PatternFormPage />} />
          <Route path="patterns/:id/edit" element={<PatternFormPage />} />
          <Route path="sleeve-lengths" element={<SleeveLengthsPage />} />
          <Route path="sleeve-lengths/new" element={<SleeveLengthFormPage />} />
          <Route path="sleeve-lengths/:id/edit" element={<SleeveLengthFormPage />} />
          <Route path="color-families" element={<ColorFamiliesPage />} />
          <Route path="color-families/new" element={<ColorFamilyFormPage />} />
          <Route path="color-families/:id/edit" element={<ColorFamilyFormPage />} />
          <Route path="master-data" element={<MasterDataPage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="delivery-charges" element={<DeliveryChargesPage />} />
        </Route>

        {/* Removed Shop, Cart, Checkout, and Order Confirmation routes */}

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

// App Component with Providers
const App: React.FC = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <CartProvider customerId="current-user-id" sessionId="session-id">
          <AppContent />
        </CartProvider>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
