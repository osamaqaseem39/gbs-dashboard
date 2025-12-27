import React from 'react';
import FieldWithTooltip from '../ui/FieldWithTooltip';

interface CustomerFormProps {
  customerData: {
    loyaltyPoints: number;
    preferredCurrency: string;
    preferredLanguage: string;
  };
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customerData,
  errors,
  onFieldChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Preferences</h2>
        <p className="text-sm text-gray-500 mb-6">
          Customer-specific settings and preferences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWithTooltip
            label="Loyalty Points"
            tooltip="Current loyalty points balance. Can be adjusted manually for rewards or corrections."
            error={errors.loyaltyPoints}
            helpText="Points balance for rewards program"
          >
            <input
              type="number"
              min="0"
              value={customerData.loyaltyPoints || 0}
              onChange={(e) => onFieldChange('loyaltyPoints', parseInt(e.target.value) || 0)}
              className={`input-field ${errors.loyaltyPoints ? 'border-red-300' : ''}`}
              placeholder="0"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Preferred Currency"
            tooltip="Default currency for displaying prices to this customer"
            error={errors.preferredCurrency}
          >
            <select
              value={customerData.preferredCurrency || 'PKR'}
              onChange={(e) => onFieldChange('preferredCurrency', e.target.value)}
              className={`input-field ${errors.preferredCurrency ? 'border-red-300' : ''}`}
            >
              <option value="PKR">PKR - Pakistani Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Preferred Language"
            tooltip="Default language for customer communications and interface"
            error={errors.preferredLanguage}
          >
            <select
              value={customerData.preferredLanguage || 'en'}
              onChange={(e) => onFieldChange('preferredLanguage', e.target.value)}
              className={`input-field ${errors.preferredLanguage ? 'border-red-300' : ''}`}
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="ar">Arabic</option>
            </select>
          </FieldWithTooltip>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;

