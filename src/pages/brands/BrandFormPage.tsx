import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BrandForm from '../components/products/BrandForm';
import type { Brand } from '../types';
import { brandService } from '../services/brandService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const BrandFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState<boolean>(isEdit);

  useEffect(() => {
    const loadBrand = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await brandService.getBrand(id);
        if (res.success && res.data) setBrand(res.data);
      } finally {
        setLoading(false);
      }
    };
    loadBrand();
  }, [id]);

  const handleSubmit = async (brandData: Partial<Brand>) => {
    if (isEdit && id) {
      const res = await brandService.updateBrand(id, brandData);
      if (res.success) navigate('/dashboard/brands');
    } else {
      const res = await brandService.createBrand(brandData);
      if (res.success) navigate('/dashboard/brands');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Brand' : 'Create Brand'}</h1>
        <p className="mt-1 text-sm text-gray-500">{isEdit ? 'Update brand details' : 'Add a new brand'}</p>
      </div>
      <BrandForm
        brand={brand || undefined}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/brands')}
      />
    </div>
  );
};

export default BrandFormPage;


