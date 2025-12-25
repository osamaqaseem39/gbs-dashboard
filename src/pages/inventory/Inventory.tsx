import React, { useState, useEffect } from 'react';
import { PlusIcon, MinusIcon, ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';
import type { Inventory as InventoryType, Product } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Table from '../components/ui/Table';
import SearchInput from '../components/ui/SearchInput';
import Modal from '../components/ui/Modal';

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryType | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryType | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [adjustingStock, setAdjustingStock] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [sizeWiseStock, setSizeWiseStock] = useState<Array<{
    size: string;
    currentStock: number;
    availableStock: number;
    reorderPoint: number;
    reorderQuantity: number;
    costPrice: number;
    sellingPrice: number;
  }>>([]);

  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    productId: '',
    size: '',
    currentStock: 0,
    availableStock: 0,
    reorderPoint: 0,
    reorderQuantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    warehouse: 'main',
    status: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory, searchQuery, statusFilter]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryService.getInventory();
      setInventory(response.data || []);
    } catch (err) {
      setError('Failed to load inventory');
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // If size-wise stock is configured, create inventory for each size
      if (sizeWiseStock.length > 0) {
        const promises = sizeWiseStock.map(sizeStock => 
          inventoryService.createInventory({
            ...formData,
            size: sizeStock.size,
            currentStock: sizeStock.currentStock,
            availableStock: sizeStock.availableStock,
            reorderPoint: sizeStock.reorderPoint,
            reorderQuantity: sizeStock.reorderQuantity,
            costPrice: sizeStock.costPrice,
            sellingPrice: sizeStock.sellingPrice,
          })
        );
        const results = await Promise.all(promises);
        const successful = results.filter(r => r.success && r.data);
        if (successful.length > 0) {
          setInventory([...successful.map(r => r.data!), ...inventory]);
          setShowForm(false);
          resetForm();
          setSuccessMessage(`Created inventory for ${successful.length} size(s)`);
        }
      } else {
        // Single inventory item (no sizes or single size)
        const response = await inventoryService.createInventory(formData);
        if (response.success && response.data) {
          setInventory([response.data, ...inventory]);
          setShowForm(false);
          resetForm();
        }
      }
    } catch (err) {
      setError('Failed to create inventory item');
      console.error('Error creating inventory item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsSubmitting(true);
      
      // If size-wise stock is configured, update/create inventory for each size
      if (sizeWiseStock.length > 0) {
        // Get existing inventory items for this product
        const existingInventory = await inventoryService.getInventoryByProduct(editingItem.productId);
        const existingItems = existingInventory.success && existingInventory.data ? existingInventory.data : [];
        
        // Update or create inventory for each size
        const promises = sizeWiseStock.map(async (sizeStock) => {
          const existingItem = existingItems.find((item: InventoryType) => item.size === sizeStock.size);
          
          if (existingItem) {
            // Update existing inventory item
            return inventoryService.updateInventory(existingItem._id, {
              ...formData,
              size: sizeStock.size,
              currentStock: sizeStock.currentStock,
              availableStock: sizeStock.availableStock,
              reorderPoint: sizeStock.reorderPoint,
              reorderQuantity: sizeStock.reorderQuantity,
              costPrice: sizeStock.costPrice,
              sellingPrice: sizeStock.sellingPrice,
            });
          } else {
            // Create new inventory item for this size
            return inventoryService.createInventory({
              ...formData,
              size: sizeStock.size,
              currentStock: sizeStock.currentStock,
              availableStock: sizeStock.availableStock,
              reorderPoint: sizeStock.reorderPoint,
              reorderQuantity: sizeStock.reorderQuantity,
              costPrice: sizeStock.costPrice,
              sellingPrice: sizeStock.sellingPrice,
            });
          }
        });
        
        const results = await Promise.all(promises);
        const successful = results.filter(r => r.success && r.data);
        
        if (successful.length > 0) {
          // Reload inventory to get updated data
          await loadInventory();
          setShowForm(false);
          setEditingItem(null);
          resetForm();
          setSuccessMessage(`Updated inventory for ${successful.length} size(s)`);
        }
      } else {
        // Single inventory item update
        const response = await inventoryService.updateInventory(editingItem._id, formData);
        if (response.success && response.data) {
          setInventory(inventory.map(item => 
            item._id === editingItem._id ? response.data! : item
          ));
          setShowForm(false);
          setEditingItem(null);
          resetForm();
        }
      }
    } catch (err) {
      setError('Failed to update inventory item');
      console.error('Error updating inventory item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (item: InventoryType) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      const response = await inventoryService.deleteInventory(itemToDelete._id);
      if (response.success) {
        setInventory(inventory.filter(item => item._id !== itemToDelete._id));
        setShowDeleteModal(false);
        setItemToDelete(null);
        setSuccessMessage('Inventory record deleted successfully');
        // Refresh from server for accuracy
        loadInventory();
      }
    } catch (err) {
      setError('Failed to delete inventory item');
      console.error('Error deleting inventory item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditItem = async (item: InventoryType) => {
    setEditingItem(item);
    setFormData({
      productName: item.productName || '',
      sku: item.sku || '',
      productId: item.productId || '',
      size: item.size || '',
      currentStock: item.currentStock || 0,
      availableStock: item.availableStock || 0,
      reorderPoint: item.reorderPoint || 0,
      reorderQuantity: item.reorderQuantity || 0,
      costPrice: item.costPrice || 0,
      sellingPrice: item.sellingPrice || 0,
      warehouse: item.warehouse || 'main',
      status: item.status || 'in_stock',
    });
    
    // Load product to get available sizes
    if (item.productId) {
      await loadProductForSizes(item.productId);
      
      // Load existing inventory for all sizes of this product
      try {
        const existingInventory = await inventoryService.getInventoryByProduct(item.productId);
        const existingItems = existingInventory.success && existingInventory.data ? existingInventory.data : [];
        
        // If product has sizes, initialize size-wise stock for all sizes
        if (selectedProduct && selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0) {
          const sizeStockData = selectedProduct.availableSizes.map((size: string) => {
            // Find existing inventory for this size
            const existingInv = existingItems.find((inv: InventoryType) => inv.size === size);
            return {
              size: size,
              currentStock: existingInv?.currentStock || 0,
              availableStock: existingInv?.availableStock || 0,
              reorderPoint: existingInv?.reorderPoint || 0,
              reorderQuantity: existingInv?.reorderQuantity || 0,
              costPrice: existingInv?.costPrice || formData.costPrice || 0,
              sellingPrice: existingInv?.sellingPrice || formData.sellingPrice || 0,
            };
          });
          setSizeWiseStock(sizeStockData);
        } else if (existingItems.length > 0) {
          // Product doesn't have sizes, but has existing inventory
          const sizeStockData = existingItems.map(inv => ({
            size: inv.size || '',
            currentStock: inv.currentStock || 0,
            availableStock: inv.availableStock || 0,
            reorderPoint: inv.reorderPoint || 0,
            reorderQuantity: inv.reorderQuantity || 0,
            costPrice: inv.costPrice || 0,
            sellingPrice: inv.sellingPrice || 0,
          }));
          setSizeWiseStock(sizeStockData);
        }
      } catch (err) {
        console.error('Error loading existing inventory:', err);
      }
    }
    
    setShowForm(true);
  };

  const loadProductForSizes = async (productId: string) => {
    if (!productId) return;
    
    try {
      setLoadingProduct(true);
      const response = await productService.getProduct(productId);
      if (response.success && response.data?.product) {
        const product = response.data.product;
        setSelectedProduct(product);
        
        // Initialize size-wise stock if product has sizes (only if not editing)
        if (product.availableSizes && product.availableSizes.length > 0 && !editingItem) {
          const existingSizes = sizeWiseStock.map(s => s.size);
          const newSizes = product.availableSizes
            .filter((size: string) => !existingSizes.includes(size))
            .map((size: string) => ({
              size,
              currentStock: 0,
              availableStock: 0,
              reorderPoint: 0,
              reorderQuantity: 0,
              costPrice: formData.costPrice || 0,
              sellingPrice: formData.sellingPrice || 0,
            }));
          setSizeWiseStock([...sizeWiseStock, ...newSizes]);
        }
      }
    } catch (err) {
      console.error('Error loading product:', err);
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleViewItem = (item: InventoryType) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleAdjustStock = async (item: InventoryType, adjustment: number) => {
    if (adjustingStock === item._id) return; // Prevent multiple simultaneous adjustments
    
    try {
      setAdjustingStock(item._id);
      setError(null);
      
      const response = await inventoryService.adjustStock(item._id, {
        quantity: adjustment,
        type: 'adjustment',
        notes: `Manual adjustment: ${adjustment > 0 ? '+' : ''}${adjustment}`,
      });

      if (response.success && response.data) {
        // Update the inventory item in the list
        setInventory(inventory.map(inv => 
          inv._id === item._id ? response.data! : inv
        ));
        setSuccessMessage(`Stock ${adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustment)}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || 'Failed to adjust stock');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stock');
      console.error('Error adjusting stock:', err);
    } finally {
      setAdjustingStock(null);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    resetForm();
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      sku: '',
      productId: '',
      size: '',
      currentStock: 0,
      availableStock: 0,
      reorderPoint: 0,
      reorderQuantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      warehouse: 'main',
      status: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued',
    });
    setSelectedProduct(null);
    setSizeWiseStock([]);
  };

  const handleProductIdChange = async (productId: string) => {
    setFormData({...formData, productId});
    if (productId) {
      await loadProductForSizes(productId);
    } else {
      setSelectedProduct(null);
      setSizeWiseStock([]);
    }
  };

  const updateSizeStock = (index: number, field: string, value: number) => {
    const updated = [...sizeWiseStock];

    if (index >= updated.length) {
      // Add new entry if index is out of bounds
      const size = selectedProduct?.availableSizes?.[index] || '';
      updated.push({
        size,
        currentStock: 0,
        availableStock: 0,
        reorderPoint: 0,
        reorderQuantity: 0,
        costPrice: formData.costPrice || 0,
        sellingPrice: formData.sellingPrice || 0,
      });
    }
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      setSizeWiseStock(updated);
    }
  };

  const addSizeStock = () => {
    setSizeWiseStock([...sizeWiseStock, {
      size: '',
      currentStock: 0,
      availableStock: 0,
      reorderPoint: 0,
      reorderQuantity: 0,
      costPrice: formData.costPrice || 0,
      sellingPrice: formData.sellingPrice || 0,
    }]);
  };

  const removeSizeStock = (index: number) => {
    setSizeWiseStock(sizeWiseStock.filter((_, i) => i !== index));
  };

  const filterInventory = () => {
    let filtered = inventory;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredInventory(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'low_stock':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'out_of_stock':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (item: InventoryType) => (
        <div className="flex items-center space-x-3">
          {item.productImage && (
            <img
              src={item.productImage}
              alt={item.productName}
              className="h-10 w-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium text-gray-900">{item.productName}</div>
            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
            {item.size && (
              <div className="text-xs text-amber-600 font-medium mt-1">
                Size: {item.size}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (item: InventoryType) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <button
              onClick={() => handleAdjustStock(item, -1)}
              disabled={adjustingStock === item._id || item.currentStock <= 0}
              className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Decrease by 1"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <div className="min-w-[60px]">
              <div className="font-medium text-gray-900">{item.currentStock}</div>
              <div className="text-xs text-gray-500">Avail: {item.availableStock}</div>
            </div>
            <button
              onClick={() => handleAdjustStock(item, 1)}
              disabled={adjustingStock === item._id}
              className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Increase by 1"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          {adjustingStock === item._id && (
            <div className="flex justify-center mt-1">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: InventoryType) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(item.status)}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      key: 'pricing',
      header: 'Pricing',
      render: (item: InventoryType) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">${item.sellingPrice}</div>
          <div className="text-gray-500">Cost: ${item.costPrice}</div>
        </div>
      ),
    },
    {
      key: 'reorder',
      header: 'Reorder',
      render: (item: InventoryType) => (
        <div className="text-sm">
          <div className="text-gray-900">Point: {item.reorderPoint}</div>
          <div className="text-gray-500">Qty: {item.reorderQuantity}</div>
        </div>
      ),
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      render: (item: InventoryType) => (
        <span className="text-sm text-gray-600 capitalize">{item.warehouse}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: InventoryType) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewItem(item)}
            className="text-primary-600 hover:text-primary-900"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditItem(item)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteItem(item)}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track stock levels and manage inventory</p>
        </div>
        <Button 
          onClick={handleAddItem}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Stock</span>
        </Button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex">
            <div className="ml-0">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onRetry={() => setError(null)} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.status === 'in_stock').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.status === 'low_stock').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.status === 'out_of_stock').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search inventory..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredInventory.length} of {inventory.length} items
            </div>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table
            data={filteredInventory}
            columns={columns}
            emptyMessage="No inventory items found"
          />
        </div>
      </Card>

      {/* Inventory Form Modal */}
      {showForm && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
            resetForm();
          }}
          title={editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
        >
          <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product ID *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.productId}
                      onChange={(e) => handleProductIdChange(e.target.value)}
                      className="mt-1 block flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Product MongoDB ID"
                    />
                    {loadingProduct && (
                      <div className="mt-1 flex items-center">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                  </div>
                  {selectedProduct && (
                    <p className="mt-1 text-xs text-green-600">
                      Product: {selectedProduct.name}
                      {selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 && 
                        ` (${selectedProduct.availableSizes.length} sizes available)`
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Size (for single size products)
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., S, M, L, XL (optional)"
                    disabled={sizeWiseStock.length > 0}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {sizeWiseStock.length > 0 
                      ? 'Use size-wise stock section below for products with multiple sizes'
                      : 'Leave empty if product has no size variations'
                    }
                  </p>
                </div>
              </div>

              {/* Size-wise Stock Management */}
              {selectedProduct && selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 && (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Size-wise Stock Management</h3>
                    <button
                      type="button"
                      onClick={addSizeStock}
                      className="btn btn-secondary text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Size
                    </button>
                  </div>
                  
                  {sizeWiseStock.length === 0 && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        This product has {selectedProduct.availableSizes.length} available size(s). 
                        Click "Add Size" to start managing stock for each size.
                      </p>
                    </div>
                  )}

                  {sizeWiseStock.length > 0 && (
                    <div className="space-y-4">
                      {sizeWiseStock.map((sizeStock, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Size *
                              </label>
                              <select
                                value={sizeStock.size}
                                onChange={(e) => {
                                  const updated = [...sizeWiseStock];
                                  updated[index] = { ...updated[index], size: e.target.value };
                                  setSizeWiseStock(updated);
                                }}
                                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                              >
                                <option value="">Select Size</option>
                                {selectedProduct.availableSizes?.map((size: string) => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSizeStock(index)}
                              className="ml-3 text-red-600 hover:text-red-800"
                              title="Remove this size"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Current Stock
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={sizeStock.currentStock}
                                onChange={(e) => updateSizeStock(index, 'currentStock', Number(e.target.value))}
                                className="block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Available Stock
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={sizeStock.availableStock}
                                onChange={(e) => updateSizeStock(index, 'availableStock', Number(e.target.value))}
                                className="block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Reorder Point
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={sizeStock.reorderPoint}
                                onChange={(e) => updateSizeStock(index, 'reorderPoint', Number(e.target.value))}
                                className="block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Reorder Qty
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={sizeStock.reorderQuantity}
                                onChange={(e) => updateSizeStock(index, 'reorderQuantity', Number(e.target.value))}
                                className="block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Cost Price
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={sizeStock.costPrice}
                                onChange={(e) => updateSizeStock(index, 'costPrice', Number(e.target.value))}
                                className="block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Selling Price
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={sizeStock.sellingPrice}
                                onChange={(e) => updateSizeStock(index, 'sellingPrice', Number(e.target.value))}
                                className="block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Regular Stock Fields (only show if not using size-wise stock) */}
              {sizeWiseStock.length === 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.currentStock}
                      onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Available Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.availableStock}
                      onChange={(e) => setFormData({...formData, availableStock: Number(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Pricing Fields (only show if not using size-wise stock) */}
              {sizeWiseStock.length === 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cost Price *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Selling Price *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({...formData, reorderPoint: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reorder Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reorderQuantity}
                    onChange={(e) => setFormData({...formData, reorderQuantity: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Warehouse *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.warehouse}
                    onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Create Item')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Inventory Details Modal */}
      {showDetails && selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setShowDetails(false)}
          title={`Inventory Details - ${selectedItem.productName}`}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Product Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Product Name:</span> {selectedItem.productName}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">SKU:</span> {selectedItem.sku}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Warehouse:</span> {selectedItem.warehouse}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Stock Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Current Stock:</span> {selectedItem.currentStock}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Available Stock:</span> {selectedItem.availableStock}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Reorder Point:</span> {selectedItem.reorderPoint}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Reorder Quantity:</span> {selectedItem.reorderQuantity}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Pricing Information</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cost Price:</span> ${selectedItem.costPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Selling Price:</span> ${selectedItem.sellingPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Inventory Item"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{itemToDelete.productName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`btn btn-danger ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Inventory;
