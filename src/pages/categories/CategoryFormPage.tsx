import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryForm from 'components/products/CategoryForm';
import type { Category } from 'types';
import { categoryService } from 'services/categoryService';
import LoadingSpinner from 'components/ui/LoadingSpinner';

const CategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [category, setCategory] = useState<Category | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catsRes, catRes] = await Promise.all([
          categoryService.getCategories(),
          id ? categoryService.getCategory(id) : Promise.resolve({ success: true, data: null }),
        ]);
        if (catsRes.success && catsRes.data) setParentCategories(catsRes.data);
        if (id && catRes.success && catRes.data) {
          console.log('Loaded category:', catRes.data);
          setCategory(catRes.data);
        } else if (id && !catRes.success) {
          console.error('Failed to load category:', catRes);
          setError((catRes as any).message || 'Failed to load category. It may not exist.');
        }
      } catch (err) {
        setError('Failed to load category data');
        console.error('Error loading category:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (categoryData: Partial<Category>) => {
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit && id) {
        const res = await categoryService.updateCategory(id, categoryData);
        if (res.success) {
          navigate('/dashboard/categories');
        } else {
          setError(res.message || 'Failed to update category');
        }
      } else {
        const res = await categoryService.createCategory(categoryData);
        if (res.success) {
          navigate('/dashboard/categories');
        } else {
          setError(res.message || 'Failed to create category');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the category');
      console.error('Error saving category:', err);
    } finally {
      setSubmitting(false);
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
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Category' : 'Create Category'}</h1>
        <p className="mt-1 text-sm text-gray-500">{isEdit ? 'Update category details' : 'Add a new category'}</p>
      </div>
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="ml-0">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      <CategoryForm
        category={category || undefined}
        parentCategories={parentCategories}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/categories')}
        isLoading={submitting}
      />
    </div>
  );
};

export default CategoryFormPage;


