import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Product, Category, Brand } from 'types';
import { categoryService } from 'services/categoryService';
import { brandService } from 'services/brandService';
import { 
  materialService, 
  occasionService, 
  seasonService,
  colorFamilyService,
  patternService,
  sleeveLengthService,
} from 'services/masterDataService';
import CreateItemModal from 'components/products/modals/CreateItemModal';
import CategoryForm from 'components/products/CategoryForm';
import BrandForm from 'components/products/BrandForm';
import ProductFormTabs from 'components/products/ProductFormTabs';
import ProductFormBasic from 'components/products/ProductFormBasic';
import ProductFormInventory from 'components/products/ProductFormInventory';
import ProductFormShipping from 'components/products/ProductFormShipping';
import ProductFormAttributes from 'components/products/ProductFormAttributes';
import ProductFormImages from 'components/products/ProductFormImages';
import ProductFormSEO from 'components/products/ProductFormSEO';
import ProductFormTypeSpecific from 'components/products/ProductFormTypeSpecific';

interface ProductFormPageProps {
  product?: Product;
  categories: Category[];
  brands: Brand[];
  materials?: any[];
  occasions?: any[];
  seasons?: any[];
  colorFamilies?: any[];
  patterns?: any[];
  sleeveLengths?: any[];
  ageGroups?: any[];
  products?: any[];
  onSubmit: (productData: Partial<Product>) => Promise<void>;
  onDelete?: (productId: string) => Promise<void>;
  isLoading?: boolean;
}

const ProductFormPage: React.FC<ProductFormPageProps> = ({
  product,
  categories,
  brands,
  materials = [],
  occasions = [],
  seasons = [],
  colorFamilies = [],
  patterns = [],
  sleeveLengths = [],
  ageGroups = [],
  products = [],
  onSubmit,
  onDelete,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id && !!product;

  const [activeTab, setActiveTab] = useState('general');
  const [categoriesState, setCategoriesState] = useState<Category[]>(categories);
  const [brandsState, setBrandsState] = useState<Brand[]>(brands);
  const [materialsState, setMaterialsState] = useState<any[]>(materials);
  const [occasionsState, setOccasionsState] = useState<any[]>(occasions);
  const [seasonsState, setSeasonsState] = useState<any[]>(seasons);
  const [colorFamiliesState, setColorFamiliesState] = useState<any[]>(colorFamilies);
  const [patternsState, setPatternsState] = useState<any[]>(patterns);
  const [sleeveLengthsState, setSleeveLengthsState] = useState<any[]>(sleeveLengths);

  useEffect(() => {
    setCategoriesState(categories);
  }, [categories]);

  useEffect(() => {
    setBrandsState(brands);
  }, [brands]);

  useEffect(() => {
    setMaterialsState(materials);
  }, [materials]);

  useEffect(() => {
    setOccasionsState(occasions);
  }, [occasions]);

  useEffect(() => {
    setSeasonsState(seasons);
  }, [seasons]);

  useEffect(() => { setColorFamiliesState(colorFamilies); }, [colorFamilies]);
  useEffect(() => { setPatternsState(patterns); }, [patterns]);
  useEffect(() => { setSleeveLengthsState(sleeveLengths); }, [sleeveLengths]);

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateBrand, setShowCreateBrand] = useState(false);
  const [showCreateMaterial, setShowCreateMaterial] = useState(false);
  const [showCreateOccasion, setShowCreateOccasion] = useState(false);
  const [showCreateSeason, setShowCreateSeason] = useState(false);
  const [showCreateColorFamily, setShowCreateColorFamily] = useState(false);
  const [showCreatePattern, setShowCreatePattern] = useState(false);
  const [showCreateSleeveLength, setShowCreateSleeveLength] = useState(false);
  const [sizeInventory, setSizeInventory] = useState<Array<{ size: string; quantity: number }>>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    sku: product?.sku || '',
    price: product?.price || 0,
    salePrice: product?.salePrice || 0,
    stockQuantity: product?.stockQuantity || 0,
    stockStatus: product?.stockStatus || 'instock',
    weight: product?.weight || 0,
    dimensions: product?.dimensions || { length: 0, width: 0, height: 0 },
    manageStock: product?.manageStock ?? true,
    allowBackorders: product?.allowBackorders ?? false,
    status: product?.status || 'draft',
    categories: product?.categories || [],
    tags: product?.tags || [],
    brand: product?.brand || '',
    attributes: product?.attributes || [],
    variations: product?.variations || [],
    images: product?.images || [],
    features: product?.features || [],
    colors: product?.colors || [],
    material: product?.material || '',
    collectionName: product?.collectionName || '',
    useCase: product?.useCase || '',
    careInstructions: product?.careInstructions || '',
    colorFamily: product?.colorFamily || '',
    pattern: product?.pattern || '',
    ageGroup: product?.ageGroup || '',
    isLimitedEdition: product?.isLimitedEdition || false,
    isCustomMade: product?.isCustomMade || false,
    customDeliveryDays: product?.customDeliveryDays || 0,
    sizeChart: product?.sizeChart || '',
    sizeChartImageUrl: product?.sizeChartImageUrl || '',
    availableSizes: product?.availableSizes || [],
    seo: product?.seo || {
      title: '',
      description: '',
      keywords: [],
      slug: '',
      canonicalUrl: '',
      ogImage: '',
      noIndex: false,
      noFollow: false,
    },
    isActive: product?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: '📝' },
    { id: 'type-specific', name: 'Product Type', icon: '🎯' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'shipping', name: 'Shipping', icon: '🚚' },
    { id: 'attributes', name: 'Attributes', icon: '🏷️' },
    { id: 'images', name: 'Images', icon: '🖼️' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
  ];

  // Helper function to extract ID from object or string
  const extractId = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && '_id' in value) return value._id;
    return '';
  };

  // Helper function to extract category IDs
  const extractCategoryIds = (categories: any): string[] => {
    if (!categories) return [];
    if (Array.isArray(categories)) {
      return categories.map(cat => extractId(cat)).filter(id => id);
    }
    const id = extractId(categories);
    return id ? [id] : [];
  };

  // Update formData when product changes (important for async loading)
  useEffect(() => {
    if (product) {
      // Extract category ID(s) - handle both array and single value, object and string
      const categoryIds = extractCategoryIds(product.categories);
      
      // Extract brand ID - handle both object and string
      const brandId = extractId(product.brand || product.brandId);

      setFormData(prev => ({
        ...prev,
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        sku: product.sku || '',
        price: product.price || 0,
        salePrice: product.salePrice || 0,
        stockQuantity: product.stockQuantity || 0,
        stockStatus: product.stockStatus || 'instock',
        weight: product.weight || 0,
        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
        manageStock: product.manageStock ?? true,
        allowBackorders: product.allowBackorders ?? false,
        status: product.status || 'draft',
        categories: categoryIds.length > 0 ? categoryIds : [],
        tags: product.tags || [],
        brand: brandId,
        attributes: product.attributes || [],
        variations: product.variations || [],
        images: product.images || [],
        features: product.features || [],
        colors: product.colors || [],
        material: product.material || '',
        collectionName: product.collectionName || '',
        useCase: product.useCase || '',
        careInstructions: product.careInstructions || '',
        colorFamily: product.colorFamily || '',
        pattern: product.pattern || '',
        ageGroup: product.ageGroup || '',
        gradeLevel: product.gradeLevel || '',
        isLimitedEdition: product.isLimitedEdition || false,
        isCustomMade: product.isCustomMade || false,
        customDeliveryDays: product.customDeliveryDays || 0,
        sizeChart: product.sizeChart || '',
        sizeChartImageUrl: product.sizeChartImageUrl || '',
        availableSizes: product.availableSizes || [],
        // Book specific fields
        author: product.author || '',
        publisher: product.publisher || '',
        isbn: product.isbn || '',
        edition: product.edition || '',
        pageCount: product.pageCount || 0,
        language: product.language || '',
        bindingType: product.bindingType || '',
        subject: product.subject || '',
        specialFeatures: product.specialFeatures || [],
        format: product.format || '',
        // Uniform specific fields
        isUniform: product.isUniform || false,
        uniformType: product.uniformType || '',
        gender: product.gender || '',
        uniformSize: product.uniformSize || '',
        // Book set specific fields
        isBookSet: product.isBookSet || false,
        bookSetType: product.bookSetType || '',
        classLevel: product.classLevel || '',
        schoolName: product.schoolName || '',
        board: product.board || '',
        setItems: product.setItems || [],
        totalBooksInSet: product.totalBooksInSet || 0,
        seo: product.seo || {
          title: '',
          description: '',
          keywords: [],
          slug: '',
          canonicalUrl: '',
          ogImage: '',
          noIndex: false,
          noFollow: false,
        },
        isActive: product.isActive ?? true,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
    
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleNestedFieldChange = (parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof Product] as any),
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Product description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    } else if (!/^[A-Za-z0-9._-]+$/.test(formData.sku.trim())) {
      newErrors.sku = 'SKU can only contain letters, numbers, dashes, underscores, and dots';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stockQuantity === undefined || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }

    // Pricing relationship validation
    const priceNum = Number(formData.price || 0);
    const salePriceNum = Number(formData.salePrice || 0);
    if (salePriceNum > 0 && priceNum > 0 && salePriceNum >= priceNum) {
      newErrors.salePrice = 'Sale price must be less than regular price';
    }

    // Category required
    const categoriesVal = Array.isArray(formData.categories) ? formData.categories : (formData.categories ? [formData.categories as any] : []);
    if (!categoriesVal || categoriesVal.length === 0) {
      newErrors.categories = 'Please select a category';
    }

    // At least one image recommended/required
    if (!formData.images || (Array.isArray(formData.images) && formData.images.length === 0)) {
      newErrors.images = 'Please add at least one product image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    if (!validateForm()) {
      setActiveTab('general');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        status,
        sizeInventory: sizeInventory.length > 0 ? sizeInventory : undefined,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      // Surface server response if available
      const serverData = (error as any)?.response?.data;
      console.error('Error saving product:', error, serverData);
    }
  };

  const handleDelete = async () => {
    if (!product?._id || !onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await onDelete(product._id);
        navigate('/dashboard/products');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handlePreview = () => {
    // Open product preview in new tab
    if (product?.slug) {
      window.open(`/products/${product.slug}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/products')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Products
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              {isEditing && (
                <>
                  <button
                    onClick={handlePreview}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
              
              <button
                onClick={() => handleSave('draft')}
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={() => handleSave('published')}
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isLoading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFormTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white shadow-sm rounded-lg">
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'general' && (
                  <ProductFormBasic
                    formData={formData}
                    errors={errors}
                    categories={categoriesState}
                    brands={brandsState}
                    materials={materialsState}
                    occasions={occasionsState}
                    seasons={seasonsState}
                    colorFamilies={colorFamiliesState}
                    patterns={patternsState}
                    sleeveLengths={sleeveLengthsState}
                    onAddCategory={() => setShowCreateCategory(true)}
                    onAddBrand={() => setShowCreateBrand(true)}
                    onAddMaterial={() => setShowCreateMaterial(true)}
                    onAddOccasion={() => setShowCreateOccasion(true)}
                    onAddSeason={() => setShowCreateSeason(true)}
                    onAddColorFamily={() => setShowCreateColorFamily(true)}
                    onAddPattern={() => setShowCreatePattern(true)}
                    onAddSleeveLength={() => setShowCreateSleeveLength(true)}
                    onFieldChange={handleFieldChange}
                    onNestedFieldChange={handleNestedFieldChange}
                  />
                )}

                {activeTab === 'type-specific' && (
                  <ProductFormTypeSpecific
                    formData={formData}
                    errors={errors}
                    categories={categoriesState}
                    materials={materialsState}
                    colorFamilies={colorFamiliesState}
                    patterns={patternsState}
                    ageGroups={ageGroups}
                    products={products}
                    onFieldChange={handleFieldChange}
                    onNestedFieldChange={handleNestedFieldChange}
                  />
                )}

                {activeTab === 'inventory' && (
                  <ProductFormInventory
                    formData={formData}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                    onSizeInventoryChange={setSizeInventory}
                  />
                )}

                {activeTab === 'shipping' && (
                  <ProductFormShipping
                    formData={formData}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                  />
                )}

                {activeTab === 'attributes' && (
                  <ProductFormAttributes
                    formData={formData}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                  />
                )}

                {activeTab === 'images' && (
                  <ProductFormImages
                    formData={formData}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                  />
                )}

                {activeTab === 'seo' && (
                  <ProductFormSEO
                    formData={formData}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                    onNestedFieldChange={handleNestedFieldChange}
                  />
                )}
              </div>

              {/* Bottom Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {hasUnsavedChanges && (
                      <span className="text-orange-600">• You have unsaved changes</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate('/dashboard/products')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('draft')}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => handleSave('published')}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Category - full form modal */}
      {showCreateCategory && (
        <CategoryForm
          parentCategories={categoriesState}
          onCancel={() => setShowCreateCategory(false)}
          onSubmit={async (categoryData) => {
            const res = await categoryService.createCategory(categoryData);
            if (res.success && res.data) {
              const newCategory = res.data;
              setCategoriesState(prev => [newCategory, ...prev]);
              handleFieldChange('categories', [newCategory._id]);
              setShowCreateCategory(false);
            } else {
              throw new Error(res.message || 'Failed to create category');
            }
          }}
        />
      )}

      {/* Create Brand - full form modal */}
      {showCreateBrand && (
        <BrandForm
          onCancel={() => setShowCreateBrand(false)}
          onSubmit={async (brandData) => {
            const res = await brandService.createBrand(brandData);
            if (res.success && res.data) {
              const newBrand = res.data;
              setBrandsState(prev => [newBrand, ...prev]);
              handleFieldChange('brand', newBrand._id);
              setShowCreateBrand(false);
            } else {
              throw new Error(res.message || 'Failed to create brand');
            }
          }}
        />
      )}

      {/* Create Material (Fabric) */}
      <CreateItemModal
        isOpen={showCreateMaterial}
        title="Add New Fabric Type"
        onClose={() => setShowCreateMaterial(false)}
        onSubmit={async (values) => {
          const res = await materialService.create({ name: values.name, description: values.description });
          if (res.success && res.data) {
            const newMaterial = res.data;
            setMaterialsState(prev => [newMaterial, ...prev]);
            handleFieldChange('material', newMaterial.name);
            setShowCreateMaterial(false);
          } else {
            throw new Error(res.message || 'Failed to create fabric type');
          }
        }}
      />

      {/* Create Occasion */}
      <CreateItemModal
        isOpen={showCreateOccasion}
        title="Add New Occasion"
        onClose={() => setShowCreateOccasion(false)}
        onSubmit={async (values) => {
          const res = await occasionService.create({ name: values.name, description: values.description });
          if (res.success && res.data) {
            const newOccasion = res.data;
            setOccasionsState(prev => [newOccasion, ...prev]);
            handleFieldChange('useCase', newOccasion.name);
            setShowCreateOccasion(false);
          } else {
            throw new Error(res.message || 'Failed to create occasion');
          }
        }}
      />

      {/* Create Season */}
      <CreateItemModal
        isOpen={showCreateSeason}
        title="Add New Season"
        onClose={() => setShowCreateSeason(false)}
        onSubmit={async (values) => {
          const res = await seasonService.create({ name: values.name, description: values.description });
          if (res.success && res.data) {
            const newSeason = res.data;
            setSeasonsState(prev => [newSeason, ...prev]);
            // Season field doesn't exist on Product type - removed
            setShowCreateSeason(false);
          } else {
            throw new Error(res.message || 'Failed to create season');
          }
        }}
      />

      {/* Create Color Family */}
      <CreateItemModal
        isOpen={showCreateColorFamily}
        title="Add New Color Family"
        onClose={() => setShowCreateColorFamily(false)}
        onSubmit={async (values) => {
          const res = await colorFamilyService.create({ name: values.name, description: values.description });
          if (res.success && res.data) {
            const item = res.data;
            setColorFamiliesState(prev => [item, ...prev]);
            handleFieldChange('colorFamily', item.name);
            setShowCreateColorFamily(false);
          } else {
            throw new Error(res.message || 'Failed to create color family');
          }
        }}
      />

      {/* Create Pattern */}
      <CreateItemModal
        isOpen={showCreatePattern}
        title="Add New Pattern"
        onClose={() => setShowCreatePattern(false)}
        onSubmit={async (values) => {
          const res = await patternService.create({ name: values.name, description: values.description });
          if (res.success && res.data) {
            const item = res.data;
            setPatternsState(prev => [item, ...prev]);
            handleFieldChange('pattern', item.name);
            setShowCreatePattern(false);
          } else {
            throw new Error(res.message || 'Failed to create pattern');
          }
        }}
      />

      {/* Create Sleeve Length */}
      <CreateItemModal
        isOpen={showCreateSleeveLength}
        title="Add New Sleeve Length"
        onClose={() => setShowCreateSleeveLength(false)}
        onSubmit={async (values) => {
          const res = await sleeveLengthService.create({ name: values.name, description: values.description });
          if (res.success && res.data) {
            const item = res.data;
            setSleeveLengthsState(prev => [item, ...prev]);
            // SleeveLength field doesn't exist on Product type - removed
            setShowCreateSleeveLength(false);
          } else {
            throw new Error(res.message || 'Failed to create sleeve length');
          }
        }}
      />
    </div>
  );
};

export default ProductFormPage;
