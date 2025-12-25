import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { occasionService, MasterDataItem } from 'services/masterDataService';
import LoadingSpinner from 'components/ui/LoadingSpinner';

const OccasionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [occasions, setOccasions] = useState<MasterDataItem[]>([]);
  const [filteredOccasions, setFilteredOccasions] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<MasterDataItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadOccasions();
  }, []);

  useEffect(() => {
    filterOccasions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasions, searchQuery]);

  const loadOccasions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await occasionService.getAll();
      if (response.success && response.data) {
        setOccasions(response.data);
      } else {
        setError('Failed to load occasions');
      }
    } catch (err) {
      setError('Failed to load occasions');
      console.error('Error loading occasions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterOccasions = () => {
    if (!searchQuery.trim()) {
      setFilteredOccasions(occasions);
      return;
    }

    const filtered = occasions.filter(occasion =>
      occasion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (occasion.slug && occasion.slug.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (occasion.description && occasion.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredOccasions(filtered);
  };

  const handleDelete = async (occasion: MasterDataItem) => {
    try {
      setIsDeleting(true);
      const response = await occasionService.delete(occasion._id);
      if (response.success) {
        await loadOccasions();
        setDeleteConfirm(null);
      } else {
        throw new Error(response.message || 'Failed to delete occasion');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to delete occasion');
      console.error('Error deleting occasion:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (occasion: MasterDataItem) => {
    try {
      const response = await occasionService.update(occasion._id, { isActive: !occasion.isActive });
      if (response.success) {
        await loadOccasions();
      } else {
        throw new Error(response.message || 'Failed to update occasion status');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update occasion status');
      console.error('Error updating occasion status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Occasions</h1>
          <p className="text-gray-600">Manage occasions like Formal, Casual, Wedding, etc.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/occasions/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Occasion</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search occasions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Showing {filteredOccasions.length} of {occasions.length} occasions
        </div>
      </div>

      {/* Occasions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOccasions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No occasions found
                  </td>
                </tr>
              ) : (
                filteredOccasions.map((occasion) => (
                  <tr key={occasion._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{occasion.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">/{occasion.slug || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {occasion.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        occasion.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {occasion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(occasion)}
                          className="text-gray-400 hover:text-gray-600"
                          title={occasion.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {occasion.isActive ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/occasions/${occasion._id}/edit`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(occasion)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Occasion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OccasionsPage;

