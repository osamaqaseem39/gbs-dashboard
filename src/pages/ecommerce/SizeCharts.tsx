import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { SizeChart } from '../types';

interface SizeChartsPageProps {}

const SizeChartsPage: React.FC<SizeChartsPageProps> = () => {
  const [sizeCharts, setSizeCharts] = useState<SizeChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSizeChart, setSelectedSizeChart] = useState<SizeChart | null>(null);

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    const mockSizeCharts: SizeChart[] = [
      {
        _id: '1',
        name: 'Women\'s Dresses',
        description: 'Size chart for women\'s dresses',
        sizeType: 'alphabetic',
        sizes: [
          { size: 'XS', measurements: { bust: '32"', waist: '24"', hips: '34"' } },
          { size: 'S', measurements: { bust: '34"', waist: '26"', hips: '36"' } },
          { size: 'M', measurements: { bust: '36"', waist: '28"', hips: '38"' } },
          { size: 'L', measurements: { bust: '38"', waist: '30"', hips: '40"' } },
          { size: 'XL', measurements: { bust: '40"', waist: '32"', hips: '42"' } },
        ],
        imageUrl: 'https://example.com/womens-dress-size-chart.jpg',
        imageAltText: 'Women\'s dress size chart',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        _id: '2',
        name: 'Men\'s Shirts',
        description: 'Size chart for men\'s shirts',
        sizeType: 'alphabetic',
        sizes: [
          { size: 'S', measurements: { bust: '36"', waist: '30"', shoulder: '18"' } },
          { size: 'M', measurements: { bust: '38"', waist: '32"', shoulder: '19"' } },
          { size: 'L', measurements: { bust: '40"', waist: '34"', shoulder: '20"' } },
          { size: 'XL', measurements: { bust: '42"', waist: '36"', shoulder: '21"' } },
        ],
        imageUrl: 'https://example.com/mens-shirt-size-chart.jpg',
        imageAltText: 'Men\'s shirt size chart',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    setTimeout(() => {
      setSizeCharts(mockSizeCharts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreate = async (sizeChartData: Partial<SizeChart>) => {
    // TODO: Implement API call
    console.log('Creating size chart:', sizeChartData);
    setIsCreateModalOpen(false);
  };

  const handleEdit = async (sizeChartData: Partial<SizeChart>) => {
    // TODO: Implement API call
    console.log('Updating size chart:', sizeChartData);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this size chart?')) {
      // TODO: Implement API call
      console.log('Deleting size chart:', id);
      setSizeCharts(prev => prev.filter(sc => sc._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Size Charts</h1>
          <p className="text-gray-600">Manage size charts for your products</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Size Chart
        </button>
      </div>

      {/* Size Charts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sizes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sizeCharts.map((sizeChart) => (
              <tr key={sizeChart._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {sizeChart.name}
                    </div>
                    {sizeChart.description && (
                      <div className="text-sm text-gray-500">
                        {sizeChart.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {sizeChart.sizeType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sizeChart.sizes.length} sizes
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sizeChart.imageUrl ? (
                    <img
                      src={sizeChart.imageUrl}
                      alt={sizeChart.imageAltText || 'Size chart'}
                      className="h-12 w-12 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sizeChart.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sizeChart.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSizeChart(sizeChart);
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sizeChart._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <SizeChartModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          title="Create Size Chart"
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedSizeChart && (
        <SizeChartModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEdit}
          title="Edit Size Chart"
          sizeChart={selectedSizeChart}
        />
      )}
    </div>
  );
};

// Size Chart Modal Component
interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SizeChart>) => void;
  title: string;
  sizeChart?: SizeChart;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  sizeChart,
}) => {
  const [formData, setFormData] = useState({
    name: sizeChart?.name || '',
    description: sizeChart?.description || '',
    sizeType: sizeChart?.sizeType || 'alphabetic',
    imageUrl: sizeChart?.imageUrl || '',
    imageAltText: sizeChart?.imageAltText || '',
    isActive: sizeChart?.isActive ?? true,
  });

  const [sizes, setSizes] = useState(
    sizeChart?.sizes || [
      { size: '', measurements: { bust: '', waist: '', hips: '' } }
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sizes,
    });
  };

  const addSize = () => {
    setSizes([...sizes, { size: '', measurements: { bust: '', waist: '', hips: '' } }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: string, value: string) => {
    const newSizes = [...sizes];
    if (field === 'size') {
      newSizes[index].size = value;
    } else {
      (newSizes[index].measurements as any)[field] = value;
    }
    setSizes(newSizes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size Type *
              </label>
              <select
                value={formData.sizeType}
                onChange={(e) => setFormData({ ...formData, sizeType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="alphabetic">Alphabetic (S, M, L, XL)</option>
                <option value="numeric">Numeric (6, 8, 10, 12)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size Chart Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/size-chart.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) {
                    setFormData({ ...formData, imageUrl: url });
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Size chart preview"
                  className="max-w-xs max-h-32 object-contain border border-gray-200 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Alt Text
            </label>
            <input
              type="text"
              value={formData.imageAltText}
              onChange={(e) => setFormData({ ...formData, imageAltText: e.target.value })}
              placeholder="Descriptive text for the image"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sizes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Sizes *
              </label>
              <button
                type="button"
                onClick={addSize}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Size
              </button>
            </div>
            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex gap-2 items-center p-2 border border-gray-200 rounded">
                  <input
                    type="text"
                    placeholder="Size"
                    value={size.size}
                    onChange={(e) => updateSize(index, 'size', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Chest"
                    value={size.measurements.bust}
                    onChange={(e) => updateSize(index, 'bust', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Waist"
                    value={size.measurements.waist}
                    onChange={(e) => updateSize(index, 'waist', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Hips"
                    value={size.measurements.hips}
                    onChange={(e) => updateSize(index, 'hips', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {sizeChart ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeChartsPage;
