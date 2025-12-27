import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import UserForm from '../../components/customers/UserForm';
import CustomerForm from '../../components/customers/CustomerForm';
import AddressForm from '../../components/customers/AddressForm';
import { customerService } from '../../services/customerService';
import { validateForm, commonRules } from '../../shared/utils/validations';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CustomerFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<'user' | 'customer' | 'address'>('user');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    userType: 'customer' as 'customer' | 'admin',
    isActive: true,
    emailVerified: false,
  });

  const [customerData, setCustomerData] = useState({
    loyaltyPoints: 0,
    preferredCurrency: 'PKR',
    preferredLanguage: 'en',
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      loadCustomer();
    }
  }, [id, isEdit]);

  const loadCustomer = async () => {
    setLoading(true);
    try {
      // Load customer data (which includes user data)
      const res = await customerService.getCustomer(id!);
      if (res.success && res.data) {
        // Set user data
        setUserData({
          email: res.data.email || '',
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          phone: res.data.phone || '',
          dateOfBirth: res.data.dateOfBirth || '',
          userType: 'customer',
          isActive: res.data.isActive !== false,
          emailVerified: res.data.emailVerified || false,
        });

        // Set customer-specific data
        setCustomerData({
          loyaltyPoints: res.data.loyaltyPoints || 0,
          preferredCurrency: res.data.preferredCurrency || 'PKR',
          preferredLanguage: res.data.preferredLanguage || 'en',
        });

        // Load addresses
        // Note: Address loading would need to be implemented in customerService
      }
    } catch (error) {
      console.error('Error loading customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserFieldChange = (field: string, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCustomerFieldChange = (field: string, value: any) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressFieldChange = (field: string, value: any) => {
    setEditingAddress((prev: any) => ({ ...prev, [field]: value }));
  };

  const validateAll = () => {
    const userRules = {
      email: { ...commonRules.email },
      password: isEdit ? {} : { ...commonRules.required, minLength: 8 },
      firstName: { ...commonRules.required, minLength: 2 },
      lastName: { ...commonRules.required, minLength: 2 },
      phone: { ...commonRules.phone },
    };

    const result = validateForm(userData, userRules);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setActiveTab('user');
      return;
    }

    try {
      if (isEdit && id) {
        // Update customer
        const payload = {
          ...userData,
          ...customerData,
        };
        const res = await customerService.updateCustomer(id, payload);
        if (res.success) {
          navigate('/dashboard/customers');
        }
      } else {
        // Create customer
        const payload = {
          ...userData,
          ...customerData,
        };
        const res = await customerService.createCustomer(payload);
        if (res.success) {
          navigate('/dashboard/customers');
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress({
      addressType: 'both',
      firstName: userData.firstName,
      lastName: userData.lastName,
      addressLine1: '',
      city: '',
      postalCode: '',
      country: 'Pakistan',
      isDefault: false,
      isActive: true,
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      const updated = editingAddress._id
        ? addresses.map(a => a._id === editingAddress._id ? editingAddress : a)
        : [...addresses, { ...editingAddress, _id: Date.now().toString() }];
      setAddresses(updated);
      setShowAddressForm(false);
      setEditingAddress(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/dashboard/customers')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Customers
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Customer' : 'Create Customer'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit ? 'Update customer information' : 'Add a new customer to the system'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['user', 'customer', 'address'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'user' ? 'User Account' : tab === 'customer' ? 'Customer Details' : 'Addresses'}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'user' && (
            <UserForm
              userData={userData}
              errors={errors}
              isEdit={isEdit}
              onFieldChange={handleUserFieldChange}
            />
          )}

          {activeTab === 'customer' && (
            <CustomerForm
              customerData={customerData}
              errors={errors}
              onFieldChange={handleCustomerFieldChange}
            />
          )}

          {activeTab === 'address' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Addresses</h2>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="btn btn-primary"
                >
                  Add Address
                </button>
              </div>

              {addresses.length === 0 && !showAddressForm && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No addresses added yet</p>
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    Add first address
                  </button>
                </div>
              )}

              {showAddressForm && editingAddress && (
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <AddressForm
                    address={editingAddress}
                    errors={{}}
                    onFieldChange={handleAddressFieldChange}
                    isEdit={!!editingAddress._id}
                  />
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      className="btn btn-primary"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}

              {addresses.map((addr) => (
                <div key={addr._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                      <p className="text-sm text-gray-600">{addr.addressLine1}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.postalCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(addr);
                        setShowAddressForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/dashboard/customers')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerFormPage;

