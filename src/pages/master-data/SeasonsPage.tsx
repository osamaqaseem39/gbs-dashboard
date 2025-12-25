import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { seasonService, MasterDataItem } from 'services/masterDataService';
import LoadingSpinner from 'components/ui/LoadingSpinner';

const SeasonsPage: React.FC = () => {
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState<MasterDataItem[]>([]);
  const [filteredSeasons, setFilteredSeasons] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<MasterDataItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    filterSeasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasons, searchQuery]);

  const loadSeasons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await seasonService.getAll();
      if (response.success && response.data) {
        setSeasons(response.data);
      } else {
        setError('Failed to load seasons');
      }
    } catch (err) {
      setError('Failed to load seasons');
      console.error('Error loading seasons:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSeasons = () => {
    if (!searchQuery.trim()) {
      setFilteredSeasons(seasons);
      return;
    }

    const filtered = seasons.filter(season =>
      season.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (season.slug && season.slug.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (season.description && season.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredSeasons(filtered);
  };

  const handleDelete = async (season: MasterDataItem) => {
    try {
      setIsDeleting(true);
      const response = await seasonService.delete(season._id);
      if (response.success) {
        await loadSeasons();
        setDeleteConfirm(null);
      } else {
        throw new Error(response.message || 'Failed to delete season');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to delete season');
      console.error('Error deleting season:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (season: MasterDataItem) => {
    try {
      const response = await seasonService.update(season._id, { isActive: !season.isActive });
      if (response.success) {
        await loadSeasons();
      } else {
        throw new Error(response.message || 'Failed to update season status');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update season status');
      console.error('Error updating season status:', err);
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
          <h1 className="text-2xl font-bold text-gray-900">Seasons</h1>
          <p className="text-gray-600">Manage seasonal categories (Spring, Summer, Fall, Winter, etc.)</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/seasons/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Season</span>
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
            placeholder="Search seasons..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Showing {filteredSeasons.length} of {seasons.length} seasons
        </div>
      </div>

      {/* Seasons Table */}
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
              {filteredSeasons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No seasons found
                  </td>
                </tr>
              ) : (
                filteredSeasons.map((season) => (
                  <tr key={season._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{season.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">/{season.slug || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {season.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        season.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {season.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(season)}
                          className="text-gray-400 hover:text-gray-600"
                          title={season.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {season.isActive ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/seasons/${season._id}/edit`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(season)}
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Season</h3>
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

export default SeasonsPage;

