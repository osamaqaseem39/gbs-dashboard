import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from 'services/productService';
import { categoryService } from 'services/categoryService';
import { brandService } from 'services/brandService';
import { 
  materialService, occasionService, seasonService,
  colorFamilyService, patternService, sleeveLengthService,
  ageGroupService
} from 'services/masterDataService';
import { Product, Category, Brand } from '../types';
import { inventoryService } from 'services/inventoryService';
import ProductFormPage from './ProductFormPage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const ProductFormPageWrapper: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [occasions, setOccasions] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [colorFamilies, setColorFamilies] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [sleeveLengths, setSleeveLengths] = useState<any[]>([]);
  const [ageGroups, setAgeGroups] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch categories, brands and master data
      const [categoriesResponse, brandsResponse, materialsRes, occasionsRes, seasonsRes, colorFamiliesRes, patternsRes, sleeveLengthsRes, ageGroupsRes, productsRes] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands(),
        materialService.getAll(),
        occasionService.getAll(),
        seasonService.getAll(),
        colorFamilyService.getAll(),
        patternService.getAll(),
        sleeveLengthService.getAll(),
        ageGroupService.getAll(),
        productService.getProducts({ limit: 1000 }).catch(() => ({ success: true, data: { products: [] } })),
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

      if (brandsResponse.success && brandsResponse.data) {
        setBrands(brandsResponse.data);
      }

      if (materialsRes.success && materialsRes.data) setMaterials(materialsRes.data);
      if (occasionsRes.success && occasionsRes.data) setOccasions(occasionsRes.data);
      if (seasonsRes.success && seasonsRes.data) setSeasons(seasonsRes.data);
      if (colorFamiliesRes.success && colorFamiliesRes.data) setColorFamilies(colorFamiliesRes.data);
      if (patternsRes.success && patternsRes.data) setPatterns(patternsRes.data);
      if (sleeveLengthsRes.success && sleeveLengthsRes.data) setSleeveLengths(sleeveLengthsRes.data);
      if (ageGroupsRes.success && ageGroupsRes.data) setAgeGroups(ageGroupsRes.data);
      if (productsRes.success && productsRes.data?.products) setProducts(productsRes.data.products);

      // Fetch product if editing
      if (isEditing && id) {
        const productResponse = await productService.getProduct(id);
        if (productResponse.success && productResponse.data?.product) {
          const productData = productResponse.data.product;
          
          // Load inventory data if product has sizes
          if (productData.availableSizes && productData.availableSizes.length > 0) {
            try {
              const inventoryResponse = await inventoryService.getInventoryByProduct(id);
              if (inventoryResponse.success && inventoryResponse.data && Array.isArray(inventoryResponse.data)) {
                // Add size inventory data to product
                const sizeInventory = productData.availableSizes.map((size: string) => {
                  const invItem = inventoryResponse.data!.find((inv: any) => inv.size === size);
                  return {
                    size,
                    quantity: invItem?.currentStock || 0,
                  };
                });
                (productData as any).sizeInventory = sizeInventory;
              }
            } catch (err) {
              console.error('Error loading inventory data:', err);
              // Don't fail if inventory loading fails
            }
          }
          
          setProduct(productData);
        } else {
          setError(productResponse.message || 'Product not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (productData: Partial<Product>) => {
    try {
      let response;
      if (isEditing && id) {
        response = await productService.updateProduct(id, productData);
      } else {
        response = await productService.createProduct(productData);
      }

      if (response.success) {
        navigate('/dashboard/products');
      } else {
        throw new Error(response.message || 'Failed to save product');
      }
    } catch (err: any) {
      // Log richer error info to help diagnose 500s
      const serverData = err?.response?.data;
      console.error('Error saving product:', err, serverData);
      throw err;
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await productService.deleteProduct(productId);
      if (response.success) {
        navigate('/dashboard/products');
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (err: any) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <ProductFormPage
      product={product || undefined}
      categories={categories}
      brands={brands}
      materials={materials}
      occasions={occasions}
      seasons={seasons}
      colorFamilies={colorFamilies}
      patterns={patterns}
      sleeveLengths={sleeveLengths}
      ageGroups={ageGroups}
      products={products}
      onSubmit={handleSubmit}
      onDelete={isEditing ? handleDelete : undefined}
      isLoading={false}
    />
  );
};

export default ProductFormPageWrapper;
