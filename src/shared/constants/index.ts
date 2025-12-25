// Shared Constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
export const APP_NAME = process.env.REACT_APP_APP_NAME || 'Gujrat Book Shop Dashboard';

// Route paths
export const ROUTES = {
  DASHBOARD: '/dashboard',
  PRODUCTS: '/dashboard/products',
  PRODUCTS_NEW: '/dashboard/products/new',
  PRODUCTS_EDIT: (id: string) => `/dashboard/products/${id}/edit`,
  CATEGORIES: '/dashboard/categories',
  BRANDS: '/dashboard/brands',
  ORDERS: '/dashboard/orders',
  CUSTOMERS: '/dashboard/customers',
  INVENTORY: '/dashboard/inventory',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// Product statuses
export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;
