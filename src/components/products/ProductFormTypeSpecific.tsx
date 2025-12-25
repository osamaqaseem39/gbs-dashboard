import React from 'react';
import { Product } from '../../types';

interface ProductFormTypeSpecificProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  onNestedFieldChange: (parentField: string, field: string, value: any) => void;
  categories: Array<{ _id: string; name: string }>;
  materials?: Array<{ _id: string; name: string }>;
  colorFamilies?: Array<{ _id: string; name: string }>;
  patterns?: Array<{ _id: string; name: string }>;
  ageGroups?: Array<{ _id: string; name: string }>;
  products?: Array<{ _id: string; name: string }>;
}

const ProductFormTypeSpecific: React.FC<ProductFormTypeSpecificProps> = ({
  formData,
  errors,
  onFieldChange,
  onNestedFieldChange,
  categories = [],
  materials = [],
  colorFamilies = [],
  patterns = [],
  ageGroups = [],
  products = [],
}) => {
  // Determine product type from category or explicit flag
  const category = categories.find(cat => {
    const categoryIds = Array.isArray(formData.categories) 
      ? formData.categories.map(c => typeof c === 'string' ? c : (c as any)?._id || '')
      : formData.categories ? [typeof formData.categories === 'string' ? formData.categories : (formData.categories as any)?._id || ''] : [];
    return categoryIds.includes(cat._id);
  });
  
  const categoryName = category?.name?.toLowerCase() || '';
  const isUniform = formData.isUniform || categoryName.includes('uniform');
  const isBook = categoryName.includes('book') || formData.isBookSet;
  const isStationery = categoryName.includes('stationery') || categoryName.includes('stationary') || categoryName.includes('notebook') || categoryName.includes('pen');

  // Render based on product type
  if (isUniform) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Uniform Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <input
                  type="checkbox"
                  checked={formData.isUniform || false}
                  onChange={(e) => onFieldChange('isUniform', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                This is a uniform product
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Uniform Type</label>
              <select
                value={formData.uniformType || ''}
                onChange={(e) => onFieldChange('uniformType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Uniform Type</option>
                <option value="school">School Uniform</option>
                <option value="sports">Sports Uniform</option>
                <option value="formal">Formal Uniform</option>
                <option value="casual">Casual Uniform</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender || ''}
                onChange={(e) => onFieldChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Uniform Size</label>
              <input
                type="text"
                value={formData.uniformSize || ''}
                onChange={(e) => onFieldChange('uniformSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., S, M, L, XL"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isBook) {
    const isBookSet = formData.isBookSet || false;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Book Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => onFieldChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
              <input
                type="text"
                value={formData.publisher || ''}
                onChange={(e) => onFieldChange('publisher', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter publisher name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
              <input
                type="text"
                value={formData.isbn || ''}
                onChange={(e) => onFieldChange('isbn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ISBN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Edition</label>
              <input
                type="text"
                value={formData.edition || ''}
                onChange={(e) => onFieldChange('edition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1st Edition, 2024 Edition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Count</label>
              <input
                type="number"
                value={formData.pageCount || ''}
                onChange={(e) => onFieldChange('pageCount', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter page count"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <input
                type="text"
                value={formData.language || ''}
                onChange={(e) => onFieldChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., English, Urdu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Binding Type</label>
              <select
                value={formData.bindingType || ''}
                onChange={(e) => onFieldChange('bindingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Binding Type</option>
                <option value="hardcover">Hardcover</option>
                <option value="paperback">Paperback</option>
                <option value="spiral">Spiral Bound</option>
                <option value="perfect">Perfect Bound</option>
                <option value="saddle">Saddle Stitch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject || ''}
                onChange={(e) => onFieldChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subject"
              />
            </div>
            {ageGroups.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <select
                  value={formData.ageGroup || ''}
                  onChange={(e) => onFieldChange('ageGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Age Group</option>
                  {ageGroups.map((ag) => (
                    <option key={ag._id} value={ag._id}>
                      {ag.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <input
                type="text"
                value={formData.gradeLevel || ''}
                onChange={(e) => onFieldChange('gradeLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Grade 1, Class 5"
              />
            </div>
          </div>
        </div>

        {/* Book Set Fields */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Book Set Information</h2>
          <div className="space-y-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isBookSet}
                  onChange={(e) => onFieldChange('isBookSet', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">This is a book set</span>
              </label>
            </div>

            {isBookSet && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Book Set Type</label>
                    <select
                      value={formData.bookSetType || ''}
                      onChange={(e) => onFieldChange('bookSetType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Set Type</option>
                      <option value="class">Class Level</option>
                      <option value="school">School Specific</option>
                      <option value="subject">Subject Based</option>
                      <option value="custom">Custom Set</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
                    <input
                      type="text"
                      value={formData.classLevel || ''}
                      onChange={(e) => onFieldChange('classLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Class 1, Grade 5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                    <input
                      type="text"
                      value={formData.schoolName || ''}
                      onChange={(e) => onFieldChange('schoolName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter school name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Board</label>
                    <select
                      value={formData.board || ''}
                      onChange={(e) => onFieldChange('board', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Board</option>
                      <option value="O-Levels Cambridge">O-Levels Cambridge</option>
                      <option value="Matric Punjab Board">Matric Punjab Board</option>
                      <option value="A-Levels">A-Levels</option>
                      <option value="Federal Board">Federal Board</option>
                      <option value="Sindh Board">Sindh Board</option>
                      <option value="KPK Board">KPK Board</option>
                      <option value="Balochistan Board">Balochistan Board</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Books in Set</label>
                  <div className="space-y-4">
                    {(formData.setItems || []).map((item, index) => (
                      <div key={index} className="flex gap-4 items-start p-4 border border-gray-200 rounded-md">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Book Name *</label>
                            <input
                              type="text"
                              value={item.bookName}
                              onChange={(e) => {
                                const newItems = [...(formData.setItems || [])];
                                newItems[index].bookName = e.target.value;
                                onFieldChange('setItems', newItems);
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                              placeholder="Book name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                            <input
                              type="text"
                              value={item.subject || ''}
                              onChange={(e) => {
                                const newItems = [...(formData.setItems || [])];
                                newItems[index].subject = e.target.value;
                                onFieldChange('setItems', newItems);
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                              placeholder="Subject"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...(formData.setItems || [])];
                                newItems[index].quantity = parseInt(e.target.value) || 1;
                                onFieldChange('setItems', newItems);
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                              min="1"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = (formData.setItems || []).filter((_, i) => i !== index);
                            onFieldChange('setItems', newItems);
                          }}
                          className="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = [...(formData.setItems || []), { bookName: '', quantity: 1 }];
                        onFieldChange('setItems', newItems);
                      }}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
                    >
                      + Add Book
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isStationery) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Stationery Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materials.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <select
                  value={formData.material || ''}
                  onChange={(e) => onFieldChange('material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Material</option>
                  {materials.map((mat) => (
                    <option key={mat._id} value={mat._id}>
                      {mat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <input
                type="text"
                value={formData.format || ''}
                onChange={(e) => onFieldChange('format', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., A4, A5, Letter"
              />
            </div>
            {colorFamilies.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Family</label>
                <select
                  value={formData.colorFamily || ''}
                  onChange={(e) => onFieldChange('colorFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Color Family</option>
                  {colorFamilies.map((cf) => (
                    <option key={cf._id} value={cf._id}>
                      {cf.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {patterns.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                <select
                  value={formData.pattern || ''}
                  onChange={(e) => onFieldChange('pattern', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Pattern</option>
                  {patterns.map((pat) => (
                    <option key={pat._id} value={pat._id}>
                      {pat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Collection Name</label>
              <input
                type="text"
                value={formData.collectionName || ''}
                onChange={(e) => onFieldChange('collectionName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter collection name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Use Case</label>
              <input
                type="text"
                value={formData.useCase || ''}
                onChange={(e) => onFieldChange('useCase', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter use case"
              />
            </div>
            {ageGroups.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <select
                  value={formData.ageGroup || ''}
                  onChange={(e) => onFieldChange('ageGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Age Group</option>
                  {ageGroups.map((ag) => (
                    <option key={ag._id} value={ag._id}>
                      {ag.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Features</label>
              <input
                type="text"
                value={Array.isArray(formData.specialFeatures) ? formData.specialFeatures.join(', ') : (formData.specialFeatures as any) || ''}
                onChange={(e) => {
                  const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                  onFieldChange('specialFeatures', features);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Ruled lines, Perforated pages, Spiral bound"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default/Other items fields
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select
                value={formData.material || ''}
                onChange={(e) => onFieldChange('material', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Material</option>
                {materials.map((mat) => (
                  <option key={mat._id} value={mat._id}>
                    {mat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Collection Name</label>
            <input
              type="text"
              value={formData.collectionName || ''}
              onChange={(e) => onFieldChange('collectionName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter collection name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Use Case</label>
            <input
              type="text"
              value={formData.useCase || ''}
              onChange={(e) => onFieldChange('useCase', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter use case"
            />
          </div>
          {colorFamilies.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Family</label>
              <select
                value={formData.colorFamily || ''}
                onChange={(e) => onFieldChange('colorFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Color Family</option>
                {colorFamilies.map((cf) => (
                  <option key={cf._id} value={cf._id}>
                    {cf.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {patterns.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
              <select
                value={formData.pattern || ''}
                onChange={(e) => onFieldChange('pattern', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Pattern</option>
                {patterns.map((pat) => (
                  <option key={pat._id} value={pat._id}>
                    {pat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
            <textarea
              value={formData.careInstructions || ''}
              onChange={(e) => onFieldChange('careInstructions', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter care instructions"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormTypeSpecific;
