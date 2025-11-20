import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ProductFilters as ProductFiltersType } from '../../types';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onClose?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<ProductFiltersType>(filters);

  const handleFilterChange = (key: keyof ProductFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleArrayFilterChange = (key: keyof ProductFiltersType, value: string, checked: boolean) => {
    const currentValue = localFilters[key];
    const currentArray = Array.isArray(currentValue) ? currentValue as string[] : [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const clearFilters = () => {
    const clearedFilters: ProductFiltersType = {
      search: localFilters.search,
      page: localFilters.page || 1,
      limit: localFilters.limit || 10,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const filterOptions = {
    materials: ['Cotton', 'Polyester', 'Paper', 'Cardboard', 'Plastic', 'Leather', 'Fabric'],
    useCases: ['Educational', 'Professional', 'Personal', 'Art', 'Office', 'School'],
    seasons: ['Summer', 'Winter', 'Spring', 'Fall', 'All Season'],
    colorFamilies: ['Pastels', 'Brights', 'Neutrals', 'Dark', 'Earthy', 'Jewel Tones'],
    patterns: ['Solid', 'Floral', 'Geometric', 'Abstract', 'Striped', 'Polka Dot', 'Plain'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'A4', 'A5', 'Letter', 'Legal'],
    boards: [
      'O-Levels Cambridge',
      'A-Levels Cambridge',
      'Matric Punjab Board',
      'Matric Sindh Board',
      'Matric KPK Board',
      'Matric Balochistan Board',
      'Federal Board',
      'IB (International Baccalaureate)',
    ],
    classLevels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Grade 11', 'Grade 12'],
    uniformTypes: ['School Uniform', 'Sports Uniform', 'House Uniform', 'Formal Uniform'],
    genders: ['Boys', 'Girls', 'Unisex'],
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-6 border w-full max-w-6xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Filter Products</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Material */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Material</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.materials.map((material) => (
                  <label key={material} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).materials || []).includes(material)}
                      onChange={(e) => handleArrayFilterChange('materials', material, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Use Case */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Use Case</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.useCases.map((useCase) => (
                  <label key={useCase} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).useCases || []).includes(useCase)}
                      onChange={(e) => handleArrayFilterChange('useCases', useCase, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{useCase}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Season</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.seasons.map((season) => (
                  <label key={season} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).seasons || []).includes(season)}
                      onChange={(e) => handleArrayFilterChange('seasons', season, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{season}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Family */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Color Family</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.colorFamilies.map((color) => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).colorFamilies || []).includes(color)}
                      onChange={(e) => handleArrayFilterChange('colorFamilies', color, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pattern */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Pattern</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.patterns.map((pattern) => (
                  <label key={pattern} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).patterns || []).includes(pattern)}
                      onChange={(e) => handleArrayFilterChange('patterns', pattern, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{pattern}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Educational Board */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Educational Board</h3>
              <div className="grid grid-cols-1 gap-2">
                {filterOptions.boards.map((board) => (
                  <label key={board} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).boards || []).includes(board)}
                      onChange={(e) => handleArrayFilterChange('boards', board, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{board}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Class Level */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Class/Grade Level</h3>
              <div className="grid grid-cols-3 gap-2">
                {filterOptions.classLevels.map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).gradeLevels || []).includes(level)}
                      onChange={(e) => handleArrayFilterChange('gradeLevels', level, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Uniform Type */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Uniform Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.uniformTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).uniformTypes || []).includes(type)}
                      onChange={(e) => handleArrayFilterChange('uniformTypes', type, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender (for uniforms) */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Gender</h3>
              <div className="grid grid-cols-3 gap-2">
                {filterOptions.genders.map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).genders || []).includes(gender)}
                      onChange={(e) => handleArrayFilterChange('genders', gender, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Available Sizes</h3>
              <div className="grid grid-cols-4 gap-2">
                {filterOptions.sizes.map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={((localFilters as any).sizes || []).includes(size)}
                      onChange={(e) => handleArrayFilterChange('sizes', size, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Features */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Special Features</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.isUniform || false}
                    onChange={(e) => handleFilterChange('isUniform', e.target.checked || undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Uniforms</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.isBookSet || false}
                    onChange={(e) => handleFilterChange('isBookSet', e.target.checked || undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Book Sets</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.isLimitedEdition || false}
                    onChange={(e) => handleFilterChange('isLimitedEdition', e.target.checked || undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Limited Edition</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.isCustomMade || false}
                    onChange={(e) => handleFilterChange('isCustomMade', e.target.checked || undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Custom Made</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t mt-8">
          <button
            onClick={clearFilters}
            className="btn btn-secondary"
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            className="btn btn-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
