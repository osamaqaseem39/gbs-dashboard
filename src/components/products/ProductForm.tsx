import React, { useEffect, useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Product, Category, Brand, ProductVariant } from '../../types';
import TagsModal from './modals/TagsModal';
import KeywordsModal from './modals/KeywordsModal';
import SizesModal from './modals/SizesModal';
import FeaturesModal from './modals/FeaturesModal';
import ColorsModal from './modals/ColorsModal';
import AttributesModal from './modals/AttributesModal';
import ImageUpload from '../common/ImageUpload';
import QuickAddMasterDataModal from '../master-data/QuickAddMasterDataModal';
import { 
  colorFamilyService,
  patternService,
  sleeveLengthService,
  materialService,
  occasionService,
  seasonService,
  sizeService,
  Size,
} from '../../services/masterDataService';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  brands: Brand[];
  onSubmit: (productData: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  type: string;
  categoryId: string;
  brandId: string;
  tags: string[];
  isActive: boolean;
  status: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
    canonicalUrl: string;
    ogImage: string;
    noIndex: boolean;
    noFollow: boolean;
  };
  variants: Omit<ProductVariant, '_id'>[];
  images: string[];
  // UI-specific fields
  features?: string[];
  colors?: Array<{
    colorId: string;
    imageUrl?: string;
  }>;
  attributes: string[];
  // Stationery & Book Specific Fields
  material?: string;
  collectionName?: string;
  useCase?: string;
  subject?: string;
  careInstructions?: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  edition?: string;
  pageCount?: number;
  language?: string;
  bindingType?: string;
  specialFeatures?: string[];
  colorFamily?: string;
  pattern?: string;
  format?: string;
  ageGroup?: string;
  gradeLevel?: string;
  isLimitedEdition?: boolean;
  isCustomMade?: boolean;
  customDeliveryDays?: number;
  sizeChart?: string;
  sizeChartImageUrl?: string;
  availableSizes?: string[];
  // Uniform Specific Fields
  isUniform?: boolean;
  uniformType?: string;
  gender?: string;
  uniformSize?: string;
  // Book Set Specific Fields
  isBookSet?: boolean;
  bookSetType?: 'class' | 'school' | 'subject' | 'custom';
  classLevel?: string;
  schoolName?: string;
  board?: string;
  setItems?: Array<{
    bookId?: string;
    bookName: string;
    subject?: string;
    quantity: number;
  }>;
  totalBooksInSet?: number;
  modelMeasurements?: {
    height?: string;
  };
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  brands,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    type: product?.type || 'simple',
    categoryId: product?.categoryId
      ? (typeof product.categoryId === 'object' && '_id' in product.categoryId
        ? (product.categoryId as any)._id
        : typeof product.categoryId === 'string'
        ? product.categoryId
        : Array.isArray(product.categories) && product.categories.length > 0
        ? (typeof product.categories[0] === 'object' && '_id' in product.categories[0]
          ? (product.categories[0] as any)._id
          : product.categories[0] as string)
        : '')
      : '',
    brandId: product?.brandId
      ? (typeof product.brandId === 'object' && '_id' in product.brandId
        ? (product.brandId as any)._id
        : typeof product.brandId === 'string'
        ? product.brandId
        : typeof product.brand === 'object' && product.brand && '_id' in product.brand
        ? (product.brand as any)._id
        : typeof product.brand === 'string'
        ? product.brand
        : '')
      : '',
    tags: product?.tags || [],
    isActive: product?.isActive ?? true,
    status: product?.status || 'draft',
    // SEO
    seo: {
      title: product?.seo?.title || '',
      description: product?.seo?.description || '',
      keywords: product?.seo?.keywords || [],
      slug: product?.seo?.slug || '',
      canonicalUrl: product?.seo?.canonicalUrl || '',
      ogImage: product?.seo?.ogImage || '',
      noIndex: product?.seo?.noIndex ?? false,
      noFollow: product?.seo?.noFollow ?? false,
    },
    // Variants
    variants: product?.variants || [
      {
        sku: '',
        name: 'Default Variant',
        price: 0,
        comparePrice: 0,
        costPrice: 0,
        stockQuantity: 0,
        stockStatus: 'instock' as const,
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        attributes: {},
        images: [],
        isActive: true,
      },
    ].map((variant: any) => {
      // Clean dimensions to remove _id if present
      if (variant.dimensions && variant.dimensions._id) {
        const { _id, ...cleanDimensions } = variant.dimensions;
        return { ...variant, dimensions: cleanDimensions };
      }
      return variant;
    }),
    // Images - extract URLs if objects, filter out ObjectIds (24 hex chars) that aren't URLs
    images: (product?.images || []).map((img: any) => {
      if (typeof img === 'string') {
        // Check if it's a valid URL (starts with http/https) or if it's an ObjectId
        // ObjectIds are 24 hex characters, URLs start with http/https
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
          return img;
        }
        // If it looks like an ObjectId (24 hex chars), filter it out - it's not a valid image URL
        if (/^[0-9a-fA-F]{24}$/.test(img)) {
          return null; // Filter out ObjectIds
        }
        return img; // Keep other strings that might be relative paths
      }
      return img?.url || null;
    }).filter((img: any) => img !== null && img !== undefined),
    // UI-specific fields
    features: product?.features || [],
    colors: product?.colors || [],
    attributes: product?.attributes || [],
    // Stationery & Book Specific Fields
    material: product?.material || '',
    collectionName: product?.collectionName || '',
    useCase: product?.useCase || '',
    subject: product?.subject || '',
    careInstructions: product?.careInstructions || '',
    author: product?.author || '',
    publisher: product?.publisher || '',
    isbn: product?.isbn || '',
    edition: product?.edition || '',
    pageCount: product?.pageCount || 0,
    language: product?.language || '',
    bindingType: product?.bindingType || '',
    specialFeatures: product?.specialFeatures || [],
    colorFamily: product?.colorFamily || '',
    pattern: product?.pattern || '',
    format: product?.format || '',
    ageGroup: product?.ageGroup || '',
    gradeLevel: product?.gradeLevel || '',
    isLimitedEdition: product?.isLimitedEdition || false,
    isCustomMade: product?.isCustomMade || false,
    customDeliveryDays: product?.customDeliveryDays || 0,
    sizeChart: product?.sizeChart || '',
    sizeChartImageUrl: product?.sizeChartImageUrl || '',
    availableSizes: product?.availableSizes || [],
    // Uniform Specific Fields
    isUniform: product?.isUniform || false,
    uniformType: product?.uniformType || '',
    gender: product?.gender || '',
    uniformSize: product?.uniformSize || '',
    // Book Set Specific Fields
    isBookSet: product?.isBookSet || false,
    bookSetType: product?.bookSetType || 'class',
    classLevel: product?.classLevel || '',
    schoolName: product?.schoolName || '',
    board: product?.board || '',
    setItems: product?.setItems || [],
    totalBooksInSet: product?.totalBooksInSet || 0,
    modelMeasurements: product?.modelMeasurements || { height: '' },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  // Update form data when product prop changes (important for edit mode when product loads asynchronously)
  useEffect(() => {
    if (product) {
      // Extract categoryId - handle both object and string formats
      const categoryId = typeof product.categoryId === 'object' && product.categoryId && '_id' in product.categoryId
        ? (product.categoryId as any)._id
        : typeof product.categoryId === 'string'
        ? product.categoryId
        : Array.isArray(product.categories) && product.categories.length > 0
        ? (typeof product.categories[0] === 'object' && product.categories[0] && '_id' in product.categories[0]
          ? (product.categories[0] as any)._id
          : product.categories[0] as string)
        : '';
      
      // Extract brandId - handle both object and string formats
      const brandId = typeof product.brandId === 'object' && product.brandId && '_id' in product.brandId
        ? (product.brandId as any)._id
        : typeof product.brandId === 'string'
        ? product.brandId
        : typeof product.brand === 'object' && product.brand && '_id' in product.brand
        ? (product.brand as any)._id
        : typeof product.brand === 'string'
        ? product.brand
        : '';
      
      setFormData(prev => ({
        ...prev,
        name: product.name || prev.name,
        description: product.description || prev.description,
        type: product.type || prev.type,
        categoryId: categoryId || prev.categoryId,
        brandId: brandId || prev.brandId,
        tags: product.tags || prev.tags,
        isActive: product.isActive ?? prev.isActive,
        status: product.status || prev.status,
        seo: {
          title: product.seo?.title || prev.seo.title,
          description: product.seo?.description || prev.seo.description,
          keywords: product.seo?.keywords || prev.seo.keywords,
          slug: product.seo?.slug || prev.seo.slug,
          canonicalUrl: product.seo?.canonicalUrl || prev.seo.canonicalUrl,
          ogImage: product.seo?.ogImage || prev.seo.ogImage,
          noIndex: product.seo?.noIndex ?? prev.seo.noIndex,
          noFollow: product.seo?.noFollow ?? prev.seo.noFollow,
        },
        variants: product.variants && product.variants.length > 0
          ? product.variants.map((variant: any) => {
              if (variant.dimensions && variant.dimensions._id) {
                const { _id, ...cleanDimensions } = variant.dimensions;
                return { ...variant, dimensions: cleanDimensions };
              }
              return variant;
            })
          : prev.variants,
        images: (product.images || []).map((img: any) => {
          if (typeof img === 'string') {
            if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
              return img;
            }
            if (/^[0-9a-fA-F]{24}$/.test(img)) {
              return null;
            }
            return img;
          }
          return img?.url || null;
        }).filter((img: any) => img !== null && img !== undefined),
      }));
    }
  }, [product]);
  
  // Modal states
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState(false);
  const [isSizesModalOpen, setIsSizesModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
  // Quick add modal states
  const [quickAdd, setQuickAdd] = useState<{
    type: null | 'Color Family' | 'Pattern' | 'Sleeve Length' | 'Fabric' | 'Occasion' | 'Season';
  }>({ type: null });

  // Local option lists to allow appending newly created values
  const [fabricOptions, setFabricOptions] = useState<string[]>([]);
  const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
  const [seasonOptions, setSeasonOptions] = useState<string[]>([]);
  const [colorFamilyOptions, setColorFamilyOptions] = useState<string[]>([]);
  const [patternOptions, setPatternOptions] = useState<string[]>([]);
  const [sleeveLengthOptions, setSleeveLengthOptions] = useState<string[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState<boolean>(false);
  const [sizeNamesMap, setSizeNamesMap] = useState<Record<string, string>>({});

  // Load master data options
  useEffect(() => {
    let isMounted = true;
    const loadOptions = async () => {
      try {
        setIsOptionsLoading(true);
        const [
          colorFamiliesRes,
          patternsRes,
          sleeveLengthsRes,
          fabricsRes,
          occasionsRes,
          seasonsRes,
        ] = await Promise.all([
          colorFamilyService.getAll(),
          patternService.getAll(),
          sleeveLengthService.getAll(),
          materialService.getAll(),
          occasionService.getAll(),
          seasonService.getAll(),
        ]);

        if (!isMounted) return;

        const sortByName = (arr: any[]) => arr.map((i: any) => i.name).sort((a: string, b: string) => a.localeCompare(b));
        if (colorFamiliesRes.success && colorFamiliesRes.data) setColorFamilyOptions(sortByName(colorFamiliesRes.data));
        if (patternsRes.success && patternsRes.data) setPatternOptions(sortByName(patternsRes.data));
        if (sleeveLengthsRes.success && sleeveLengthsRes.data) setSleeveLengthOptions(sortByName(sleeveLengthsRes.data));
        if (fabricsRes.success && fabricsRes.data) setFabricOptions(sortByName(fabricsRes.data));
        if (occasionsRes.success && occasionsRes.data) setOccasionOptions(sortByName(occasionsRes.data));
        if (seasonsRes.success && seasonsRes.data) setSeasonOptions(sortByName(seasonsRes.data));
      } catch (err) {
        // Swallow errors, keep defaults
        console.error('Failed to load master data options', err);
      } finally {
        setIsOptionsLoading(false);
      }
    };
    loadOptions();
    return () => { isMounted = false; };
  }, []);

  // Fetch size names when availableSizes change
  useEffect(() => {
    const fetchSizeNames = async () => {
      if (!formData.availableSizes || formData.availableSizes.length === 0) {
        setSizeNamesMap({});
        return;
      }

      try {
        const response = await sizeService.getAll();
        if (response.success && response.data) {
          const namesMap: Record<string, string> = {};
          response.data.forEach((size: Size) => {
            if (formData.availableSizes?.includes(size._id)) {
              namesMap[size._id] = size.name;
            }
          });
          setSizeNamesMap(namesMap);
        }
      } catch (error) {
        console.error('Error fetching size names:', error);
      }
    };

    fetchSizeNames();
  }, [formData.availableSizes]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (formData.variants.length === 0) {
      newErrors.variants = 'At least one variant is required';
    }

    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.sku.trim()) {
        newErrors[`variant-${index}-sku`] = 'SKU is required';
      }
      if (!variant.name.trim()) {
        newErrors[`variant-${index}-name`] = 'Variant name is required';
      }
      if (variant.price <= 0) {
        newErrors[`variant-${index}-price`] = 'Price must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert images from URLs to objects with position
    const imageObjects = formData.images.map((url, index) => ({
      url: url,
      altText: formData.name, // Use product name as alt text
      position: index,
    }));

    // Convert form data to Product format
    // Note: We cast images as any[] to satisfy the union type
    const productData: Partial<Product> = {
      name: formData.name,
      description: formData.description,
      type: formData.type as any,
      tags: formData.tags,
      isActive: formData.isActive,
      status: formData.status as any,
      seo: formData.seo,
      variants: formData.variants.map(variant => {
        // Clean dimensions to remove _id if present
        const dimensions = variant.dimensions || { length: 0, width: 0, height: 0 };
        const cleanDimensions = '_id' in dimensions ? (({ _id, ...rest }) => rest)(dimensions as any) : dimensions;
        return {
          ...variant,
          _id: '', // Add empty _id for new variants
          dimensions: cleanDimensions,
        };
      }),
      images: imageObjects as any,
      // UI-specific fields
      features: formData.features && formData.features.length > 0 ? formData.features : undefined,
      colors: formData.colors && formData.colors.length > 0 ? formData.colors : undefined,
      attributes: formData.attributes && formData.attributes.length > 0 ? formData.attributes : undefined,
      // Stationery & Book Specific Fields
      material: formData.material || undefined,
      collectionName: formData.collectionName || undefined,
      useCase: formData.useCase || undefined,
      subject: formData.subject || undefined,
      careInstructions: formData.careInstructions || undefined,
      author: formData.author || undefined,
      publisher: formData.publisher || undefined,
      isbn: formData.isbn || undefined,
      edition: formData.edition || undefined,
      pageCount: formData.pageCount || undefined,
      language: formData.language || undefined,
      bindingType: formData.bindingType || undefined,
      specialFeatures: formData.specialFeatures && formData.specialFeatures.length > 0 ? formData.specialFeatures : undefined,
      colorFamily: formData.colorFamily || undefined,
      pattern: formData.pattern || undefined,
      format: formData.format || undefined,
      ageGroup: formData.ageGroup || undefined,
      gradeLevel: formData.gradeLevel || undefined,
      // Uniform Specific Fields
      isUniform: formData.isUniform || undefined,
      uniformType: formData.uniformType || undefined,
      gender: formData.gender || undefined,
      uniformSize: formData.uniformSize || undefined,
      // Book Set Specific Fields
      isBookSet: formData.isBookSet || undefined,
      bookSetType: formData.bookSetType || undefined,
      classLevel: formData.classLevel || undefined,
      schoolName: formData.schoolName || undefined,
      board: formData.board || undefined,
      setItems: formData.setItems && formData.setItems.length > 0 ? formData.setItems : undefined,
      totalBooksInSet: formData.totalBooksInSet || undefined,
      isLimitedEdition: formData.isLimitedEdition || undefined,
      isCustomMade: formData.isCustomMade || undefined,
      customDeliveryDays: formData.customDeliveryDays && formData.customDeliveryDays > 0 ? formData.customDeliveryDays : undefined,
      sizeChart: formData.sizeChart || undefined,
      sizeChartImageUrl: formData.sizeChartImageUrl || undefined,
      availableSizes: formData.availableSizes && formData.availableSizes.length > 0 ? formData.availableSizes : undefined,
    };

    // Add category and brand if selected
    if (formData.categoryId) {
      const selectedCategory = categories.find(cat => cat._id === formData.categoryId);
      if (selectedCategory) {
        productData.categoryId = selectedCategory;
      }
    }

    if (formData.brandId) {
      const selectedBrand = brands.find(brand => brand._id === formData.brandId);
      if (selectedBrand) {
        productData.brandId = selectedBrand;
      }
    }

    await onSubmit(productData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
    
    // Clear variant-specific error
    const errorKey = `variant-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: '',
      }));
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: '',
          name: `Variant ${prev.variants.length + 1}`,
          price: 0,
          comparePrice: 0,
          costPrice: 0,
          stockQuantity: 0,
          stockStatus: 'instock' as const,
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          attributes: {},
          images: [],
          isActive: true,
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Basic Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('properties')}
              className={`${
                activeTab === 'properties'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Product Properties
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('measurements')}
              className={`${
                activeTab === 'measurements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Measurements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`${
                activeTab === 'features'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Features & Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`${
                activeTab === 'images'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Images
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`${
                activeTab === 'seo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              SEO
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={`input-field ${errors.type ? 'border-red-300' : ''}`}
              >
                <option value="simple">Simple Product</option>
                <option value="variable">Variable Product</option>
                <option value="grouped">Grouped Product</option>
                <option value="external">External Product</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className={`input-field ${errors.categoryId ? 'border-red-300' : ''}`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={formData.brandId}
                onChange={(e) => handleChange('brandId', e.target.value)}
                className="input-field"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`input-field ${errors.description ? 'border-red-300' : ''}`}
                rows={4}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <button
                type="button"
                onClick={() => setIsTagsModalOpen(true)}
                className="btn btn-secondary text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Manage Tags
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                </span>
              ))}
              {formData.tags.length === 0 && (
                <span className="text-gray-500 text-sm">No tags added</span>
              )}
            </div>
          </div>

          {/* Product Variants */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="btn btn-secondary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Variant
              </button>
            </div>

            {errors.variants && (
              <p className="mb-2 text-sm text-red-600">{errors.variants}</p>
            )}

            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">
                      Variant {index + 1}
                    </h4>
                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU *
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        className={`input-field ${errors[`variant-${index}-sku`] ? 'border-red-300' : ''}`}
                        placeholder="SKU"
                      />
                      {errors[`variant-${index}-sku`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-sku`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className={`input-field ${errors[`variant-${index}-name`] ? 'border-red-300' : ''}`}
                        placeholder="Variant name"
                      />
                      {errors[`variant-${index}-name`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price === 0 ? '' : variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                        className={`input-field ${errors[`variant-${index}-price`] ? 'border-red-300' : ''}`}
                        placeholder="0.00"
                      />
                      {errors[`variant-${index}-price`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-price`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compare Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.comparePrice === 0 ? '' : (variant.comparePrice || '')}
                        onChange={(e) => handleVariantChange(index, 'comparePrice', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.costPrice === 0 ? '' : (variant.costPrice || '')}
                        onChange={(e) => handleVariantChange(index, 'costPrice', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.weight === 0 ? '' : variant.weight}
                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={variant.dimensions.length === 0 ? '' : variant.dimensions.length}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          length: e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0),
                        })}
                        className="input-field"
                        placeholder="0.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={variant.dimensions.width === 0 ? '' : variant.dimensions.width}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          width: e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0),
                        })}
                        className="input-field"
                        placeholder="0.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={variant.dimensions.height === 0 ? '' : variant.dimensions.height}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          height: e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0),
                        })}
                        className="input-field"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.isActive}
                        onChange={(e) => handleVariantChange(index, 'isActive', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>

                  {/* Variant Images */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variant Images
                    </label>
                    <ImageUpload
                      existingImages={variant.images || []}
                      onImageUpload={(url) => {
                        handleVariantChange(index, 'images', [...(variant.images || []), url]);
                      }}
                      onImageRemove={(imgIndex) => {
                        const next = [...(variant.images || [])];
                        next.splice(imgIndex, 1);
                        handleVariantChange(index, 'images', next);
                      }}
                      maxImages={10}
                    />
                    <p className="mt-1 text-xs text-gray-500">Upload multiple images specific to this variant.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo.title}
                    onChange={(e) => handleChange('seo', { ...formData.seo, title: e.target.value })}
                    className="input-field"
                    placeholder="SEO title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Slug
                  </label>
                  <input
                    type="text"
                    value={formData.seo.slug}
                    onChange={(e) => handleChange('seo', { ...formData.seo, slug: e.target.value })}
                    className="input-field"
                    placeholder="seo-friendly-url"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seo.description}
                    onChange={(e) => handleChange('seo', { ...formData.seo, description: e.target.value })}
                    rows={3}
                    className="input-field"
                    placeholder="Meta description for search engines"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Keywords
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsKeywordsModalOpen(true)}
                      className="btn btn-secondary text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Manage Keywords
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    {formData.seo.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {keyword}
                      </span>
                    ))}
                    {formData.seo.keywords.length === 0 && (
                      <span className="text-gray-500 text-sm">No keywords added</span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.seo.noIndex}
                        onChange={(e) => handleChange('seo', { ...formData.seo, noIndex: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">No Index</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.seo.noFollow}
                        onChange={(e) => handleChange('seo', { ...formData.seo, noFollow: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">No Follow</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Properties Tab */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              {/* Row 1: Material, Collection, Use Case, Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Material/Paper Type</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Fabric' })}>+ Add new material</button>
                </div>
                <select
                  value={formData.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Material</option>
                  {fabricOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection/Series
                </label>
                <input
                  type="text"
                  value={formData.collectionName}
                  onChange={(e) => handleChange('collectionName', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Book Series Name"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Use Case</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Occasion' })}>+ Add new use case</button>
                </div>
                <select
                  value={formData.useCase}
                  onChange={(e) => handleChange('useCase', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Use Case</option>
                  {occasionOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Mathematics, Science"
                />
              </div>
            </div>

            {/* Row 2: Author, Publisher, Language, Binding Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="input-field"
                  placeholder="Author Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publisher
                </label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => handleChange('publisher', e.target.value)}
                  className="input-field"
                  placeholder="Publisher Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="input-field"
                  placeholder="e.g., English, Urdu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Binding Type
                </label>
                <select
                  value={formData.bindingType}
                  onChange={(e) => handleChange('bindingType', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Binding</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="Paperback">Paperback</option>
                  <option value="Spiral">Spiral</option>
                  <option value="Wire-O">Wire-O</option>
                  <option value="Perfect Bound">Perfect Bound</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Color Family</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Color Family' })}>+ Add new color family</button>
                </div>
                <select
                  value={formData.colorFamily}
                  onChange={(e) => handleChange('colorFamily', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Color Family</option>
                  {colorFamilyOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Pattern</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Pattern' })}>+ Add new pattern</button>
                </div>
                <select
                  value={formData.pattern}
                  onChange={(e) => handleChange('pattern', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Pattern</option>
                  {patternOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format/Size
                </label>
                <input
                  type="text"
                  value={formData.format}
                  onChange={(e) => handleChange('format', e.target.value)}
                  className="input-field"
                  placeholder="e.g., A4, A5, Letter"
                />
              </div>
            </div>

            {/* Row 3: Grade Level, Age Group, ISBN, Edition */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade/Class Level
                </label>
                <input
                  type="text"
                  value={formData.gradeLevel}
                  onChange={(e) => handleChange('gradeLevel', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Class 1, Grade 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <input
                  type="text"
                  value={formData.ageGroup}
                  onChange={(e) => handleChange('ageGroup', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 5-7 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => handleChange('isbn', e.target.value)}
                  className="input-field"
                  placeholder="ISBN number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edition
                </label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={(e) => handleChange('edition', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 1st Edition, 2024"
                />
              </div>
            </div>

            {/* Uniform Section */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.isUniform || false}
                  onChange={(e) => handleChange('isUniform', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-lg font-medium text-gray-900">
                  This is a Uniform
                </label>
              </div>

              {formData.isUniform && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uniform Type
                    </label>
                    <select
                      value={formData.uniformType || ''}
                      onChange={(e) => handleChange('uniformType', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select Type</option>
                      <option value="School Uniform">School Uniform</option>
                      <option value="Sports Uniform">Sports Uniform</option>
                      <option value="House Uniform">House Uniform</option>
                      <option value="Formal Uniform">Formal Uniform</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select Gender</option>
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={formData.uniformSize || ''}
                      onChange={(e) => handleChange('uniformSize', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="XXXL">XXXL</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Book Set Section */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.isBookSet || false}
                  onChange={(e) => handleChange('isBookSet', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-lg font-medium text-gray-900">
                  This is a Book Set
                </label>
              </div>

              {formData.isBookSet && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Book Set Type
                      </label>
                      <select
                        value={formData.bookSetType || 'class'}
                        onChange={(e) => handleChange('bookSetType', e.target.value)}
                        className="input-field"
                      >
                        <option value="class">Class-wise</option>
                        <option value="school">School-wise</option>
                        <option value="subject">Subject-wise</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class/Grade Level
                      </label>
                      <input
                        type="text"
                        value={formData.classLevel || ''}
                        onChange={(e) => handleChange('classLevel', e.target.value)}
                        className="input-field"
                        placeholder="e.g., Class 1, Grade 5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Name
                      </label>
                      <input
                        type="text"
                        value={formData.schoolName || ''}
                        onChange={(e) => handleChange('schoolName', e.target.value)}
                        className="input-field"
                        placeholder="School name (if school-specific)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Educational Board
                      </label>
                      <select
                        value={formData.board || ''}
                        onChange={(e) => handleChange('board', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select Board</option>
                        <option value="O-Levels Cambridge">O-Levels Cambridge</option>
                        <option value="A-Levels Cambridge">A-Levels Cambridge</option>
                        <option value="Matric Punjab Board">Matric Punjab Board</option>
                        <option value="Matric Sindh Board">Matric Sindh Board</option>
                        <option value="Matric KPK Board">Matric KPK Board</option>
                        <option value="Matric Balochistan Board">Matric Balochistan Board</option>
                        <option value="Federal Board">Federal Board</option>
                        <option value="IB">IB (International Baccalaureate)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Books in Set
                    </label>
                    <input
                      type="number"
                      value={formData.totalBooksInSet || 0}
                      onChange={(e) => handleChange('totalBooksInSet', parseInt(e.target.value) || 0)}
                      className="input-field w-32"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Books in Set
                    </label>
                    <div className="space-y-2">
                      {(formData.setItems || []).map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={item.bookName}
                            onChange={(e) => {
                              const newItems = [...(formData.setItems || [])];
                              newItems[index] = { ...item, bookName: e.target.value };
                              handleChange('setItems', newItems);
                            }}
                            className="input-field flex-1"
                            placeholder="Book name"
                          />
                          <input
                            type="text"
                            value={item.subject || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.setItems || [])];
                              newItems[index] = { ...item, subject: e.target.value };
                              handleChange('setItems', newItems);
                            }}
                            className="input-field w-32"
                            placeholder="Subject"
                          />
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...(formData.setItems || [])];
                              newItems[index] = { ...item, quantity: parseInt(e.target.value) || 1 };
                              handleChange('setItems', newItems);
                            }}
                            className="input-field w-20"
                            min="1"
                            placeholder="Qty"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = (formData.setItems || []).filter((_, i) => i !== index);
                              handleChange('setItems', newItems);
                            }}
                            className="px-3 py-2 text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = [...(formData.setItems || []), { bookName: '', subject: '', quantity: 1 }];
                          handleChange('setItems', newItems);
                        }}
                        className="btn btn-secondary text-sm"
                      >
                        + Add Book to Set
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Add Modal Dispatcher */}
            {quickAdd.type && (
              <QuickAddMasterDataModal
                isOpen={true}
                onClose={() => setQuickAdd({ type: null })}
                title={quickAdd.type}
                service={
                  quickAdd.type === 'Color Family' ? (colorFamilyService as any) :
                  quickAdd.type === 'Pattern' ? (patternService as any) :
                  quickAdd.type === 'Sleeve Length' ? (sleeveLengthService as any) :
                  quickAdd.type === 'Fabric' ? (materialService as any) :
                  quickAdd.type === 'Occasion' ? (occasionService as any) :
                  (seasonService as any)
                }
                onCreated={(created: any) => {
                  const name = created.name;
                  switch (quickAdd.type) {
                    case 'Color Family':
                      setColorFamilyOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('colorFamily', name);
                      break;
                    case 'Pattern':
                      setPatternOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('pattern', name);
                      break;
                    case 'Sleeve Length':
                      setSleeveLengthOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('sleeveLength', name);
                      break;
                    case 'Fabric':
                      setFabricOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('material', name);
                      break;
                    case 'Occasion':
                      setOccasionOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('useCase', name);
                      break;
                    case 'Season':
                      setSeasonOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('season', name);
                      break;
                  }
                  setQuickAdd({ type: null });
                }}
              />
            )}
          </div>
        )}

          {/* Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              {/* Model Measurements */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Height (for size reference)
                </label>
                <div className="w-full md:w-1/3">
                  <input
                    type="text"
                    value={formData.modelMeasurements?.height || ''}
                    onChange={(e) => handleChange('modelMeasurements', {
                      ...formData.modelMeasurements,
                      height: e.target.value,
                    })}
                    className="input-field"
                    placeholder="e.g., 5'6&quot;"
                  />
                </div>
              </div>

              {/* Available Sizes */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Sizes
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSizesModalOpen(true)}
                    className="btn btn-secondary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Sizes
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {formData.availableSizes?.map((sizeId, index) => (
                    <span
                      key={sizeId || index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      {sizeNamesMap[sizeId] || sizeId}
                    </span>
                  ))}
                  {(!formData.availableSizes || formData.availableSizes.length === 0) && (
                    <span className="text-gray-500 text-sm">No sizes added</span>
                  )}
                </div>
              </div>

              {/* Size Chart */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Chart ID
                </label>
                <input
                  type="text"
                  value={formData.sizeChart}
                  onChange={(e) => handleChange('sizeChart', e.target.value)}
                  placeholder="Enter size chart ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Size Chart Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Chart Image
                </label>
                <ImageUpload
                  onImageUpload={(url) => handleChange('sizeChartImageUrl', url)}
                  onImageRemove={() => handleChange('sizeChartImageUrl', '')}
                  existingImages={formData.sizeChartImageUrl ? [formData.sizeChartImageUrl] : []}
                  maxImages={1}
                />
              </div>
            </div>
          )}

          {/* Features & Details Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Features */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Features
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsFeaturesModalOpen(true)}
                    className="btn btn-secondary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Features
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {formData.features?.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {feature}
                    </span>
                  ))}
                  {(!formData.features || formData.features.length === 0) && (
                    <span className="text-gray-500 text-sm">No features added</span>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Colors
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsColorsModalOpen(true)}
                    className="btn btn-secondary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Colors
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {formData.colors?.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {color.colorId}
                    </span>
                  ))}
                  {(!formData.colors || formData.colors.length === 0) && (
                    <span className="text-gray-500 text-sm">No colors added</span>
                  )}
                </div>
              </div>

              {/* Attributes */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Attributes
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAttributesModalOpen(true)}
                    className="btn btn-secondary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Attributes
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {formData.attributes?.map((attribute, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {attribute}
                    </span>
                  ))}
                  {(!formData.attributes || formData.attributes.length === 0) && (
                    <span className="text-gray-500 text-sm">No attributes added</span>
                  )}
                </div>
              </div>

              {/* Special Features */}
              <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Special Features
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isLimitedEdition}
                    onChange={(e) => handleChange('isLimitedEdition', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Limited Edition</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isCustomMade}
                    onChange={(e) => handleChange('isCustomMade', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Custom Made</span>
                </div>
              </div>
              
              {formData.isCustomMade && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Delivery Time (days)
                  </label>
                  <input
                    type="number"
                    value={formData.customDeliveryDays}
                    onChange={(e) => handleChange('customDeliveryDays', parseInt(e.target.value) || 0)}
                    className="input-field w-32"
                    placeholder="0"
                    min="0"
                  />
                </div>
              )}
            </div>

            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('images', formData.images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600"
              >
                <PlusIcon className="h-8 w-8" />
              </button>
            </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>

        {/* Modals */}
        <TagsModal
          isOpen={isTagsModalOpen}
          onClose={() => setIsTagsModalOpen(false)}
          tags={formData.tags}
          onTagsChange={(tags) => handleChange('tags', tags)}
        />

        <KeywordsModal
          isOpen={isKeywordsModalOpen}
          onClose={() => setIsKeywordsModalOpen(false)}
          keywords={formData.seo.keywords}
          onKeywordsChange={(keywords) => handleChange('seo', { ...formData.seo, keywords })}
        />

        <FeaturesModal
          isOpen={isFeaturesModalOpen}
          onClose={() => setIsFeaturesModalOpen(false)}
          features={formData.features || []}
          onFeaturesChange={(features) => handleChange('features', features)}
        />

        <ColorsModal
          isOpen={isColorsModalOpen}
          onClose={() => setIsColorsModalOpen(false)}
          colors={formData.colors || []}
          onColorsChange={(colors) => handleChange('colors', colors)}
        />

        <AttributesModal
          isOpen={isAttributesModalOpen}
          onClose={() => setIsAttributesModalOpen(false)}
          attributes={formData.attributes || []}
          onAttributesChange={(attributes) => handleChange('attributes', attributes)}
        />

        <SizesModal
          isOpen={isSizesModalOpen}
          onClose={() => setIsSizesModalOpen(false)}
          sizes={formData.availableSizes || []}
          onSizesChange={(sizes) => handleChange('availableSizes', sizes)}
        />
      </div>
    </div>
  );
};

export default ProductForm; 
