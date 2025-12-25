import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import ErrorMessage from 'components/ui/ErrorMessage';
import { colorService, Color } from 'services/masterDataService';
import ImageUpload from 'components/common/ImageUpload';

const ColorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [color, setColor] = useState<Color | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
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
        const response = await colorService.getById(id);
        if (response.success && response.data) {
          setColor(response.data);
          setFormData({
            name: response.data.name,
            imageUrl: response.data.imageUrl || '',
            isActive: response.data.isActive ?? true,
          });
        } else {
          setError('Color not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching color:', err);
      setError(err.response?.data?.message || 'Failed to load color');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Color name is required';
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Color image is required';
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

      const colorData: any = {
        name: formData.name.trim(),
        imageUrl: formData.imageUrl.trim(), // Required - validation ensures it exists
        isActive: formData.isActive,
      };

      let response;
      if (isEditing && id) {
        response = await colorService.update(id, colorData);
      } else {
        response = await colorService.create(colorData);
      }

      if (response.success) {
        navigate('/dashboard/colors');
      } else {
        const errorMessage = response.message || 'Failed to save color';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Error saving color:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Failed to save color. Please check the console for more details.';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!color?._id) return;
    
    if (window.confirm('Are you sure you want to delete this color? This action cannot be undone.')) {
      try {
        setIsSaving(true);
        const response = await colorService.delete(color._id);
        if (response.success) {
          navigate('/dashboard/colors');
        } else {
          throw new Error(response.message || 'Failed to delete color');
        }
      } catch (err: any) {
        console.error('Error deleting color:', err);
        setError(err.response?.data?.message || 'Failed to delete color');
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

  if (error && !color && isEditing) {
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
                {isEditing ? 'Edit Color' : 'Add New Color'}
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
              {/* Color Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter color name (e.g., Red, Blue, Navy)"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Color Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Image *
                </label>
                <ImageUpload
                  onImageUpload={(url) => handleFieldChange('imageUrl', url)}
                  onImageRemove={(index) => {
                    if (index === 0) {
                      handleFieldChange('imageUrl', '');
                    }
                  }}
                  existingImages={formData.imageUrl ? [formData.imageUrl] : []}
                  maxImages={1}
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Upload an image that represents this color (e.g., a color swatch)
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
                    Active (this color will be available for selection)
                  </span>
                </label>
              </div>

              {/* Color Preview */}
              {formData.imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="w-16 h-16 rounded border border-gray-300 overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt={formData.name || 'Color preview'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{formData.name || 'Color Name'}</p>
                      <p className="text-sm text-gray-500">Image uploaded</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Bottom Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {isEditing ? 'Update color information' : 'Create a new color for your products'}
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
                  {isSaving ? 'Saving...' : (isEditing ? 'Update Color' : 'Create Color')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorFormPage;