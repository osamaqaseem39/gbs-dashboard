import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface AdminRole {
  _id?: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
}

const AdminRoleFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAdminRole, setEditingAdminRole] = useState<AdminRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    isActive: true,
  });
  const [newPermission, setNewPermission] = useState('');

  const availablePermissions = [
    'products.create',
    'products.read',
    'products.update',
    'products.delete',
    'categories.create',
    'categories.read',
    'categories.update',
    'categories.delete',
    'brands.create',
    'brands.read',
    'brands.update',
    'brands.delete',
    'orders.read',
    'orders.update',
    'customers.read',
    'customers.update',
    'analytics.read',
    'settings.read',
    'settings.update'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newAdminRole: AdminRole = {
        _id: editingAdminRole?._id || Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        permissions: formData.permissions,
        isActive: formData.isActive,
      };

      if (editingAdminRole) {
        setAdminRoles(adminRoles.map(a => a._id === editingAdminRole._id ? newAdminRole : a));
      } else {
        setAdminRoles([...adminRoles, newAdminRole]);
      }

      setShowForm(false);
      setEditingAdminRole(null);
      resetForm();
    } catch (error) {
      console.error('Error saving admin role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (adminRole: AdminRole) => {
    setEditingAdminRole(adminRole);
    setFormData({
      name: adminRole.name,
      description: adminRole.description || '',
      permissions: adminRole.permissions,
      isActive: adminRole.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (adminRoleId: string) => {
    if (window.confirm('Are you sure you want to delete this admin role?')) {
      setAdminRoles(adminRoles.filter(a => a._id !== adminRoleId));
    }
  };

  const addPermission = () => {
    if (newPermission.trim() && !formData.permissions.includes(newPermission.trim())) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, newPermission.trim()]
      });
      setNewPermission('');
    }
  };

  const removePermission = (permission: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.filter(p => p !== permission)
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      isActive: true,
    });
    setNewPermission('');
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Role Management</h1>
        </div>
        <button
          onClick={() => {
            setEditingAdminRole(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Admin Role
        </button>
      </div>

      {/* Admin Roles List */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
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
              {adminRoles.map((adminRole) => (
                <tr key={adminRole._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{adminRole.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adminRole.permissions.length} permissions
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {adminRole.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      adminRole.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {adminRole.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(adminRole)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(adminRole._id!)}
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
              {editingAdminRole ? 'Edit Admin Role' : 'Add New Admin Role'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Super Admin, Manager, Editor"
                />
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
                  placeholder="Brief description of the admin role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={newPermission}
                      onChange={(e) => setNewPermission(e.target.value)}
                      className="input-field flex-1"
                    >
                      <option value="">Select a permission...</option>
                      {availablePermissions.map(permission => (
                        <option key={permission} value={permission}>
                          {permission}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addPermission}
                      className="btn btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {formData.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{permission}</span>
                        <button
                          type="button"
                          onClick={() => removePermission(permission)}
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
                    setEditingAdminRole(null);
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
                  {isLoading ? 'Saving...' : (editingAdminRole ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoleFormPage;
