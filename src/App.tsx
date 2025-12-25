import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { CartProvider } from './contexts/CartContext';
import LoginForm from './components/auth/LoginForm';
import Register from './pages/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/products/Products';
import ProductFormPageWrapper from './pages/products/ProductFormPageWrapper';
import Categories from './pages/categories/Categories';
import Inventory from './pages/inventory/Inventory';
import ProductSetup from './pages/products/ProductSetup';
import Orders from './pages/orders/Orders';
import Customers from './pages/customers/Customers';
import Brands from './pages/brands/Brands';
import BrandFormPage from './pages/brands/BrandFormPage';
import CategoryFormPage from './pages/categories/CategoryFormPage';
import ColorFormPage from './pages/master-data/ColorFormPage';
import ColorsPage from './pages/master-data/ColorsPage';
import MaterialsPage from './pages/master-data/MaterialsPage';
import MaterialFormPage from './pages/master-data/MaterialFormPage';
import OccasionsPage from './pages/master-data/OccasionsPage';
import OccasionFormPage from './pages/master-data/OccasionFormPage';
import SeasonsPage from './pages/master-data/SeasonsPage';
import SeasonFormPage from './pages/master-data/SeasonFormPage';
import SizeFormPage from './pages/master-data/SizeFormPage';
import SizesPage from './pages/master-data/SizesPage';
import PatternsPage from './pages/master-data/PatternsPage';
import PatternFormPage from './pages/master-data/PatternFormPage';
import SleeveLengthsPage from './pages/master-data/SleeveLengthsPage';
import SleeveLengthFormPage from './pages/master-data/SleeveLengthFormPage';
import ColorFamiliesPage from './pages/master-data/ColorFamiliesPage';
import ColorFamilyFormPage from './pages/master-data/ColorFamilyFormPage';
import MasterDataPage from './pages/master-data/MasterDataPage';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/settings/Settings';
import DeliveryChargesPage from './pages/settings/DeliveryChargesPage';
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
  const { isAuthenticated, user } = useAuth();

  return (
    <CartProvider customerId={user?._id}>
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
    </CartProvider>
  );
};

// App Component with Providers
const App: React.FC = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
