import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from 'components/ui/LoadingSpinner';

interface PushNotificationTemplate {
  _id?: string;
  name: string;
  title: string;
  body: string;
  type: 'order-confirmation' | 'order-shipped' | 'order-delivered' | 'welcome' | 'password-reset';
  isActive: boolean;
}

const PushNotificationTemplateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [pushNotificationTemplates, setPushNotificationTemplates] = useState<PushNotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPushNotificationTemplate, setEditingPushNotificationTemplate] = useState<PushNotificationTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    body: '',
    type: 'order-confirmation' as PushNotificationTemplate['type'],
    isActive: true,
  });

  const types = [
    { value: 'order-confirmation', label: 'Order Confirmation' },
    { value: 'order-shipped', label: 'Order Shipped' },
    { value: 'order-delivered', label: 'Order Delivered' },
    { value: 'welcome', label: 'Welcome' },
    { value: 'password-reset', label: 'Password Reset' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newPushNotificationTemplate: PushNotificationTemplate = {
        _id: editingPushNotificationTemplate?._id || Date.now().toString(),
        name: formData.name.trim(),
        title: formData.title.trim(),
        body: formData.body.trim(),
        type: formData.type,
        isActive: formData.isActive,
      };

      if (editingPushNotificationTemplate) {
        setPushNotificationTemplates(pushNotificationTemplates.map(p => p._id === editingPushNotificationTemplate._id ? newPushNotificationTemplate : p));
      } else {
        setPushNotificationTemplates([...pushNotificationTemplates, newPushNotificationTemplate]);
      }

      setShowForm(false);
      setEditingPushNotificationTemplate(null);
      resetForm();
    } catch (error) {
      console.error('Error saving push notification template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (pushNotificationTemplate: PushNotificationTemplate) => {
    setEditingPushNotificationTemplate(pushNotificationTemplate);
    setFormData({
      name: pushNotificationTemplate.name,
      title: pushNotificationTemplate.title,
      body: pushNotificationTemplate.body,
      type: pushNotificationTemplate.type,
      isActive: pushNotificationTemplate.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (pushNotificationTemplateId: string) => {
    if (window.confirm('Are you sure you want to delete this push notification template?')) {
      setPushNotificationTemplates(pushNotificationTemplates.filter(p => p._id !== pushNotificationTemplateId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      body: '',
      type: 'order-confirmation',
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
          <h1 className="text-2xl font-bold text-gray-900">Push Notification Template Management</h1>
        </div>
        <button
          onClick={() => {
            setEditingPushNotificationTemplate(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Push Notification Template
        </button>
      </div>

      {/* Push Notification Templates List */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
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
              {pushNotificationTemplates.map((pushNotificationTemplate) => (
                <tr key={pushNotificationTemplate._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{pushNotificationTemplate.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {pushNotificationTemplate.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="capitalize">{pushNotificationTemplate.type.replace('-', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pushNotificationTemplate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {pushNotificationTemplate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(pushNotificationTemplate)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pushNotificationTemplate._id!)}
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
              {editingPushNotificationTemplate ? 'Edit Push Notification Template' : 'Add New Push Notification Template'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Order Confirmation Push"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as PushNotificationTemplate['type']})}
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
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Order Confirmed!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body
                </label>
                <textarea
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({...formData, body: e.target.value})}
                  className="input-field"
                  rows={4}
                  placeholder="Enter the push notification body..."
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
                    setEditingPushNotificationTemplate(null);
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
                  {isLoading ? 'Saving...' : (editingPushNotificationTemplate ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationTemplateFormPage;
