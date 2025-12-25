import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { brandService } from '../services/brandService';
import type { Brand } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Modal from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const navigate = useNavigate();
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchTerm]);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await brandService.getBrands();
      if (response.success && response.data) {
        setBrands(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching brands:', err);
      setError(err.response?.data?.message || 'Failed to load brands');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBrand = async (brand: Brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;

    try {
      setIsDeleting(true);
      const response = await brandService.deleteBrand(brandToDelete._id);
      if (response.success) {
        setBrands(brands.filter(b => b._id !== brandToDelete._id));
        setShowDeleteModal(false);
        setBrandToDelete(null);
        setSuccessMessage('Brand deleted successfully');
        // Refresh the list from server to ensure consistency
        fetchBrands();
      }
    } catch (err: any) {
      console.error('Error deleting brand:', err);
      setError(err.response?.data?.message || 'Failed to delete brand');
    } finally {
      setIsDeleting(false);
    }
  };


  const handleEditBrand = (brand: Brand) => {
    navigate(`/dashboard/brands/${brand._id}/edit`);
  };

  const handleAddBrand = () => {
    navigate('/dashboard/brands/new');
  };

  const handleViewBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowBrandModal(true);
  };


  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (isLoading && brands.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error && brands.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchBrands}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product brands and manufacturers
          </p>
        </div>
        <button onClick={handleAddBrand} className="btn btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Brand
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex">
            <div className="ml-0">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brands table */}
      <div className="card">
        {brands.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No brands</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first brand.</p>
            <div className="mt-6">
              <button
                onClick={handleAddBrand}
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Brand
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
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
                {brands
                  .filter(brand => 
                    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    brand.country?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {brand.logo ? (
                            <img
                              className="h-12 w-12 rounded-md object-cover"
                              src={brand.logo}
                              alt={brand.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                              <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {brand.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {brand.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {brand.website ? (
                        <a 
                          href={brand.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {brand.website}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {brand.country || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(brand.isActive)}`}>
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewBrand(brand)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditBrand(brand)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Brand Details Modal */}
      {showBrandModal && selectedBrand && (
        <Modal
          isOpen={true}
          onClose={() => setShowBrandModal(false)}
          title={`Brand Details - ${selectedBrand.name}`}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Brand Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Name:</span> {selectedBrand.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Slug:</span> {selectedBrand.slug}
                  </p>
                  {selectedBrand.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Description:</span> {selectedBrand.description}
                    </p>
                  )}
                  {selectedBrand.website && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Website:</span> 
                      <a href={selectedBrand.website} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary-600 hover:text-primary-900">
                        {selectedBrand.website}
                      </a>
                    </p>
                  )}
                  {selectedBrand.country && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Country:</span> {selectedBrand.country}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBrand.isActive)}`}>
                    {selectedBrand.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {selectedBrand.logo && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Logo</h4>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <img
                    src={selectedBrand.logo}
                    alt={selectedBrand.name}
                    className="h-24 w-24 mx-auto rounded-md object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Brand"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{brandToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`btn btn-danger ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Brands;
