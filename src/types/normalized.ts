// Normalized Types - Matching Backend Schemas

// ============================================
// User & Authentication
// ============================================

export interface User {
  _id: string;
  email: string;
  password?: string; // Only for creation/update
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  userType: 'customer' | 'admin';
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  _id: string;
  userId: string;
  role: 'admin' | 'super_admin';
  permissions?: string[];
  passwordChangedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  userId: string;
  loyaltyPoints: number;
  preferredCurrency: string;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  userId: string;
  addressType: 'billing' | 'shipping' | 'both';
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Product Catalog
// ============================================

export type ProductType = 'simple' | 'variable' | 'grouped' | 'external';
export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  type: ProductType;
  status: ProductStatus;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  manageStock: boolean;
  allowBackorders: boolean;
  categories: string[];
  tags: string[];
  brandId?: string;
  sizeChartId?: string;
  images: string[];
  seo?: ProductSEO;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPricing {
  _id: string;
  productId: string;
  basePrice: number;
  salePrice?: number;
  costPrice: number;
  currency: string;
  taxClassId?: string;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInventory {
  _id: string;
  productId: string;
  variationId?: string;
  warehouseId: string;
  size?: string;
  currentStock: number;
  reservedStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock?: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastRestocked?: string;
  lastSold?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttribute {
  _id: string;
  productId: string;
  attributeId: string;
  value: string | number | boolean;
  displayValue?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewSummary {
  _id: string;
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  slug?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  country?: string;
  foundedYear?: number;
  parentBrandId?: string;
  level: 'main' | 'sub';
  industry?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Order Management
// ============================================

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded' | 'failed';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed';

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled' | 'cancelled';
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  currency: string;
  billingAddressId: string;
  shippingAddressId: string;
  shippingMethodId?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  paymentMethodId?: string;
  couponId?: string;
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: string;
  variationId?: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Cart Management
// ============================================

export interface Cart {
  _id: string;
  customerId?: string;
  sessionId: string;
  items: string[]; // CartItem IDs
  total: number;
  currency: string;
  couponId?: string;
  expiresAt?: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  cartId: string;
  productId: string;
  variationId?: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Payment System
// ============================================

export interface PaymentMethod {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  requiresGateway: boolean;
  gatewayConfig?: Record<string, any>;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  gatewayFee?: number;
  netAmount: number;
  transactionId?: string;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, any>;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  refundAmount: number;
  refundReason?: string;
  refundedAt?: string;
  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Inventory Management
// ============================================

export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  contactPerson?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  _id: string;
  productId: string;
  variationId?: string;
  warehouseId: string;
  size?: string;
  currentStock: number;
  reservedStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock?: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastRestocked?: string;
  lastSold?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  _id: string;
  inventoryId: string;
  type: 'purchase' | 'sale' | 'return' | 'adjustment' | 'transfer' | 'damage' | 'expired';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  userId?: string;
  unitCost?: number;
  totalCost?: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Other Types (keep existing for compatibility)
// ============================================

export interface ProductVariant {
  _id: string;
  productId: string;
  sku?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  stockStatus: 'instock' | 'outofstock';
  attributes: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  _id: string;
  name: string;
  slug: string;
  type: 'select' | 'text' | 'number';
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface SizeChart {
  _id: string;
  name: string;
  description?: string;
  sizeType: 'numeric' | 'alphabetic' | 'custom';
  sizes: Array<{
    size: string;
    measurements: {
      bust?: string;
      waist?: string;
      hips?: string;
      shoulder?: string;
      sleeveLength?: string;
      length?: string;
      custom?: Record<string, string>;
    };
  }>;
  imageUrl?: string;
  imageAltText?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  _id: string;
  productId: string;
  variationId?: string;
  url: string;
  altText?: string;
  position: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

