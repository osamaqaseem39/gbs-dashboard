import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface OrderAlert {
  _id?: string;
  name: string;
  description?: string;
  type: 'new-order' | 'order-update' | 'payment-received' | 'shipping-update';
  isActive: boolean;
}

const OrderAlertFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [orderAlerts, setOrderAlerts] = useState<OrderAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOrderAlert, setEditingOrderAlert] = useState<OrderAlert | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'new-order' as OrderAlert['type'],
    isActive: true,
  });

  const types = [
    { value: 'new-order', label: 'New Order' },
    { value: 'order-update', label: 'Order Update' },
    { value: 'payment-received', label: 'Payment Received' },
    { value: 'shipping-update', label: 'Shipping Update' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newOrderAlert: OrderAlert = {
        _id: editingOrderAlert?._id || Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        isActive: formData.isActive,
      };

      if (editingOrderAlert) {
        setOrderAlerts(orderAlerts.map(o => o._id === editingOrderAlert._id ? newOrderAlert : o));
      } else {
        setOrderAlerts([...orderAlerts, newOrderAlert]);
      }

      setShowForm(false);
      setEditingOrderAlert(null);
      resetForm();
    } catch (error) {
      console.error('Error saving order alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (orderAlert: OrderAlert) => {
    setEditingOrderAlert(orderAlert);
    setFormData({
      name: orderAlert.name,
      description: orderAlert.description || '',
      type: orderAlert.type,
      isActive: orderAlert.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (orderAlertId: string) => {
    if (window.confirm('Are you sure you want to delete this order alert?')) {
      setOrderAlerts(orderAlerts.filter(o => o._id !== orderAlertId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'new-order',
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Settings
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Order Alert Management</h1>
        </div>
        <button
          onClick={() => {
            setEditingOrderAlert(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Order Alert
        </button>
      </div>

      {/* Order Alerts List */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alert
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderAlerts.map((orderAlert) => (
                <tr key={orderAlert._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{orderAlert.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="capitalize">{orderAlert.type.replace('-', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {orderAlert.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      orderAlert.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {orderAlert.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(orderAlert)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(orderAlert._id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingOrderAlert ? 'Edit Order Alert' : 'Add New Order Alert'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="e.g., New Order Alert, Payment Received Alert"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as OrderAlert['type']})}
                  className="input-field"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Brief description of the order alert..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingOrderAlert(null);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (editingOrderAlert ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAlertFormPage;
