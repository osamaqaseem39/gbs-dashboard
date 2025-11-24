import api from './api';
import { ApiResponse, Product, ProductFilters } from '../types';

export const productService = {
  // Normalize dashboard product shape to backend-accepted payload
  buildProductPayload(productData: any) {
    const allowedTypes = new Set(['simple', 'variable', 'grouped', 'external']);

    // Derive slug
    const rawSlug = productData.slug || productData.seo?.slug || productData.name || '';
    const slug = String(rawSlug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Ensure type is valid
    const type = allowedTypes.has(productData.type) ? productData.type : 'simple';

    // Normalize categories to array of strings (ids)
    let categories: string[] | undefined = undefined;
    if (Array.isArray(productData.categories)) {
      categories = productData.categories.map((c: any) => (typeof c === 'string' ? c : c?._id || c?.id)).filter(Boolean);
    } else if (productData.categoryId) {
      const cid = typeof productData.categoryId === 'string' ? productData.categoryId : productData.categoryId?._id;
      categories = cid ? [cid] : undefined;
    }

    // Keep images as-is (will be normalized below to objects with url, altText, position)
    const images = productData.images;

    // Strip fields rejected by backend
    const {
      seo, // nested SEO object not supported by backend
      isActive,
      features,
      colors,
      sizeChartImageUrl,
      variants, // Convert to variations below
      categoryId, // Already converted to categories above
      // keep rest
      ...rest
    } = productData || {};

    // Whitelist fields commonly accepted by backend to avoid 500s from unknown props
    const whitelisted: Record<string, any> = {};

    const copyIfDefined = (key: string, srcKey?: string) => {
      const fromKey = srcKey || key;
      if (rest[fromKey] !== undefined && rest[fromKey] !== null && rest[fromKey] !== '') {
        whitelisted[key] = rest[fromKey];
      }
    };

    // Basic identity and merchandising fields
    copyIfDefined('name');
    whitelisted.slug = slug;
    copyIfDefined('description');
    // shortDescription is required by backend and cannot be empty
    if (rest.shortDescription && String(rest.shortDescription).trim() !== '') {
      whitelisted.shortDescription = String(rest.shortDescription).trim();
    } else if (rest.description && String(rest.description).trim() !== '') {
      whitelisted.shortDescription = String(rest.description).trim().substring(0, 200);
    } else {
      // Fallback to name if description is also empty
      whitelisted.shortDescription = productData.name || 'Product';
    }
    copyIfDefined('sku');
    whitelisted.type = type;
    copyIfDefined('status');

    // Pricing
    const priceNum = Number(rest.price);
    const salePriceNum = Number(rest.salePrice);
    if (!Number.isNaN(priceNum)) {
      whitelisted.price = priceNum;
    }
    if (!Number.isNaN(salePriceNum) && salePriceNum > 0 && (!Number.isNaN(priceNum) ? salePriceNum < priceNum : true)) {
      whitelisted.salePrice = salePriceNum;
    }
    if (rest.originalPrice !== undefined && rest.originalPrice !== null && rest.originalPrice !== '') {
      whitelisted.originalPrice = Number(rest.originalPrice);
    }
    // Currency defaults to PKR if not provided (backend requirement)
    whitelisted.currency = rest.currency || 'PKR';

    // Inventory
    copyIfDefined('stockQuantity');
    copyIfDefined('stockStatus');
    copyIfDefined('manageStock');
    copyIfDefined('allowBackorders');

    // Shipping/physical
    copyIfDefined('weight');
    if (rest.dimensions && typeof rest.dimensions === 'object') {
      whitelisted.dimensions = {
        length: Number(rest.dimensions.length) || 0,
        width: Number(rest.dimensions.width) || 0,
        height: Number(rest.dimensions.height) || 0,
      };
    }

    // Relationships and taxonomy
    if (categories) whitelisted.categories = categories;
    copyIfDefined('tags');
    // Normalize brand to string ID
    if (rest.brandId) {
      const brandId = typeof rest.brandId === 'string' ? rest.brandId : rest.brandId?._id;
      if (brandId) whitelisted.brand = brandId;
    } else if (rest.brand) {
      const brandId = typeof rest.brand === 'string' ? rest.brand : rest.brand?._id;
      if (brandId) whitelisted.brand = brandId;
    }
    
    // Attributes - ensure array of strings
    if (rest.attributes && Array.isArray(rest.attributes)) {
      whitelisted.attributes = rest.attributes.map((attr: any) => 
        typeof attr === 'string' ? attr : attr._id || attr.id || attr
      ).filter(Boolean);
    }

    // Media - backend expects array of objects with url, altText, position
    if (images && Array.isArray(images) && images.length > 0) {
      whitelisted.images = images.map((img: any, index: number) => {
        if (typeof img === 'string' && img.trim() !== '') {
          return { 
            url: img.trim(), 
            altText: productData.name || '',
            position: index 
          };
        } else if (img && typeof img === 'object') {
          const url = img.url || (typeof img === 'string' ? img : '');
          if (url && url.trim() !== '') {
            return {
              url: url.trim(),
              altText: img.altText || productData.name || '',
              position: img.position !== undefined && typeof img.position === 'number' ? img.position : index,
            };
          }
        }
        return null;
      }).filter((img: any) => img !== null && img.url && img.url.trim() !== '');
    }

    // Colors - backend expects array of { colorId, imageUrl? }
    if (colors && Array.isArray(colors) && colors.length > 0) {
      whitelisted.colors = colors
        .map((c: any) => {
          if (!c) return null;
          const colorId = typeof c === 'string' ? c : c.colorId;
          if (!colorId) return null;
          const imageUrl = typeof c === 'object' ? c.imageUrl : undefined;
          return imageUrl ? { colorId, imageUrl } : { colorId };
        })
        .filter(Boolean);
    }

    // Variations - backend expects "variations" not "variants"
    // Each variation has its own: attributes, images, prices, and inventory
    if (variants && Array.isArray(variants) && variants.length > 0) {
      whitelisted.variations = variants.map((variant: any, index: number) => {
        // Remove _id if present (for new variants)
        const { _id, ...variantData } = variant;
        
        const normalizedVariant: any = {};
        
        // Basic variant info
        if (variantData.name !== undefined) normalizedVariant.name = variantData.name;
        if (variantData.sku !== undefined && variantData.sku !== '') normalizedVariant.sku = variantData.sku;
        
        // Pricing - each variation has its own prices
        if (variantData.price !== undefined && variantData.price !== null) {
          normalizedVariant.price = Number(variantData.price) || 0;
        }
        if (variantData.salePrice !== undefined && variantData.salePrice !== null) {
          const vSale = Number(variantData.salePrice) || 0;
          const vPrice = Number(variantData.price) || 0;
          if (vSale > 0 && (vPrice === 0 || vSale < vPrice)) {
            normalizedVariant.salePrice = vSale;
          }
        }
        if (variantData.comparePrice !== undefined && variantData.comparePrice !== null) {
          normalizedVariant.comparePrice = Number(variantData.comparePrice) || 0;
        }
        if (variantData.costPrice !== undefined && variantData.costPrice !== null) {
          normalizedVariant.costPrice = Number(variantData.costPrice) || 0;
        }
        
        // Inventory - each variation has its own stock
        if (variantData.stockQuantity !== undefined && variantData.stockQuantity !== null) {
          normalizedVariant.stockQuantity = Number(variantData.stockQuantity) || 0;
        }
        if (variantData.stockStatus !== undefined) {
          normalizedVariant.stockStatus = variantData.stockStatus;
        }
        
        // Attributes - each variation has its own attributes
        // Backend expects array of strings (attribute IDs), frontend might send Record<string, string>
        if (variantData.attributes !== undefined) {
          if (Array.isArray(variantData.attributes)) {
            // Already an array, normalize to strings
            normalizedVariant.attributes = variantData.attributes.map((attr: any) => 
              typeof attr === 'string' ? attr : attr._id || attr.id || attr
            ).filter(Boolean);
          } else if (variantData.attributes && typeof variantData.attributes === 'object') {
            // Convert Record<string, string> to array of values or keys
            // Based on backend, it expects attribute IDs, so we take the values
            normalizedVariant.attributes = Object.values(variantData.attributes).filter(Boolean);
          }
        }
        
        // Images - each variation has its own images
        // Backend expects array of strings (image URLs or IDs)
        if (variantData.images && Array.isArray(variantData.images) && variantData.images.length > 0) {
          normalizedVariant.images = variantData.images.map((img: any) => {
            if (typeof img === 'string' && img.trim() !== '') {
              return img.trim();
            } else if (img && typeof img === 'object' && img.url) {
              return img.url.trim();
            }
            return null;
          }).filter((url: any) => url && url !== '');
        }
        
        // Physical properties
        if (variantData.weight !== undefined && variantData.weight !== null) {
          normalizedVariant.weight = Number(variantData.weight) || 0;
        }
        if (variantData.dimensions && typeof variantData.dimensions === 'object') {
          normalizedVariant.dimensions = {
            length: Number(variantData.dimensions.length) || 0,
            width: Number(variantData.dimensions.width) || 0,
            height: Number(variantData.dimensions.height) || 0,
          };
        }
        
        // Status
        if (variantData.isActive !== undefined) {
          normalizedVariant.isActive = Boolean(variantData.isActive);
        }
        
        return normalizedVariant;
      }).filter((v: any) => v !== null && v !== undefined);
    }

    // Stationery & Book Specific Fields
    copyIfDefined('fabric');
    copyIfDefined('collectionName');
    copyIfDefined('occasion');
    copyIfDefined('season');
    copyIfDefined('careInstructions');
    copyIfDefined('designer');
    if (rest.handwork && Array.isArray(rest.handwork) && rest.handwork.length > 0) {
      whitelisted.handwork = rest.handwork;
    }
    copyIfDefined('colorFamily');
    copyIfDefined('pattern');
    copyIfDefined('sleeveLength');
    copyIfDefined('neckline');
    copyIfDefined('length');
    copyIfDefined('fit');
    copyIfDefined('ageGroup');
    if (rest.bodyType && Array.isArray(rest.bodyType) && rest.bodyType.length > 0) {
      whitelisted.bodyType = rest.bodyType;
    }
    copyIfDefined('isLimitedEdition');
    copyIfDefined('isCustomMade');
    copyIfDefined('customDeliveryDays');
    copyIfDefined('sizeChart');
    copyIfDefined('availableSizes');

    return whitelisted;
  },
  // Get all products with filters
  async getProducts(filters?: ProductFilters, page: number = 1, limit: number = 20): Promise<ApiResponse<any>> {
    // Backend NestJS only accepts PaginationDto (page, limit, sortBy, sortOrder) for most endpoints
    // Use specific endpoints based on filter priority: search > category > published > default
    
    // Extract page and limit from filters if provided, otherwise use function parameters
    const actualPage = filters?.page ?? page;
    const actualLimit = filters?.limit ?? limit;
    
    const buildPaginationParams = () => {
      const params = new URLSearchParams();
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
      params.append('page', actualPage.toString());
      params.append('limit', actualLimit.toString());
      return params;
    };

    // Priority 1: Published products with category or search
    // Note: Backend endpoints don't combine status with other filters well,
    // so we use the most specific endpoint and filter client-side if needed
    if (filters?.status === 'published' && filters?.category) {
      // Use category endpoint, then filter for published status client-side if needed
      const categoryId = Array.isArray(filters.category) ? filters.category[0] : filters.category;
      const params = buildPaginationParams();
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/category/${categoryId}${suffix}`);
      const payload = response.data;
      return productService.normalizeProductsResponse(payload);
    }

    // Priority 2: Search queries
    if (filters?.search) {
      const params = buildPaginationParams();
      params.append('q', filters.search);
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/search${suffix}`);
      const payload = response.data;
      return productService.normalizeProductsResponse(payload);
    }

    // Priority 3: Category filtering (without published status requirement)
    if (filters?.category) {
      const categoryId = Array.isArray(filters.category) ? filters.category[0] : filters.category;
      const params = buildPaginationParams();
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/category/${categoryId}${suffix}`);
      const payload = response.data;
      return productService.normalizeProductsResponse(payload);
    }

    // Priority 4: Published products only - use dedicated endpoint
    if (filters?.status === 'published') {
      const params = buildPaginationParams();
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/published${suffix}`);
      const payload = response.data;
      return productService.normalizeProductsResponse(payload);
    }

    // Default: use base /products endpoint with only pagination params
    const params = buildPaginationParams();
    const response = await api.get(`/products?${params.toString()}`);
    const payload = response.data;
    return productService.normalizeProductsResponse(payload);
  },

  normalizeProductsResponse(payload: any): ApiResponse<any> {
    // If already normalized
    if (payload && typeof payload === 'object' && 'success' in payload && typeof payload.success === 'boolean') {
      // Ensure data.products exists even if backend returns array directly inside data
      const data = payload.data;
      if (Array.isArray(data)) {
        return { success: true, data: { products: data, totalPages: 1 } };
      }
      if (data && Array.isArray(data.products)) return payload;
      // Some backends use docs
      if (data && Array.isArray(data.docs)) {
        return { success: true, data: { products: data.docs, totalPages: data.totalPages || 1 } };
      }
      return payload;
    }
    // Array response
    if (Array.isArray(payload)) {
      return { success: true, data: { products: payload, totalPages: 1 } };
    }
    // Object with products or docs
    if (payload && typeof payload === 'object') {
      // Common shape: { data: Product[], total, page, limit, totalPages }
      if (Array.isArray(payload.data)) {
        return {
          success: true,
          data: {
            products: payload.data,
            totalPages: payload.totalPages || 1,
            total: payload.total,
            page: payload.page,
            limit: payload.limit,
          },
        } as any;
      }
      if (Array.isArray(payload.products)) {
        return { success: true, data: { products: payload.products, totalPages: payload.totalPages || 1 } };
      }
      if (Array.isArray(payload.docs)) {
        return { success: true, data: { products: payload.docs, totalPages: payload.totalPages || 1 } };
      }
    }
    return { success: true, data: { products: [], totalPages: 1 } };
  },

  // Get single product by ID
  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    try {
      const response = await api.get(`/products/${id}`);
      const payload = response.data;
      
      // Normalize response - backend may return product directly or wrapped
      if (payload && typeof payload === 'object') {
        // If already in ApiResponse format with success property
        if ('success' in payload && typeof payload.success === 'boolean') {
          // Ensure data.product exists
          if (payload.data && payload.data.product) {
            return payload;
          }
          // If data is the product itself, wrap it
          if (payload.data && payload.data._id) {
            return {
              success: true,
              data: { product: payload.data },
            };
          }
          return payload;
        }
        // If payload is the product directly
        if (payload._id) {
          return {
            success: true,
            data: { product: payload },
          };
        }
      }
      
      // Default fallback
      return {
        success: false,
        data: { product: {} as Product },
        message: 'Invalid product response',
      };
    } catch (error: any) {
      console.error('Error fetching product:', error.response?.data || error.message);
      return {
        success: false,
        data: { product: {} as Product },
        message: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch product',
      };
    }
  },

  // Create new product
  async createProduct(productData: any): Promise<ApiResponse<{ product: Product }>> {
    try {
      const payload = productService.buildProductPayload(productData);
      // Debug payload to help diagnose backend 500s
      // eslint-disable-next-line no-console
      console.log('createProduct payload', payload);
      const response = await api.post('/products', payload);
      const payloadResp = response.data;
      // Normalize to ApiResponse shape
      if (payloadResp && typeof payloadResp === 'object' && 'success' in payloadResp) {
        return payloadResp;
      }
      if (payloadResp && (payloadResp.product || payloadResp._id)) {
        const product = payloadResp.product || payloadResp;
        return { success: true, data: { product } };
      }
      return { success: true, data: { product: payloadResp as Product } };
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error creating product:', error.response?.data || error.message);
      return {
        success: false,
        data: { product: {} as Product },
        message: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create product',
      };
    }
  },

  // Update product
  async updateProduct(id: string, productData: any): Promise<ApiResponse<{ product: Product }>> {
    try {
      const payload = productService.buildProductPayload(productData);
      // eslint-disable-next-line no-console
      console.log('updateProduct payload', id, payload);
      const response = await api.put(`/products/${id}`, payload);
      const payloadResp = response.data;
      if (payloadResp && typeof payloadResp === 'object' && 'success' in payloadResp) {
        return payloadResp;
      }
      if (payloadResp && (payloadResp.product || payloadResp._id)) {
        const product = payloadResp.product || payloadResp;
        return { success: true, data: { product } };
      }
      return { success: true, data: { product: payloadResp as Product } };
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error updating product:', error.response?.data || error.message);
      return {
        success: false,
        data: { product: {} as Product },
        message: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update product',
      };
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Upload product images
  async uploadProductImages(id: string, images: File[]): Promise<ApiResponse<any>> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await api.post(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 