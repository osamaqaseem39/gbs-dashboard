// Products Feature - Barrel Export
export { default as Products } from '../../pages/products/Products';
export { default as ProductFormPageWrapper } from '../../pages/products/ProductFormPageWrapper';
export { default as ProductFormPage } from '../../pages/products/ProductFormPage';
export { default as ProductSetup } from '../../pages/products/ProductSetup';

// Product Components
export { default as ProductForm } from 'components/products/ProductForm';
export { default as ProductFormBasic } from 'components/products/ProductFormBasic';
export { default as ProductFormInventory } from 'components/products/ProductFormInventory';
export { default as ProductFormShipping } from 'components/products/ProductFormShipping';
export { default as ProductFormAttributes } from 'components/products/ProductFormAttributes';
export { default as ProductFormImages } from 'components/products/ProductFormImages';
export { default as ProductFormSEO } from 'components/products/ProductFormSEO';
export { default as ProductFormTabs } from 'components/products/ProductFormTabs';
export { default as ProductFormTypeSpecific } from 'components/products/ProductFormTypeSpecific';
export { default as ProductFormVariations } from 'components/products/ProductFormVariations';
export { default as ProductFilters } from 'components/products/ProductFilters';

// Product Services
export { productService } from 'services/productService';

// Product Types
export type { Product, ProductVariant, ProductSEO, ProductFilters as ProductFiltersType } from '@/shared/types';
