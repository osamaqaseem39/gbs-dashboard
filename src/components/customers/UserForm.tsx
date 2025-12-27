import React from 'react';
import FieldWithTooltip from '../ui/FieldWithTooltip';
import { validateForm, commonRules } from '../../shared/utils/validations';

interface UserFormProps {
  userData: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    userType: 'customer' | 'admin';
    isActive: boolean;
    emailVerified: boolean;
  };
  errors: Record<string, string>;
  isEdit?: boolean;
  onFieldChange: (field: string, value: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  userData,
  errors,
  isEdit = false,
  onFieldChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
        <p className="text-sm text-gray-500 mb-6">
          Basic user account information. This is the foundation for customer or admin accounts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWithTooltip
            label="Email Address"
            required
            tooltip="User's email address. Must be unique and will be used for login."
            error={errors.email}
            helpText="Used for login and notifications"
          >
            <input
              type="email"
              value={userData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className={`input-field ${errors.email ? 'border-red-300' : ''}`}
              placeholder="user@example.com"
              disabled={isEdit}
            />
          </FieldWithTooltip>

          {!isEdit && (
            <FieldWithTooltip
              label="Password"
              required
              tooltip="Password for user account. Must be at least 8 characters."
              error={errors.password}
              helpText="Minimum 8 characters"
            >
              <input
                type="password"
                value={userData.password || ''}
                onChange={(e) => onFieldChange('password', e.target.value)}
                className={`input-field ${errors.password ? 'border-red-300' : ''}`}
                placeholder="Enter password"
              />
            </FieldWithTooltip>
          )}

          <FieldWithTooltip
            label="First Name"
            required
            tooltip="User's first name"
            error={errors.firstName}
          >
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              className={`input-field ${errors.firstName ? 'border-red-300' : ''}`}
              placeholder="John"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Last Name"
            required
            tooltip="User's last name"
            error={errors.lastName}
          >
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              className={`input-field ${errors.lastName ? 'border-red-300' : ''}`}
              placeholder="Doe"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Phone Number"
            tooltip="Contact phone number (optional)"
            error={errors.phone}
            helpText="Format: +1234567890"
          >
            <input
              type="tel"
              value={userData.phone || ''}
              onChange={(e) => onFieldChange('phone', e.target.value || undefined)}
              className={`input-field ${errors.phone ? 'border-red-300' : ''}`}
              placeholder="+1234567890"
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="Date of Birth"
            tooltip="User's date of birth (optional)"
            error={errors.dateOfBirth}
          >
            <input
              type="date"
              value={userData.dateOfBirth || ''}
              onChange={(e) => onFieldChange('dateOfBirth', e.target.value || undefined)}
              className={`input-field ${errors.dateOfBirth ? 'border-red-300' : ''}`}
              max={new Date().toISOString().split('T')[0]}
            />
          </FieldWithTooltip>

          <FieldWithTooltip
            label="User Type"
            required
            tooltip="Select whether this is a customer or admin account"
            error={errors.userType}
          >
            <select
              value={userData.userType}
              onChange={(e) => onFieldChange('userType', e.target.value)}
              className={`input-field ${errors.userType ? 'border-red-300' : ''}`}
              disabled={isEdit}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </FieldWithTooltip>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={userData.isActive}
                onChange={(e) => onFieldChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Account is Active</span>
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Inactive accounts cannot log in
            </p>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={userData.emailVerified}
                onChange={(e) => onFieldChange('emailVerified', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Email Verified</span>
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Mark as verified if email has been confirmed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

