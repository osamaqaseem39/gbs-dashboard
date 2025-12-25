import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from 'components/ui/LoadingSpinner';

interface WebhookTemplate {
  _id?: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  isActive: boolean;
}

const WebhookTemplateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [webhookTemplates, setWebhookTemplates] = useState<WebhookTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingWebhookTemplate, setEditingWebhookTemplate] = useState<WebhookTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'POST' as WebhookTemplate['method'],
    headers: {} as Record<string, string>,
    isActive: true,
  });
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');

  const methods = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newWebhookTemplate: WebhookTemplate = {
        _id: editingWebhookTemplate?._id || Date.now().toString(),
        name: formData.name.trim(),
        url: formData.url.trim(),
        method: formData.method,
        headers: formData.headers,
        isActive: formData.isActive,
      };

      if (editingWebhookTemplate) {
        setWebhookTemplates(webhookTemplates.map(w => w._id === editingWebhookTemplate._id ? newWebhookTemplate : w));
      } else {
        setWebhookTemplates([...webhookTemplates, newWebhookTemplate]);
      }

      setShowForm(false);
      setEditingWebhookTemplate(null);
      resetForm();
    } catch (error) {
      console.error('Error saving webhook template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (webhookTemplate: WebhookTemplate) => {
    setEditingWebhookTemplate(webhookTemplate);
    setFormData({
      name: webhookTemplate.name,
      url: webhookTemplate.url,
      method: webhookTemplate.method,
      headers: webhookTemplate.headers,
      isActive: webhookTemplate.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (webhookTemplateId: string) => {
    if (window.confirm('Are you sure you want to delete this webhook template?')) {
      setWebhookTemplates(webhookTemplates.filter(w => w._id !== webhookTemplateId));
    }
  };

  const addHeader = () => {
    if (newHeaderKey.trim() && newHeaderValue.trim()) {
      setFormData({
        ...formData,
        headers: {
          ...formData.headers,
          [newHeaderKey.trim()]: newHeaderValue.trim()
        }
      });
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...formData.headers };
    delete newHeaders[key];
    setFormData({
      ...formData,
      headers: newHeaders
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      method: 'POST',
      headers: {},
      isActive: true,
    });
    setNewHeaderKey('');
    setNewHeaderValue('');
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
          <h1 className="text-2xl font-bold text-gray-900">Webhook Template Management</h1>
        </div>
        <button
          onClick={() => {
            setEditingWebhookTemplate(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Webhook Template
        </button>
      </div>

      {/* Webhook Templates List */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Headers
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
              {webhookTemplates.map((webhookTemplate) => (
                <tr key={webhookTemplate._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{webhookTemplate.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {webhookTemplate.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-mono">{webhookTemplate.method}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Object.keys(webhookTemplate.headers).length} headers
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      webhookTemplate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {webhookTemplate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(webhookTemplate)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(webhookTemplate._id!)}
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
              {editingWebhookTemplate ? 'Edit Webhook Template' : 'Add New Webhook Template'}
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
                  placeholder="e.g., Order Webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="input-field"
                  placeholder="https://example.com/webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Method
                </label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({...formData, method: e.target.value as WebhookTemplate['method']})}
                  className="input-field"
                >
                  {methods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headers
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHeaderKey}
                      onChange={(e) => setNewHeaderKey(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Header Key"
                    />
                    <input
                      type="text"
                      value={newHeaderValue}
                      onChange={(e) => setNewHeaderValue(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Header Value"
                    />
                    <button
                      type="button"
                      onClick={addHeader}
                      className="btn btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(formData.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm font-mono">{key}: {value}</span>
                        <button
                          type="button"
                          onClick={() => removeHeader(key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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
                    setEditingWebhookTemplate(null);
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
                  {isLoading ? 'Saving...' : (editingWebhookTemplate ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookTemplateFormPage;
