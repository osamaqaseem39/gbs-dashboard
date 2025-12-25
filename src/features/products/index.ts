// Products Feature - Barrel Export
export { default as Products } from '../../pages/products/Products';
export { default as ProductFormPageWrapper } from '../../pages/products/ProductFormPageWrapper';
export { default as ProductFormPage } from '../../pages/products/ProductFormPage';
export { default as ProductSetup } from '../../pages/products/ProductSetup';

// Product Components
export { default as ProductForm } from './components/ProductForm';
export { default as ProductFormBasic } from './components/ProductFormBasic';
export { default as ProductFormInventory } from './components/ProductFormInventory';
export { default as ProductFormShipping } from './components/ProductFormShipping';
export { default as ProductFormAttributes } from './components/ProductFormAttributes';
export { default as ProductFormImages } from './components/ProductFormImages';
export { default as ProductFormSEO } from './components/ProductFormSEO';
export { default as ProductFormTabs } from './components/ProductFormTabs';
export { default as ProductFormTypeSpecific } from './components/ProductFormTypeSpecific';
export { default as ProductFormVariations } from './components/ProductFormVariations';
export { default as ProductFilters } from './components/ProductFilters';

// Product Services
export { productService } from './services/productService';

// Product Types
export type { Product, ProductVariant, ProductSEO, ProductFilters as ProductFiltersType } from '@/shared/types';
