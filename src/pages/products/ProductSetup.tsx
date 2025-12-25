import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  FolderIcon,
  BuildingStorefrontIcon,
  CogIcon,
  ArrowRightIcon,
  SwatchIcon,
  CubeIcon,
  CalendarDaysIcon,
  SunIcon,
  TagIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import type { Category, Brand } from '../types';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';

const ProductSetup: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [brandCount, setBrandCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSetupData();
  }, []);

  const fetchSetupData = async () => {
    try {
      setIsLoading(true);
      const [categoriesResponse, brandsResponse, categoryStatsRes, brandStatsRes] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands(),
        categoryService.getCategoryStats().catch(() => ({ success: false } as any)),
        brandService.getBrandStats().catch(() => ({ success: false } as any)),
      ]);
      
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
      
      if (brandsResponse.success && brandsResponse.data) {
        setBrands(brandsResponse.data);
      }

      if (categoryStatsRes.success && categoryStatsRes.data) {
        setCategoryCount(categoryStatsRes.data.totalCategories);
      } else {
        setCategoryCount(categoriesResponse.data?.length || 0);
      }

      if (brandStatsRes.success && brandStatsRes.data) {
        setBrandCount(brandStatsRes.data.totalBrands);
      } else {
        setBrandCount(brandsResponse.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching setup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    navigate(`/dashboard/categories/${category._id}/edit`);
  };

  const handleEditBrand = (brand: Brand) => {
    navigate(`/dashboard/brands/${brand._id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Setup</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your product catalog structure, categories, and brands
        </p>
      </div>

      {/* Setup Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              <p className="text-sm text-gray-500">{categoryCount} categories</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate('/dashboard/categories/new')}
              className="btn btn-primary w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingStorefrontIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Brands</h3>
              <p className="text-sm text-gray-500">{brandCount} brands</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate('/dashboard/brands/new')}
              className="btn btn-primary w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Brand
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CogIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-500">Product preferences</p>
            </div>
          </div>
          <div className="mt-4">
            <button className="btn btn-secondary w-full">
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Product Categories</h2>
          <button
            onClick={() => navigate('/dashboard/categories/new')}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first product category.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/categories/new')}
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
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
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-sm text-gray-500">
                          {category.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Product Brands</h2>
          <button
            onClick={() => navigate('/dashboard/brands/new')}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Brand
          </button>
        </div>

        {brands.length === 0 ? (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No brands</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first product brand.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/brands/new')}
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Brand
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
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
                {brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {brand.logoUrl && (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {brand.name}
                          </div>
                          {brand.description && (
                            <div className="text-sm text-gray-500">
                              {brand.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {brand.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="capitalize">{brand.level}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {brand.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {brand.isFeatured && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800`}>
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditBrand(brand)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Master Data Links Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Master Data Setup</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage dropdown options and master data used in product forms
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/master-data')}
            className="btn btn-secondary"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Occasions */}
          <button
            onClick={() => navigate('/dashboard/occasions')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Occasions</h4>
              <p className="text-sm text-gray-500">Manage occasions like Formal, Casual, Wedding</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          {/* Seasons */}
          <button
            onClick={() => navigate('/dashboard/seasons')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500">
              <SunIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Seasons</h4>
              <p className="text-sm text-gray-500">Manage seasonal categories</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          {/* Materials */}
          <button
            onClick={() => navigate('/dashboard/materials')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500">
              <CubeIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Materials</h4>
              <p className="text-sm text-gray-500">Manage fabric types and materials</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          {/* Colors */}
          <button
            onClick={() => navigate('/dashboard/colors')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500">
              <SwatchIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Colors</h4>
              <p className="text-sm text-gray-500">Manage product colors and color families</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          {/* Sizes */}
          <button
            onClick={() => navigate('/dashboard/sizes')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-500">
              <TagIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Sizes</h4>
              <p className="text-sm text-gray-500">Manage product sizes and size charts</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          {/* Patterns */}
          <button
            onClick={() => navigate('/dashboard/patterns')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-pink-500">
              <SwatchIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Patterns</h4>
              <p className="text-sm text-gray-500">Manage pattern types</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          {/* Sleeve Lengths */}
          <button
            onClick={() => navigate('/dashboard/sleeve-lengths')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-indigo-500">
              <TagIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Sleeve Lengths</h4>
              <p className="text-sm text-gray-500">Manage sleeve length options</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          {/* Color Families */}
          <button
            onClick={() => navigate('/dashboard/color-families')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-violet-500">
              <SwatchIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Color Families</h4>
              <p className="text-sm text-gray-500">Manage color family groups</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          {/* Master Data Hub */}
          <button
            onClick={() => navigate('/dashboard/master-data')}
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-gray-100">
              <CogIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900">Master Data Hub</h4>
              <p className="text-sm text-gray-500">View all master data in one place</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center">
              <PlusIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Add New Product</h4>
                <p className="text-sm text-gray-500">Create a new product listing</p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-center">
              <CogIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Product Settings</h4>
                <p className="text-sm text-gray-500">Configure product preferences</p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSetup; 
