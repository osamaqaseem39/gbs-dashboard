import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import { deliveryChargeService, DeliveryCharge, CreateDeliveryChargeDto } from 'services/deliveryChargeService';

const DeliveryChargesPage: React.FC = () => {
  const navigate = useNavigate();
  const [deliveryCharges, setDeliveryCharges] = useState<DeliveryCharge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCharge, setEditingCharge] = useState<DeliveryCharge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateDeliveryChargeDto>({
    locationName: '',
    locationType: 'country',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    baseCharge: 0,
    chargePerKg: 0,
    chargePerItem: 0,
    freeShippingThreshold: undefined,
    minimumOrderAmount: 0,
    maximumOrderAmount: undefined,
    enabled: true,
    priority: 0,
    estimatedDeliveryDays: 3,
  });

  useEffect(() => {
    loadDeliveryCharges();
  }, []);

  const loadDeliveryCharges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deliveryChargeService.getAll();
      if (response.success && response.data) {
        setDeliveryCharges(response.data);
      } else {
        setError(response.message || 'Failed to load delivery charges');
      }
    } catch (err: any) {
      console.error('Error loading delivery charges:', err);
      setError(err.response?.data?.message || 'Failed to load delivery charges');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Clean up form data based on location type
      const submitData: CreateDeliveryChargeDto = {
        ...formData,
        state: formData.locationType === 'country' ? undefined : formData.state,
        city: formData.locationType === 'country' || formData.locationType === 'state' ? undefined : formData.city,
        postalCode: formData.locationType !== 'postal_code' ? undefined : formData.postalCode,
      };

      if (editingCharge?._id) {
        const response = await deliveryChargeService.update(editingCharge._id, submitData);
        if (response.success && response.data) {
          await loadDeliveryCharges();
          setShowForm(false);
          setEditingCharge(null);
          resetForm();
        } else {
          setError(response.message || 'Failed to update delivery charge');
        }
      } else {
        const response = await deliveryChargeService.create(submitData);
        if (response.success && response.data) {
          await loadDeliveryCharges();
          setShowForm(false);
          resetForm();
        } else {
          setError(response.message || 'Failed to create delivery charge');
        }
      }
    } catch (err: any) {
      console.error('Error saving delivery charge:', err);
      setError(err.response?.data?.message || 'Failed to save delivery charge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (charge: DeliveryCharge) => {
    setEditingCharge(charge);
    setFormData({
      locationName: charge.locationName,
      locationType: charge.locationType,
      country: charge.country,
      state: charge.state || '',
      city: charge.city || '',
      postalCode: charge.postalCode || '',
      baseCharge: charge.baseCharge,
      chargePerKg: charge.chargePerKg || 0,
      chargePerItem: charge.chargePerItem || 0,
      freeShippingThreshold: charge.freeShippingThreshold,
      minimumOrderAmount: charge.minimumOrderAmount || 0,
      maximumOrderAmount: charge.maximumOrderAmount,
      enabled: charge.enabled,
      priority: charge.priority || 0,
      estimatedDeliveryDays: charge.estimatedDeliveryDays || 3,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this delivery charge?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await deliveryChargeService.delete(id);
      await loadDeliveryCharges();
    } catch (err: any) {
      console.error('Error deleting delivery charge:', err);
      setError(err.response?.data?.message || 'Failed to delete delivery charge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      await deliveryChargeService.toggleStatus(id, !currentStatus);
      await loadDeliveryCharges();
    } catch (err: any) {
      console.error('Error toggling delivery charge status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSetup = async () => {
    if (!window.confirm('This will create 3 delivery charges:\n1. Lahore: 150 PKR\n2. Punjab (other cities): 250 PKR\n3. Outside Punjab: 350 PKR\n\nExisting charges will not be deleted. Continue?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const charges = [
        {
          locationName: 'Lahore',
          locationType: 'city' as const,
          country: 'PK',
          state: 'Punjab',
          city: 'Lahore',
          baseCharge: 150,
          enabled: true,
          priority: 100, // Highest priority for city-specific charge
          estimatedDeliveryDays: 2,
        },
        {
          locationName: 'Punjab (Other Cities)',
          locationType: 'state' as const,
          country: 'PK',
          state: 'Punjab',
          baseCharge: 250,
          enabled: true,
          priority: 50, // Medium priority for state-level charge
          estimatedDeliveryDays: 3,
        },
        {
          locationName: 'Outside Punjab',
          locationType: 'country' as const,
          country: 'PK',
          baseCharge: 350,
          enabled: true,
          priority: 0, // Lowest priority for country-level charge
          estimatedDeliveryDays: 5,
        },
      ];

      // Create all charges
      for (const charge of charges) {
        try {
          await deliveryChargeService.create(charge);
        } catch (err: any) {
          // If charge already exists, skip it
          if (err.response?.status !== 409) {
            console.error('Error creating charge:', charge.locationName, err);
          }
        }
      }

      await loadDeliveryCharges();
      alert('Quick setup completed! Three delivery charges have been created.');
    } catch (err: any) {
      console.error('Error in quick setup:', err);
      setError(err.response?.data?.message || 'Failed to complete quick setup');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      locationName: '',
      locationType: 'country',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      baseCharge: 0,
      chargePerKg: 0,
      chargePerItem: 0,
      freeShippingThreshold: undefined,
      minimumOrderAmount: 0,
      maximumOrderAmount: undefined,
      enabled: true,
      priority: 0,
      estimatedDeliveryDays: 3,
    });
  };

  const getLocationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      country: 'Country',
      state: 'State/Province',
      city: 'City',
      postal_code: 'Postal Code',
    };
    return labels[type] || type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Delivery Charges</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleQuickSetup}
            disabled={isLoading}
            className="btn btn-secondary"
            title="Quick Setup: Creates Lahore (150), Punjab (250), Outside Punjab (350)"
          >
            Quick Setup
          </button>
          <button
            onClick={() => {
              setEditingCharge(null);
              resetForm();
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Delivery Charge
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingCharge ? 'Edit Delivery Charge' : 'Add Delivery Charge'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCharge(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.locationName}
                      onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Karachi, Sindh, Pakistan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location Type *
                    </label>
                    <select
                      required
                      value={formData.locationType}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="country">Country</option>
                      <option value="state">State/Province</option>
                      <option value="city">City</option>
                      <option value="postal_code">Postal Code</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country Code * (ISO 3166-1 alpha-2)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="PK, US, GB"
                      maxLength={2}
                    />
                  </div>

                  {formData.locationType !== 'country' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province {formData.locationType === 'state' && '*'}
                      </label>
                      <input
                        type="text"
                        required={formData.locationType === 'state'}
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Sindh, Punjab, etc."
                      />
                    </div>
                  )}

                  {formData.locationType === 'city' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Karachi, Lahore, etc."
                      />
                    </div>
                  )}

                  {formData.locationType === 'postal_code' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="75000, 54000, etc."
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Charge (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.baseCharge}
                      onChange={(e) => setFormData({ ...formData, baseCharge: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Charge per Kg (PKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.chargePerKg || 0}
                      onChange={(e) => setFormData({ ...formData, chargePerKg: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Charge per Item (PKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.chargePerItem || 0}
                      onChange={(e) => setFormData({ ...formData, chargePerItem: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Free Shipping Threshold (PKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.freeShippingThreshold || ''}
                      onChange={(e) => setFormData({ ...formData, freeShippingThreshold: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Order Amount (PKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minimumOrderAmount || 0}
                      onChange={(e) => setFormData({ ...formData, minimumOrderAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Order Amount (PKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.maximumOrderAmount || ''}
                      onChange={(e) => setFormData({ ...formData, maximumOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={formData.priority || 0}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Higher = checked first"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Delivery Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.estimatedDeliveryDays || 3}
                      onChange={(e) => setFormData({ ...formData, estimatedDeliveryDays: parseInt(e.target.value) || 3 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.enabled}
                        onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Enabled</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCharge(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : editingCharge ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Charges List */}
      {isLoading && deliveryCharges.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : deliveryCharges.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No delivery charges configured yet.</p>
          <button
            onClick={() => {
              setEditingCharge(null);
              resetForm();
              setShowForm(true);
            }}
            className="mt-4 btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add First Delivery Charge
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Charge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Additional Charges
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveryCharges.map((charge) => (
                <tr key={charge._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{charge.locationName}</div>
                        <div className="text-sm text-gray-500">
                          {charge.country}
                          {charge.state && `, ${charge.state}`}
                          {charge.city && `, ${charge.city}`}
                          {charge.postalCode && ` (${charge.postalCode})`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {getLocationTypeLabel(charge.locationType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(charge.baseCharge)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {charge.chargePerKg ? `+${formatCurrency(charge.chargePerKg)}/kg` : ''}
                    {charge.chargePerKg && charge.chargePerItem ? ', ' : ''}
                    {charge.chargePerItem ? `+${formatCurrency(charge.chargePerItem)}/item` : ''}
                    {!charge.chargePerKg && !charge.chargePerItem && '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {charge.priority || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => charge._id && handleToggleStatus(charge._id, charge.enabled)}
                      className={`flex items-center space-x-1 ${
                        charge.enabled ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {charge.enabled ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5" />
                      )}
                      <span className="text-sm">{charge.enabled ? 'Enabled' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(charge)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => charge._id && handleDelete(charge._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryChargesPage;

