import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  BanknotesIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { Product } from '../../types';
import { sizeService, Size } from '../../services/masterDataService';

interface ProductFormInventoryProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  onSizeInventoryChange?: (sizeInventory: SizeInventory[]) => void;
}

interface SizeInventory {
  size: string;
  quantity: number;
}

const ProductFormInventory: React.FC<ProductFormInventoryProps> = ({
  formData,
  errors,
  onFieldChange,
  onSizeInventoryChange,
}) => {
  const hasSizes = formData.availableSizes && formData.availableSizes.length > 0;
  
  // Initialize size-wise inventory state
  const [sizeInventory, setSizeInventory] = useState<SizeInventory[]>([]);
  const [sizeNamesMap, setSizeNamesMap] = useState<Record<string, string>>({});

  // Initialize or update size inventory when availableSizes change
  useEffect(() => {
    if (hasSizes && formData.availableSizes) {
      const currentSizes = formData.availableSizes;
      const existing = sizeInventory.filter(si => currentSizes.includes(si.size));
      const newSizes = currentSizes
        .filter(size => !existing.find(e => e.size === size))
        .map(size => ({ size, quantity: 0 }));
      
      // Remove sizes that are no longer in availableSizes
      const filtered = existing.filter(si => currentSizes.includes(si.size));
      
      const updated = [...filtered, ...newSizes];
      setSizeInventory(updated);
      // Notify parent of size inventory changes
      if (onSizeInventoryChange) {
        onSizeInventoryChange(updated);
      }
    } else {
      setSizeInventory([]);
      if (onSizeInventoryChange) {
        onSizeInventoryChange([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.availableSizes, hasSizes]);

  // Calculate total stock from size-wise inventory
  useEffect(() => {
    if (hasSizes && sizeInventory.length > 0) {
      const total = sizeInventory.reduce((sum, si) => sum + si.quantity, 0);
      if (formData.stockQuantity !== total) {
        onFieldChange('stockQuantity', total);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeInventory, hasSizes, formData.stockQuantity, onFieldChange]);

  const handleSizeQuantityChange = (size: string, quantity: number) => {
    const updated = sizeInventory.map(si => 
      si.size === size ? { ...si, quantity: Math.max(0, quantity) } : si
    );
    setSizeInventory(updated);
    // Notify parent of size inventory changes
    if (onSizeInventoryChange) {
      onSizeInventoryChange(updated);
    }
  };

  // Load existing size inventory from formData if available (for editing)
  useEffect(() => {
    if (formData.sizeInventory && Array.isArray(formData.sizeInventory) && formData.sizeInventory.length > 0) {
      setSizeInventory(formData.sizeInventory as SizeInventory[]);
      if (onSizeInventoryChange) {
        onSizeInventoryChange(formData.sizeInventory as SizeInventory[]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch size names when availableSizes change
  useEffect(() => {
    const fetchSizeNames = async () => {
      if (!formData.availableSizes || formData.availableSizes.length === 0) {
        setSizeNamesMap({});
        return;
      }

      try {
        const response = await sizeService.getAll();
        if (response.success && response.data) {
          const namesMap: Record<string, string> = {};
          response.data.forEach((size: Size) => {
            if (formData.availableSizes?.includes(size._id)) {
              namesMap[size._id] = size.name;
            }
          });
          setSizeNamesMap(namesMap);
        }
      } catch (error) {
        console.error('Error fetching size names:', error);
      }
    };

    fetchSizeNames();
  }, [formData.availableSizes]);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      {hasSizes && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <CubeIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Size-wise Inventory Management Enabled
              </p>
              <p className="mt-1 text-sm text-blue-700">
                This product has {formData.availableSizes?.length} size(s) configured. 
                Inventory will be managed separately for each size: {formData.availableSizes?.map(id => sizeNamesMap[id] || id).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg font-semibold text-gray-900">Inventory Management</h2>
          <p className="mt-1 text-sm text-gray-600">Manage stock levels and availability for this product</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Stock Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Status
            </label>
            <div className="relative">
              <select
                value={formData.stockStatus || 'instock'}
                onChange={(e) => onFieldChange('stockStatus', e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
              >
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
                <option value="onbackorder">On Backorder</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {formData.stockStatus === 'instock' && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                )}
                {formData.stockStatus === 'outofstock' && (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
                {formData.stockStatus === 'onbackorder' && (
                  <ClockIcon className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Current availability status of this product
            </p>
          </div>

          {/* Size-wise Inventory Management */}
          {hasSizes && formData.availableSizes && formData.availableSizes.length > 0 ? (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Stock by Size *
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage inventory quantity for each available size
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Total: <span className="text-blue-600">{sizeInventory.reduce((sum, si) => sum + si.quantity, 0)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {formData.availableSizes.map((size) => {
                  const sizeInv = sizeInventory.find(si => si.size === size) || { size, quantity: 0 };
                  return (
                    <div key={size} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="w-20 flex-shrink-0">
                        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          {sizeNamesMap[size] || size}
                        </span>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Quantity
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSizeQuantityChange(size, sizeInv.quantity - 1)}
                            disabled={sizeInv.quantity <= 0}
                            className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={sizeInv.quantity === 0 ? '' : sizeInv.quantity}
                            onChange={(e) => handleSizeQuantityChange(size, parseInt(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium"
                            placeholder="0"
                          />
                          <button
                            type="button"
                            onClick={() => handleSizeQuantityChange(size, sizeInv.quantity + 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Available</div>
                        <div className="text-lg font-semibold text-gray-900">{sizeInv.quantity}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.stockQuantity && (
                <p className="mt-2 text-sm text-red-600">{errors.stockQuantity}</p>
              )}
            </div>
          ) : (
            /* Standard Stock Quantity (when no sizes) */
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <div className="relative">
                <CubeIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity === 0 ? '' : (formData.stockQuantity || '')}
                  onChange={(e) => onFieldChange('stockQuantity', e.target.value === '' ? 0 : (parseInt(e.target.value) || 0))}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.stockQuantity ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="0"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter available quantity (0 or higher)
              </p>
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
              )}
            </div>
          )}

          {/* Stock Management Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <label className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.manageStock ?? true}
                onChange={(e) => onFieldChange('manageStock', e.target.checked)}
                className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Manage Stock</span>
                <span className="block text-xs text-gray-500 mt-1">
                  Enable automatic stock tracking for this product
                </span>
              </div>
            </label>

            <label className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.allowBackorders ?? false}
                onChange={(e) => onFieldChange('allowBackorders', e.target.checked)}
                className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Allow Backorders</span>
                <span className="block text-xs text-gray-500 mt-1">
                  Allow customers to order when out of stock
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BanknotesIcon className="h-5 w-5 mr-2 text-gray-600" />
            Pricing
          </h2>
          <p className="mt-1 text-sm text-gray-600">Set product pricing and cost information</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Regular Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Regular Price *
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price === 0 ? '' : (formData.price || '')}
                onChange={(e) => onFieldChange('price', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="0.00"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Base selling price before any discounts</p>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Sale Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sale Price
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-3.5 h-5 w-5 text-orange-400 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.salePrice === 0 ? '' : (formData.salePrice || '')}
                onChange={(e) => onFieldChange('salePrice', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.salePrice ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50/30'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.salePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Must be lower than Regular Price. Leave empty to disable sale pricing.
            </p>
          </div>

          {/* Cost Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cost Price
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice === 0 ? '' : (formData.originalPrice || '')}
                onChange={(e) => onFieldChange('originalPrice', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Cost price for profit calculations and margin analysis
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductFormInventory;
