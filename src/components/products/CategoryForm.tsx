import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Category } from '../../types';
import ImageUpload from '../common/ImageUpload';
import FieldWithTooltip from '../ui/FieldWithTooltip';
import { validateForm, commonRules } from '../../shared/utils/validations';

interface CategoryFormProps {
  category?: Category;
  parentCategories: Category[];
  onSubmit: (categoryData: Partial<Category>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  parentCategories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parentId: category?.parentId || '',
    isActive: category?.isActive ?? true,
    sortOrder: category?.sortOrder?.toString() || '0',
    image: category?.image || '',
    icon: category?.icon || '',
    color: category?.color || '',
    metaTitle: category?.metaTitle || '',
    metaDescription: category?.metaDescription || '',
    metaKeywords: category?.metaKeywords?.join(', ') || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when category prop changes (e.g., after async load)
  useEffect(() => {
    if (category && category._id) {
      console.log('CategoryForm: Updating form with category:', category);
      // Handle parentId - it might be a string or an object with _id
      let parentId = '';
      if (category.parentId) {
        parentId = typeof category.parentId === 'string' 
          ? category.parentId 
          : (category.parentId as any)?._id || '';
      }
      
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        parentId: parentId,
        isActive: (category as any).isActive !== undefined ? (category as any).isActive : true,
        sortOrder: (category as any).sortOrder?.toString() || '0',
        image: category.image || '',
        icon: (category as any).icon || '',
        color: (category as any).color || '',
        metaTitle: (category as any).metaTitle || '',
        metaDescription: (category as any).metaDescription || '',
        metaKeywords: (category as any).metaKeywords?.join(', ') || '',
      });
    } else if (!category) {
      // Reset form for new category
      setFormData({
        name: '',
        slug: '',
        description: '',
        parentId: '',
        isActive: true,
        sortOrder: '0',
        image: '',
        icon: '',
        color: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      });
    }
  }, [category]);

  const validateFormData = () => {
    const validationRules = {
      name: { ...commonRules.required, minLength: 2, maxLength: 100 },
      slug: { ...commonRules.slug },
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

    const categoryData: any = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
      sortOrder: parseInt(formData.sortOrder) || 0,
    };

    if (formData.parentId && formData.parentId.trim() !== '') {
      categoryData.parentId = formData.parentId;
    }

    if (formData.image && formData.image.trim() !== '') {
      categoryData.image = formData.image.trim();
    }

    if (formData.icon && formData.icon.trim() !== '') {
      categoryData.icon = formData.icon.trim();
    }

    if (formData.color && formData.color.trim() !== '') {
      categoryData.color = formData.color.trim();
    }

    if (formData.metaTitle && formData.metaTitle.trim() !== '') {
      categoryData.metaTitle = formData.metaTitle.trim();
    }

    if (formData.metaDescription && formData.metaDescription.trim() !== '') {
      categoryData.metaDescription = formData.metaDescription.trim();
    }

    if (formData.metaKeywords && formData.metaKeywords.trim() !== '') {
      categoryData.metaKeywords = formData.metaKeywords.split(',').map(k => k.trim()).filter(k => k);
    }

    await onSubmit(categoryData);
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          type="button"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldWithTooltip
              label="Category Name"
              required
              tooltip="The name of the category as it will appear to customers"
              error={errors.name}
              helpText="Use a clear, descriptive name (2-100 characters)"
            >
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter category name"
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              label="Slug"
              required
              tooltip="URL-friendly version of the category name. Used in category URLs. Auto-generated from name if left empty."
              error={errors.slug}
              helpText="Lowercase letters, numbers, and hyphens only"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className={`input-field flex-1 ${errors.slug ? 'border-red-300' : ''}`}
                  placeholder="category-slug"
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
          </div>

          <FieldWithTooltip
            label="Parent Category"
            tooltip="Select a parent category to create a subcategory. Leave empty for a top-level category."
          >
            <select
              value={formData.parentId}
              onChange={(e) => handleChange('parentId', e.target.value)}
              className="input-field"
            >
              <option value="">No Parent (Top Level)</option>
              {parentCategories
                .filter(cat => cat._id !== category?._id)
                .map((parentCategory) => (
                  <option key={parentCategory._id} value={parentCategory._id}>
                    {parentCategory.name}
                  </option>
                ))}
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Description"
            tooltip="Detailed description of the category. Helps customers understand what products belong here."
          >
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Enter category description"
            />
          </FieldWithTooltip>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldWithTooltip
              label="Sort Order"
              tooltip="Display order for category listing. Lower numbers appear first."
              error={errors.sortOrder}
            >
              <input
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                className={`input-field ${errors.sortOrder ? 'border-red-300' : ''}`}
                placeholder="0"
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              label="Category Color"
              tooltip="Color code for UI display (hex format, e.g., #3B82F6)"
            >
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color || '#3B82F6'}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="input-field flex-1"
                  placeholder="#3B82F6"
                />
              </div>
            </FieldWithTooltip>
          </div>

          <FieldWithTooltip
            label="Category Image"
            tooltip="Upload a representative image for this category. Recommended size: 400x400px"
          >
            <ImageUpload
              existingImages={formData.image ? [formData.image] : []}
              maxImages={1}
              onImageUpload={(url) => handleChange('image', url)}
              onImageRemove={() => handleChange('image', '')}
            />
          </FieldWithTooltip>

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <FieldWithTooltip
                label="Meta Title"
                tooltip="SEO title for search engines. If empty, category name will be used."
              >
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  className="input-field"
                  placeholder="SEO title (optional)"
                />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Meta Description"
                tooltip="SEO description for search engines. Should be 150-160 characters."
              >
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="SEO description (optional)"
                  maxLength={160}
                />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Meta Keywords"
                tooltip="Comma-separated keywords for SEO (e.g., books, stationery, school supplies)"
              >
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                  className="input-field"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </FieldWithTooltip>
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Category is Active</span>
            </label>
            <p className="text-xs text-gray-500 ml-6 mt-1">
              Inactive categories won't be visible to customers
            </p>
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
              {isLoading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
    </div>
  );
};

export default CategoryForm; 
