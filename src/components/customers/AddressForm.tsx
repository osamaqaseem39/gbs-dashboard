import React from 'react';
import FieldWithTooltip from '../ui/FieldWithTooltip';
import { Address } from '../../types';

interface AddressFormProps {
  address: Partial<Address>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  isEdit?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  errors,
  onFieldChange,
  isEdit = false,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Address Information</h2>
        <p className="text-sm text-gray-500 mb-6">
          Complete address details for shipping or billing purposes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWithTooltip
            label="Address Label"
            tooltip="Optional label to identify this address (e.g., Home, Work, Office)"
            error={errors.label}
          >
            <input
              type="text"
              value={address.label || ''}
              onChange={(e) => onFieldChange('label', e.target.value || undefined)}
              className={`input-field ${errors.label ? 'border-red-300' : ''}`}
              placeholder="e.g., Home, Work"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Address Type"
            required
            tooltip="Select whether this is for billing, shipping, or both"
            error={errors.addressType}
          >
            <select
              value={address.type || 'both'}
              onChange={(e) => onFieldChange('addressType', e.target.value)}
              className={`input-field ${errors.addressType ? 'border-red-300' : ''}`}
            >
              <option value="billing">Billing Only</option>
              <option value="shipping">Shipping Only</option>
              <option value="both">Both Billing & Shipping</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="First Name"
            required
            tooltip="Recipient's first name"
            error={errors.firstName}
          >
            <input
              type="text"
              value={address.firstName || ''}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              className={`input-field ${errors.firstName ? 'border-red-300' : ''}`}
              placeholder="John"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Last Name"
            required
            tooltip="Recipient's last name"
            error={errors.lastName}
          >
            <input
              type="text"
              value={address.lastName || ''}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              className={`input-field ${errors.lastName ? 'border-red-300' : ''}`}
              placeholder="Doe"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Company (Optional)"
            tooltip="Company or organization name"
            error={errors.company}
          >
            <input
              type="text"
              value={address.company || ''}
              onChange={(e) => onFieldChange('company', e.target.value || undefined)}
              className={`input-field ${errors.company ? 'border-red-300' : ''}`}
              placeholder="Company Name"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Address Line 1"
            required
            tooltip="Street address, building number, apartment number"
            error={errors.addressLine1}
          >
            <input
              type="text"
              value={address.addressLine1 || address.street || ''}
              onChange={(e) => onFieldChange('addressLine1', e.target.value)}
              className={`input-field ${errors.addressLine1 ? 'border-red-300' : ''}`}
              placeholder="123 Main Street"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Address Line 2 (Optional)"
            tooltip="Apartment, suite, unit, building, floor, etc."
            error={errors.addressLine2}
          >
            <input
              type="text"
              value={address.addressLine2 || ''}
              onChange={(e) => onFieldChange('addressLine2', e.target.value || undefined)}
              className={`input-field ${errors.addressLine2 ? 'border-red-300' : ''}`}
              placeholder="Apt 4B"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="City"
            required
            tooltip="City or town name"
            error={errors.city}
          >
            <input
              type="text"
              value={address.city || ''}
              onChange={(e) => onFieldChange('city', e.target.value)}
              className={`input-field ${errors.city ? 'border-red-300' : ''}`}
              placeholder="Lahore"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="State/Province"
            tooltip="State, province, or region"
            error={errors.state}
          >
            <input
              type="text"
              value={address.state || ''}
              onChange={(e) => onFieldChange('state', e.target.value || undefined)}
              className={`input-field ${errors.state ? 'border-red-300' : ''}`}
              placeholder="Punjab"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Postal Code"
            required
            tooltip="ZIP code, postal code, or PIN code"
            error={errors.postalCode}
            helpText="Format: 54000"
          >
            <input
              type="text"
              value={address.postalCode || address.zipCode || ''}
              onChange={(e) => onFieldChange('postalCode', e.target.value)}
              className={`input-field ${errors.postalCode ? 'border-red-300' : ''}`}
              placeholder="54000"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Country"
            required
            tooltip="Country name"
            error={errors.country}
          >
            <select
              value={address.country || 'Pakistan'}
              onChange={(e) => onFieldChange('country', e.target.value)}
              className={`input-field ${errors.country ? 'border-red-300' : ''}`}
            >
              <option value="Pakistan">Pakistan</option>
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="UAE">United Arab Emirates</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Phone Number"
            tooltip="Contact phone number for this address"
            error={errors.phone}
          >
            <input
              type="tel"
              value={address.phone || ''}
              onChange={(e) => onFieldChange('phone', e.target.value || undefined)}
              className={`input-field ${errors.phone ? 'border-red-300' : ''}`}
              placeholder="+923001234567"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Email (Optional)"
            tooltip="Email address for this address (if different from account email)"
            error={errors.email}
          >
            <input
              type="email"
              value={address.email || ''}
              onChange={(e) => onFieldChange('email', e.target.value || undefined)}
              className={`input-field ${errors.email ? 'border-red-300' : ''}`}
              placeholder="address@example.com"
            />
          </FieldWithTooltip>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={address.isDefault || false}
                onChange={(e) => onFieldChange('isDefault', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Set as Default Address</span>
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Default address will be pre-selected during checkout
            </p>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={address.isActive !== false}
                onChange={(e) => onFieldChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Address is Active</span>
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Inactive addresses won't appear in address selection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;

