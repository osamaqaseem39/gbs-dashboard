import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Brand } from '../../types';
import ImageUpload from '../common/ImageUpload';
import FieldWithTooltip from '../ui/FieldWithTooltip';
import { validateForm, commonRules } from '../../shared/utils/validations';
import { brandService } from '../../services/brandService';

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (brandData: Partial<Brand>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({
  brand,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    slug: brand?.slug || '',
    description: brand?.description || '',
    website: brand?.website || '',
    parentBrandId: (brand as any)?.parentBrandId || '',
    country: brand?.country || '',
    foundedYear: brand?.foundedYear?.toString() || '',
    industry: brand?.industry || '',
    level: brand?.level || 'main' as 'main' | 'sub',
    isFeatured: brand?.isFeatured ?? false,
    isActive: brand?.isActive ?? true,
    sortOrder: brand?.sortOrder?.toString() || '0',
    logoUrl: brand?.logo || brand?.logoUrl || '',
    colors: {
      primary: brand?.colors?.primary || '#3B82F6',
      secondary: brand?.colors?.secondary || '#1E40AF',
    },
  });

  const [parentBrands, setParentBrands] = useState<Brand[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadParentBrands = async () => {
      try {
        const res = await brandService.getBrands();
        if (res.success && res.data) {
          // Filter out current brand if editing
          const filtered = brand?._id 
            ? res.data.filter((b: Brand) => b._id !== brand._id)
            : res.data;
          setParentBrands(filtered);
        }
      } catch (error) {
        console.error('Error loading parent brands:', error);
      }
    };
    loadParentBrands();
  }, [brand]);

  const validateFormData = () => {
    const validationRules = {
      name: { ...commonRules.required, minLength: 2, maxLength: 100 },
      slug: { ...commonRules.slug },
      website: { url: true },
      foundedYear: {
        custom: (value: any) => {
          if (!value) return null;
          const year = parseInt(value);
          const currentYear = new Date().getFullYear();
          if (isNaN(year) || year < 1800 || year > currentYear) {
            return `Year must be between 1800 and ${currentYear}`;
          }
          return null;
        },
      },
      sortOrder: {
        custom: (value: any) => {
          if (!value) return null;
          const num = parseInt(value);
          if (isNaN(num) || num < 0) {
            return 'Sort order must be a non-negative number';
          }
          return null;
        },
      },
      parentBrandId: {
        custom: (value: any) => {
          if (formData.level === 'sub' && !value) {
            return 'Parent brand is required for sub-brands';
          }
          return null;
        },
      },
    };

    const result = validateForm(formData, validationRules);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      return;
    }

    const payload: any = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || undefined,
      website: formData.website.trim() || undefined,
      country: formData.country.trim() || undefined,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
      industry: formData.industry.trim() || undefined,
      level: formData.level,
      parentBrandId: formData.level === 'sub' && formData.parentBrandId ? formData.parentBrandId : undefined,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      sortOrder: parseInt(formData.sortOrder) || 0,
      colors: formData.colors,
    };

    if (formData.logoUrl && formData.logoUrl.trim() !== '') {
      payload.logo = formData.logoUrl.trim();
    }

    await onSubmit(payload);
  };

  const handleChange = (field: string, value: any) => {
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

  const handleColorChange = (colorType: 'primary' | 'secondary', value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value,
      },
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    handleChange('slug', slug);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {brand ? 'Edit Brand' : 'Add New Brand'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldWithTooltip
              label="Brand Name"
              required
              tooltip="The official name of the brand. This will be displayed to customers."
              error={errors.name}
              helpText="Use the official brand name (2-100 characters)"
            >
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter brand name"
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              label="Slug"
              required
              tooltip="URL-friendly version of the brand name. Used in product URLs. Auto-generated from name if left empty."
              error={errors.slug}
              helpText="Lowercase letters, numbers, and hyphens only"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className={`input-field flex-1 ${errors.slug ? 'border-red-300' : ''}`}
                  placeholder="brand-slug"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="btn btn-secondary whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </FieldWithTooltip>

            <FieldWithTooltip
              label="Website"
              tooltip="Official brand website URL. Must start with http:// or https://"
              error={errors.website}
            >
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className={`input-field ${errors.website ? 'border-red-300' : ''}`}
                placeholder="https://example.com"
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              label="Brand Level"
              tooltip="Main brand (top-level) or Sub brand (belongs to a parent brand)"
              error={errors.level}
            >
              <select
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value as 'main' | 'sub')}
                className="input-field"
              >
                <option value="main">Main Brand</option>
                <option value="sub">Sub Brand</option>
              </select>
            </FieldWithTooltip>

            {formData.level === 'sub' && (
              <FieldWithTooltip
                label="Parent Brand"
                required
                tooltip="Select the parent brand this sub-brand belongs to. Required for sub-brands."
                error={errors.parentBrandId}
                className="md:col-span-2"
              >
                <select
                  value={formData.parentBrandId}
                  onChange={(e) => handleChange('parentBrandId', e.target.value)}
                  className={`input-field ${errors.parentBrandId ? 'border-red-300' : ''}`}
                >
                  <option value="">Select parent brand</option>
                  {parentBrands
                    .filter(b => b.level === 'main')
                    .map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                </select>
              </FieldWithTooltip>
            )}

            <FieldWithTooltip
              label="Country"
              tooltip="Country of origin for the brand"
            >
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="input-field"
                placeholder="e.g., Pakistan, USA, UK"
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              label="Founded Year"
              tooltip="Year the brand was founded (1800 to current year)"
              error={errors.foundedYear}
            >
              <input
                type="number"
                value={formData.foundedYear}
                onChange={(e) => handleChange('foundedYear', e.target.value)}
                className={`input-field ${errors.foundedYear ? 'border-red-300' : ''}`}
                placeholder="e.g., 1990"
                min="1800"
                max={new Date().getFullYear()}
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              label="Industry"
              tooltip="Industry or sector this brand operates in"
            >
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                className="input-field"
                placeholder="e.g., Electronics, Fashion, Automotive"
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              label="Sort Order"
              tooltip="Display order for brand listing. Lower numbers appear first."
              error={errors.sortOrder}
            >
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                className={`input-field ${errors.sortOrder ? 'border-red-300' : ''}`}
                placeholder="0"
                min="0"
              />
            </FieldWithTooltip>
          </div>

          {/* Description */}
          <FieldWithTooltip
            label="Description"
            tooltip="Detailed description of the brand. This helps customers understand the brand better."
          >
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Enter brand description"
            />
          </FieldWithTooltip>

          {/* Brand Colors */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="input-field flex-1"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="input-field flex-1"
                    placeholder="#1E40AF"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Brand Logo */}
          <FieldWithTooltip
            label="Brand Logo"
            tooltip="Upload the brand logo. Recommended size: 200x200px. Formats: JPG, PNG, GIF, WebP"
          >
            <ImageUpload
              onImageUpload={(url) => handleChange('logoUrl', url)}
              onImageRemove={() => handleChange('logoUrl', '')}
              existingImages={formData.logoUrl ? [formData.logoUrl] : []}
              maxImages={1}
            />
          </FieldWithTooltip>

          {/* Status Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Brand</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
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
              {isLoading ? 'Saving...' : (brand ? 'Update Brand' : 'Create Brand')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandForm; 
