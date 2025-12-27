import React from 'react';
import { Product } from '../../types';
import FieldWithTooltip from '../ui/FieldWithTooltip';

interface ProductFormPricingProps {
  pricing: {
    basePrice: number;
    salePrice?: number;
    costPrice: number;
    currency: string;
    validFrom?: string;
    validTo?: string;
  };
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

const ProductFormPricing: React.FC<ProductFormPricingProps> = ({
  pricing,
  errors,
  onFieldChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h2>
        <p className="text-sm text-gray-500 mb-6">
          Set the product pricing. Base price is the regular selling price. Sale price is optional for discounts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWithTooltip
            label="Base Price"
            required
            tooltip="The regular selling price of the product. This is the price customers will see when there's no sale."
            error={errors.basePrice}
            helpText="Enter price in the selected currency"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {pricing.currency || 'PKR'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricing.basePrice || ''}
                onChange={(e) => onFieldChange('basePrice', parseFloat(e.target.value) || 0)}
                className={`input-field pl-12 ${errors.basePrice ? 'border-red-300' : ''}`}
                placeholder="0.00"
              />
            </div>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Sale Price"
            tooltip="Optional discounted price. If set, this price will be displayed instead of base price."
            error={errors.salePrice}
            helpText="Leave empty if no sale"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {pricing.currency || 'PKR'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricing.salePrice || ''}
                onChange={(e) => onFieldChange('salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                className={`input-field pl-12 ${errors.salePrice ? 'border-red-300' : ''}`}
                placeholder="0.00"
              />
            </div>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Cost Price"
            required
            tooltip="The cost price (wholesale/import price) of the product. Used for profit calculations."
            error={errors.costPrice}
            helpText="Internal use only - not shown to customers"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {pricing.currency || 'PKR'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricing.costPrice || ''}
                onChange={(e) => onFieldChange('costPrice', parseFloat(e.target.value) || 0)}
                className={`input-field pl-12 ${errors.costPrice ? 'border-red-300' : ''}`}
                placeholder="0.00"
              />
            </div>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Currency"
            required
            tooltip="Currency code for the pricing (e.g., PKR, USD, EUR)"
            error={errors.currency}
          >
            <select
              value={pricing.currency || 'PKR'}
              onChange={(e) => onFieldChange('currency', e.target.value)}
              className={`input-field ${errors.currency ? 'border-red-300' : ''}`}
            >
              <option value="PKR">PKR - Pakistani Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Valid From"
            tooltip="Date when this pricing becomes active. Leave empty to start immediately."
            error={errors.validFrom}
          >
            <input
              type="datetime-local"
              value={pricing.validFrom || ''}
              onChange={(e) => onFieldChange('validFrom', e.target.value)}
              className={`input-field ${errors.validFrom ? 'border-red-300' : ''}`}
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Valid To"
            tooltip="Date when this pricing expires. Leave empty for no expiration."
            error={errors.validTo}
          >
            <input
              type="datetime-local"
              value={pricing.validTo || ''}
              onChange={(e) => onFieldChange('validTo', e.target.value || undefined)}
              className={`input-field ${errors.validTo ? 'border-red-300' : ''}`}
            />
          </FieldWithTooltip>
        </div>

        {pricing.salePrice && pricing.basePrice && pricing.salePrice < pricing.basePrice && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Discount:</strong> {((1 - pricing.salePrice / pricing.basePrice) * 100).toFixed(1)}% off
            </p>
          </div>
        )}

        {pricing.salePrice && pricing.basePrice && pricing.salePrice >= pricing.basePrice && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Sale price should be less than base price for a discount.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormPricing;

