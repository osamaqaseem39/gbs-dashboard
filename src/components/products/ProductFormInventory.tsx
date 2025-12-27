import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CubeIcon,
  PlusIcon,
  MinusIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Product } from '../../types';
import { sizeService, Size } from '../../services/masterDataService';
import { warehouseService, Warehouse } from '../../services/warehouseService';
import FieldWithTooltip from '../ui/FieldWithTooltip';

interface ProductFormInventoryProps {
  formData?: Partial<Product>;
  inventory: {
    warehouseId: string;
    currentStock: number;
    reservedStock: number;
    reorderPoint: number;
    reorderQuantity: number;
    maxStock?: number;
    size?: string;
  };
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  onSizeInventoryChange?: (sizeInventory: SizeInventory[]) => void;
}

interface SizeInventory {
  size: string;
  quantity: number;
}

const ProductFormInventory: React.FC<ProductFormInventoryProps> = ({
  formData = {},
  inventory,
  errors,
  onFieldChange,
  onSizeInventoryChange,
}) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [sizeInventory, setSizeInventory] = useState<SizeInventory[]>([]);
  const [sizeNamesMap, setSizeNamesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const response = await warehouseService.getWarehouses();
        if (response.success && response.data) {
          setWarehouses(response.data);
        }
      } catch (error) {
        console.error('Error loading warehouses:', error);
      }
    };
    loadWarehouses();
  }, []);

  // Calculate available stock (currentStock - reservedStock)
  const availableStock = (inventory.currentStock || 0) - (inventory.reservedStock || 0);

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
    if (formData && formData.sizeInventory && Array.isArray(formData.sizeInventory) && formData.sizeInventory.length > 0) {
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
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory Management</h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage stock levels, warehouse location, and reorder settings for this product.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWithTooltip
            label="Warehouse"
            required
            tooltip="Select the warehouse where this product is stored. Inventory is tracked per warehouse."
            error={errors.warehouseId}
          >
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={inventory.warehouseId || ''}
                onChange={(e) => onFieldChange('warehouseId', e.target.value)}
                className={`input-field pl-10 ${errors.warehouseId ? 'border-red-300' : ''}`}
              >
                <option value="">Select Warehouse</option>
                {warehouses
                  .filter(w => w.isActive)
                  .map((warehouse) => (
                    <option key={warehouse._id} value={warehouse._id}>
                      {warehouse.name} {warehouse.isDefault && '(Default)'}
                    </option>
                  ))}
              </select>
            </div>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Size (Optional)"
            tooltip="Product size if inventory is tracked by size (e.g., S, M, L, XL or A4, A5)"
          >
            <input
              type="text"
              value={inventory.size || ''}
              onChange={(e) => onFieldChange('size', e.target.value || undefined)}
              className="input-field"
              placeholder="e.g., S, M, L, A4"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Current Stock"
            required
            tooltip="Total quantity currently in stock at this warehouse"
            error={errors.currentStock}
            helpText="Total units in warehouse"
          >
            <input
              type="number"
              min="0"
              value={inventory.currentStock || ''}
              onChange={(e) => onFieldChange('currentStock', parseInt(e.target.value) || 0)}
              className={`input-field ${errors.currentStock ? 'border-red-300' : ''}`}
              placeholder="0"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Reserved Stock"
            tooltip="Quantity reserved for pending orders. Available stock = Current Stock - Reserved Stock"
            error={errors.reservedStock}
            helpText={`Available: ${availableStock} units`}
          >
            <input
              type="number"
              min="0"
              value={inventory.reservedStock || ''}
              onChange={(e) => onFieldChange('reservedStock', parseInt(e.target.value) || 0)}
              className={`input-field ${errors.reservedStock ? 'border-red-300' : ''}`}
              placeholder="0"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Reorder Point"
            required
            tooltip="Stock level at which you should reorder. When current stock reaches this level, create a purchase order."
            error={errors.reorderPoint}
            helpText="Minimum stock level before reordering"
          >
            <input
              type="number"
              min="0"
              value={inventory.reorderPoint || ''}
              onChange={(e) => onFieldChange('reorderPoint', parseInt(e.target.value) || 0)}
              className={`input-field ${errors.reorderPoint ? 'border-red-300' : ''}`}
              placeholder="10"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Reorder Quantity"
            required
            tooltip="Quantity to order when stock reaches reorder point"
            error={errors.reorderQuantity}
            helpText="How many units to order"
          >
            <input
              type="number"
              min="0"
              value={inventory.reorderQuantity || ''}
              onChange={(e) => onFieldChange('reorderQuantity', parseInt(e.target.value) || 0)}
              className={`input-field ${errors.reorderQuantity ? 'border-red-300' : ''}`}
              placeholder="50"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Max Stock (Optional)"
            tooltip="Maximum stock level for this warehouse. Helps prevent overstocking."
            error={errors.maxStock}
          >
            <input
              type="number"
              min="0"
              value={inventory.maxStock || ''}
              onChange={(e) => onFieldChange('maxStock', e.target.value ? parseInt(e.target.value) : undefined)}
              className={`input-field ${errors.maxStock ? 'border-red-300' : ''}`}
              placeholder="1000"
            />
          </FieldWithTooltip>
        </div>

        {/* Stock Status Display */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.currentStock || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-orange-600">{inventory.reservedStock || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className={`text-2xl font-bold ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {availableStock}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductFormInventory;
