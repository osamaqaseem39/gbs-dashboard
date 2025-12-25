import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  TruckIcon, 
  HomeIcon,
  ShoppingBagIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { orderService } from 'services/orderService';
import { Order } from 'types';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import ErrorMessage from 'components/ui/ErrorMessage';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await orderService.getOrder(orderId!);
      if (response.success && response.data) {
        setOrder(response.data.order);
      } else {
        setError('Order not found');
      }
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchOrder}
      />
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <p className="mt-2 text-gray-500">The order you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 btn btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your order. We've received your order and will process it shortly.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Order Number:</dt>
                  <dd className="text-sm font-medium text-gray-900">#{order.orderNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Order Date:</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Status:</dt>
                  <dd className="text-sm">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Payment Status:</dt>
                  <dd className="text-sm">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Payment Method:</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.paymentMethod}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Total Amount:</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Name:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.userId?.firstName} {order.userId?.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Email:</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.userId?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Phone:</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.userId?.phone || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {order.items?.map((item, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    typeof item.product?.images?.[0] === 'string' 
                      ? item.product.images[0] 
                      : item.product?.images?.[0]?.url || '/placeholder-product.png'
                  }
                  alt={item.product?.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  {item.variantId && (
                    <p className="text-sm text-gray-500">Variant: {item.variantId.name || item.variantId.sku}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
          </div>
          <div className="p-6">
            <div className="text-sm text-gray-900">
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              {order.shippingAddress.company && (
                <p>{order.shippingAddress.company}</p>
              )}
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-4">What's Next?</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Order Processing:</strong> We'll prepare your order for shipment.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Shipping:</strong> You'll receive a tracking number once your order ships.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">3</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Delivery:</strong> Your order will arrive at your specified address.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/shop')}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          <TruckIcon className="h-5 w-5" />
          View All Orders
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn btn-outline flex items-center justify-center gap-2"
        >
          <HomeIcon className="h-5 w-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
