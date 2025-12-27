import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FieldWithTooltip from '../ui/FieldWithTooltip';
import { attributeService } from '../../services/masterDataService';

interface ProductFormAttributesProps {
  attributes: Array<{
    attributeId: string;
    value: string | number | boolean;
    displayValue?: string;
  }>;
  errors: Record<string, string>;
  onAttributesChange: (attributes: Array<{
    attributeId: string;
    value: string | number | boolean;
    displayValue?: string;
  }>) => void;
}

interface Attribute {
  _id: string;
  name: string;
  slug: string;
  type: 'select' | 'text' | 'number';
  values: string[];
}

const ProductFormAttributes: React.FC<ProductFormAttributesProps> = ({
  attributes = [],
  errors,
  onAttributesChange,
}) => {
  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAttributeId, setSelectedAttributeId] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const response = await attributeService.getAll();
        if (response.success && response.data) {
          setAvailableAttributes(response.data);
        }
      } catch (error) {
        console.error('Error loading attributes:', error);
      }
    };
    loadAttributes();
  }, []);

  const handleAddAttribute = () => {
    if (!selectedAttributeId || !attributeValue) return;

    const attribute = availableAttributes.find(a => a._id === selectedAttributeId);
    if (!attribute) return;

    let processedValue: string | number | boolean = attributeValue;
    if (attribute.type === 'number') {
      processedValue = parseFloat(attributeValue) || 0;
    } else if (attribute.type === 'select') {
      processedValue = attributeValue;
    } else {
      processedValue = attributeValue;
    }

    const newAttribute = {
      attributeId: selectedAttributeId,
      value: processedValue,
      displayValue: displayValue || attributeValue,
    };

    onAttributesChange([...attributes, newAttribute]);
    setSelectedAttributeId('');
    setAttributeValue('');
    setDisplayValue('');
    setShowAddModal(false);
  };

  const handleRemoveAttribute = (index: number) => {
    const updated = attributes.filter((_, i) => i !== index);
    onAttributesChange(updated);
  };

  const handleUpdateAttribute = (index: number, field: 'value' | 'displayValue', newValue: string) => {
    const updated = [...attributes];
    if (field === 'value') {
      const attr = availableAttributes.find(a => a._id === updated[index].attributeId);
      if (attr?.type === 'number') {
        updated[index].value = parseFloat(newValue) || 0;
      } else {
        updated[index].value = newValue;
      }
    } else {
      updated[index].displayValue = newValue;
    }
    onAttributesChange(updated);
  };

  const getAttributeName = (attributeId: string) => {
    return availableAttributes.find(a => a._id === attributeId)?.name || attributeId;
  };

  const getAttributeType = (attributeId: string) => {
    return availableAttributes.find(a => a._id === attributeId)?.type || 'text';
  };

  const getAttributeValues = (attributeId: string) => {
    return availableAttributes.find(a => a._id === attributeId)?.values || [];
  };

  const unusedAttributes = availableAttributes.filter(
    attr => !attributes.some(pa => pa.attributeId === attr._id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Product Attributes</h2>
        <p className="text-sm text-gray-500 mb-6">
          Add flexible attributes to describe your product (e.g., Material, Author, Publisher, etc.)
        </p>

        {/* Existing Attributes */}
        {attributes.length > 0 && (
          <div className="space-y-4 mb-6">
            {attributes.map((attr, index) => {
              const attribute = availableAttributes.find(a => a._id === attr.attributeId);
              const isSelect = attribute?.type === 'select';
              const isNumber = attribute?.type === 'number';

              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{getAttributeName(attr.attributeId)}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Type: {getAttributeType(attr.attributeId)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {isSelect ? (
                      <FieldWithTooltip
                        label="Value"
                        tooltip={`Select a value for ${getAttributeName(attr.attributeId)}`}
                      >
                        <select
                          value={String(attr.value)}
                          onChange={(e) => handleUpdateAttribute(index, 'value', e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select value</option>
                          {getAttributeValues(attr.attributeId).map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </FieldWithTooltip>
                    ) : (
                      <FieldWithTooltip
                        label="Value"
                        tooltip={`Enter the value for ${getAttributeName(attr.attributeId)}`}
                      >
                        <input
                          type={isNumber ? 'number' : 'text'}
                          value={String(attr.value)}
                          onChange={(e) => handleUpdateAttribute(index, 'value', e.target.value)}
                          className="input-field"
                          placeholder={`Enter ${getAttributeName(attr.attributeId).toLowerCase()}`}
                        />
                      </FieldWithTooltip>
                    )}

                    <FieldWithTooltip
                      label="Display Value (Optional)"
                      tooltip="Custom display text. If empty, the value will be used."
                    >
                      <input
                        type="text"
                        value={attr.displayValue || ''}
                        onChange={(e) => handleUpdateAttribute(index, 'displayValue', e.target.value)}
                        className="input-field"
                        placeholder="Custom display text (optional)"
                      />
                    </FieldWithTooltip>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Attribute Button */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Attribute</span>
        </button>

        {/* Add Attribute Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Product Attribute</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedAttributeId('');
                    setAttributeValue('');
                    setDisplayValue('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <FieldWithTooltip
                  label="Attribute"
                  required
                  tooltip="Select the attribute type to add (e.g., Material, Author, Publisher)"
                >
                  <select
                    value={selectedAttributeId}
                    onChange={(e) => {
                      setSelectedAttributeId(e.target.value);
                      setAttributeValue('');
                    }}
                    className="input-field"
                  >
                    <option value="">Select attribute</option>
                    {unusedAttributes.map((attr) => (
                      <option key={attr._id} value={attr._id}>
                        {attr.name} ({attr.type})
                      </option>
                    ))}
                  </select>
                </FieldWithTooltip>

                {selectedAttributeId && (
                  <>
                    {getAttributeType(selectedAttributeId) === 'select' ? (
                      <FieldWithTooltip
                        label="Value"
                        required
                        tooltip="Select a value from the available options"
                      >
                        <select
                          value={attributeValue}
                          onChange={(e) => setAttributeValue(e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select value</option>
                          {getAttributeValues(selectedAttributeId).map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </FieldWithTooltip>
                    ) : (
                      <FieldWithTooltip
                        label="Value"
                        required
                        tooltip={`Enter the ${getAttributeName(selectedAttributeId).toLowerCase()} value`}
                      >
                        <input
                          type={getAttributeType(selectedAttributeId) === 'number' ? 'number' : 'text'}
                          value={attributeValue}
                          onChange={(e) => setAttributeValue(e.target.value)}
                          className="input-field"
                          placeholder={`Enter ${getAttributeName(selectedAttributeId).toLowerCase()}`}
                        />
                      </FieldWithTooltip>
                    )}

                    <FieldWithTooltip
                      label="Display Value (Optional)"
                      tooltip="Custom display text. If empty, the value will be used."
                    >
                      <input
                        type="text"
                        value={displayValue}
                        onChange={(e) => setDisplayValue(e.target.value)}
                        className="input-field"
                        placeholder="Custom display text (optional)"
                      />
                    </FieldWithTooltip>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedAttributeId('');
                      setAttributeValue('');
                      setDisplayValue('');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    disabled={!selectedAttributeId || !attributeValue}
                    className="btn btn-primary"
                  >
                    Add Attribute
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {attributes.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No attributes added yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Attribute" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormAttributes;
