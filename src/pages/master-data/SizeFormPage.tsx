import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import ErrorMessage from 'components/ui/ErrorMessage';
import { sizeService, Size } from 'services/masterDataService';

const SizeFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [size, setSize] = useState<Size | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sizeType: 'numeric' as 'numeric' | 'alphabetic' | 'custom',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEditing && id) {
        const response = await sizeService.getById(id);
        if (response.success && response.data) {
          setSize(response.data);
          setFormData({
            name: response.data.name,
            description: response.data.description || '',
            sizeType: response.data.sizeType || 'numeric',
            isActive: response.data.isActive ?? true,
          });
        } else {
          setError('Size not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching size:', err);
      setError(err.response?.data?.message || 'Failed to load size');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Size name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Size description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const sizeData: any = {
        name: formData.name.trim(),
        isActive: formData.isActive,
      };
      
      // Only include description if it's provided
      if (formData.description && formData.description.trim()) {
        sizeData.description = formData.description.trim();
      }
      
      // Only include sizeType if it's provided
      if (formData.sizeType) {
        sizeData.sizeType = formData.sizeType;
      }

      let response;
      if (isEditing && id) {
        response = await sizeService.update(id, sizeData);
      } else {
        response = await sizeService.create(sizeData);
      }

      if (response.success) {
        navigate('/dashboard/sizes');
      } else {
        const errorMessage = response.message || 'Failed to save size';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Error saving size:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Failed to save size. Please check the console for more details.';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!size?._id) return;
    
    if (window.confirm('Are you sure you want to delete this size? This action cannot be undone.')) {
      try {
        setIsSaving(true);
        const response = await sizeService.delete(size._id);
        if (response.success) {
          navigate('/dashboard/sizes');
        } else {
          throw new Error(response.message || 'Failed to delete size');
        }
      } catch (err: any) {
        console.error('Error deleting size:', err);
        setError(err.response?.data?.message || 'Failed to delete size');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !size && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/master-data')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Master Data
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Size' : 'Add New Size'}
              </h1>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              {isEditing && (
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </button>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Size Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter size name (e.g., Small, Medium, Large, 32, 34)"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Size Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Type
                </label>
                <select
                  value={formData.sizeType}
                  onChange={(e) => handleFieldChange('sizeType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="numeric">Numeric (e.g., 32, 34, 36)</option>
                  <option value="alphabetic">Alphabetic (e.g., S, M, L, XL)</option>
                  <option value="custom">Custom (e.g., One Size, Free Size)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Choose the type of sizing system for this size
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe the size, measurements, and fit information..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Provide detailed information about measurements and fit for this size
                </p>
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Active (this size will be available for selection)
                  </span>
                </label>
              </div>

              {/* Size Examples */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Common Size Examples
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>• Small (S)</div>
                  <div>• Medium (M)</div>
                  <div>• Large (L)</div>
                  <div>• Extra Large (XL)</div>
                  <div>• 32</div>
                  <div>• 34</div>
                  <div>• 36</div>
                  <div>• 38</div>
                  <div>• One Size</div>
                </div>
              </div>
            </form>
          </div>

          {/* Bottom Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {isEditing ? 'Update size information' : 'Create a new size for your products'}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/master-data')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : (isEditing ? 'Update Size' : 'Create Size')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeFormPage;