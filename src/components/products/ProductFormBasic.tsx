import React from 'react';
import { Product, Category, Brand } from '../../types';

interface ProductFormBasicProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  categories: Category[];
  brands: Brand[];
  materials?: Array<{ _id: string; name: string }>;
  occasions?: Array<{ _id: string; name: string }>;
  seasons?: Array<{ _id: string; name: string }>;
  colorFamilies?: Array<{ _id: string; name: string }>;
  patterns?: Array<{ _id: string; name: string }>;
  sleeveLengths?: Array<{ _id: string; name: string }>;
  necklines?: Array<{ _id: string; name: string }>;
  lengths?: Array<{ _id: string; name: string }>;
  fits?: Array<{ _id: string; name: string }>;
  ageGroups?: Array<{ _id: string; name: string }>;
  onFieldChange: (field: string, value: any) => void;
  onNestedFieldChange: (parentField: string, field: string, value: any) => void;
  onAddCategory?: () => void;
  onAddBrand?: () => void;
  onAddMaterial?: () => void;
  onAddOccasion?: () => void;
  onAddSeason?: () => void;
  onAddColorFamily?: () => void;
  onAddPattern?: () => void;
  onAddSleeveLength?: () => void;
  onAddNeckline?: () => void;
  onAddLength?: () => void;
  onAddFit?: () => void;
  onAddAgeGroup?: () => void;
}

const ProductFormBasic: React.FC<ProductFormBasicProps> = ({
  formData,
  errors,
  categories,
  brands,
  materials = [],
  occasions = [],
  seasons = [],
  colorFamilies = [],
  patterns = [],
  sleeveLengths = [],
  onFieldChange,
  onNestedFieldChange,
  onAddCategory,
  onAddBrand,
  onAddMaterial,
  onAddOccasion,
  onAddSeason,
  onAddColorFamily,
  onAddPattern,
  onAddSleeveLength,
}) => {
  // Helper function to extract ID from value (handles both objects and strings)
  const extractId = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && '_id' in value) return value._id;
    return '';
  };

  // Get category ID for select value
  const getCategoryValue = (): string => {
    if (Array.isArray(formData.categories)) {
      return formData.categories.length > 0 ? extractId(formData.categories[0]) : '';
    }
    return extractId(formData.categories);
  };

  // Get brand ID for select value
  const getBrandValue = (): string => {
    return extractId(formData.brand);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">General Information</h2>
        
        {/* Product Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          <p className="mt-1 text-sm text-gray-500">Use a clear, descriptive title (min 3 characters).</p>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU *
          </label>
          <input
            type="text"
            value={formData.sku || ''}
            onChange={(e) => onFieldChange('sku', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.sku ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter SKU"
          />
          <p className="mt-1 text-sm text-gray-500">Allowed: letters, numbers, dashes, underscores, and dots.</p>
          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onFieldChange('description', e.target.value)}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter product description"
          />
          <p className="mt-1 text-sm text-gray-500">Provide key details, materials, and care (min 20 characters).</p>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            value={formData.shortDescription || ''}
            onChange={(e) => onFieldChange('shortDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief product summary"
          />
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={getCategoryValue()}
              onChange={(e) => onFieldChange('categories', e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">Choose the most relevant category.</p>
            {errors.categories && (
              <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
            )}
            <button type="button" onClick={onAddCategory} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new category
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              value={getBrandValue()}
              onChange={(e) => onFieldChange('brand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">Optional but recommended for brand-aware shoppers.</p>
            <button type="button" onClick={onAddBrand} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new brand
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status || 'draft'}
            onChange={(e) => onFieldChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Active Status */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={(e) => onFieldChange('isActive', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Product is active</span>
          </label>
        </div>
      </div>

      {/* Stationery & Book Specific Fields */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Product Details</h2>
        
        {/* Row 1: Material, Collection, Use Case, Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material/Paper Type
            </label>
            <select
              value={formData.material || ''}
              onChange={(e) => onFieldChange('material', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Material</option>
              {materials.map((m) => (
                <option key={m._id} value={m.name}>{m.name}</option>
              ))}
            </select>
            <button type="button" onClick={onAddMaterial} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new material type
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection/Series
            </label>
            <input
              type="text"
              value={formData.collectionName || ''}
              onChange={(e) => onFieldChange('collectionName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Book Series Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Case
            </label>
            <select
              value={formData.useCase || ''}
              onChange={(e) => onFieldChange('useCase', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Use Case</option>
              {occasions.map(o => (
                <option key={o._id} value={o.name}>{o.name}</option>
              ))}
            </select>
            <button type="button" onClick={onAddOccasion} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new use case
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject || ''}
              onChange={(e) => onFieldChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Mathematics, Science"
            />
          </div>
        </div>

        {/* Row 2: Author, Publisher, Language, Binding Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author || ''}
              onChange={(e) => onFieldChange('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Author Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publisher
            </label>
            <input
              type="text"
              value={formData.publisher || ''}
              onChange={(e) => onFieldChange('publisher', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Publisher Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <input
              type="text"
              value={formData.language || ''}
              onChange={(e) => onFieldChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., English, Urdu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Binding Type
            </label>
            <select
              value={formData.bindingType || ''}
              onChange={(e) => onFieldChange('bindingType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Binding</option>
              <option value="Hardcover">Hardcover</option>
              <option value="Paperback">Paperback</option>
              <option value="Spiral">Spiral</option>
              <option value="Wire-O">Wire-O</option>
              <option value="Perfect Bound">Perfect Bound</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormBasic;
