import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SwatchIcon, 
  CubeIcon, 
  CalendarDaysIcon, 
  SunIcon, 
  TagIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const MasterDataPage: React.FC = () => {
  const navigate = useNavigate();

  const masterDataItems = [
    {
      id: 'colors',
      name: 'Colors',
      description: 'Manage product colors and color families',
      icon: SwatchIcon,
      route: '/dashboard/colors',
      color: 'bg-blue-500',
    },
    {
      id: 'materials',
      name: 'Materials',
      description: 'Manage fabric types and materials',
      icon: CubeIcon,
      route: '/dashboard/materials',
      color: 'bg-green-500',
    },
    {
      id: 'occasions',
      name: 'Occasions',
      description: 'Manage occasions like Formal, Casual, Wedding',
      icon: CalendarDaysIcon,
      route: '/dashboard/occasions',
      color: 'bg-purple-500',
    },
    {
      id: 'seasons',
      name: 'Seasons',
      description: 'Manage seasonal categories',
      icon: SunIcon,
      route: '/dashboard/seasons',
      color: 'bg-orange-500',
    },
    {
      id: 'sizes',
      name: 'Sizes',
      description: 'Manage product sizes and size charts',
      icon: TagIcon,
      route: '/dashboard/sizes',
      color: 'bg-red-500',
    },
    {
      id: 'patterns',
      name: 'Patterns',
      description: 'Manage pattern types (Solid, Floral, Geometric, etc.)',
      icon: SwatchIcon,
      route: '/dashboard/patterns',
      color: 'bg-pink-500',
    },
    {
      id: 'sleeve-lengths',
      name: 'Sleeve Lengths',
      description: 'Manage sleeve length options',
      icon: TagIcon,
      route: '/dashboard/sleeve-lengths',
      color: 'bg-indigo-500',
    },
    {
      id: 'color-families',
      name: 'Color Families',
      description: 'Manage color family groups',
      icon: SwatchIcon,
      route: '/dashboard/color-families',
      color: 'bg-violet-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage dropdown options and master data used in product forms
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard/products')}
            className="btn btn-secondary"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            Back to Products
          </button>
        </div>
      </div>

      {/* Master Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterDataItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(item.route)}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Click to manage</span>
                  <PlusIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/dashboard/products')}
            className="flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CubeIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">Products</div>
              <div className="text-xs text-gray-500">Manage products</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/dashboard/categories')}
            className="flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TagIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">Categories</div>
              <div className="text-xs text-gray-500">Manage categories</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/dashboard/brands')}
            className="flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CubeIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">Brands</div>
              <div className="text-xs text-gray-500">Manage brands</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/dashboard/product-setup')}
            className="flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Cog6ToothIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">Product Setup</div>
              <div className="text-xs text-gray-500">Setup products</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterDataPage;
