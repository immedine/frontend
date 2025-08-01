import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import { Product } from '@/constants/data';

// Dummy product data
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'iPhone 14 Pro',
    description: 'Latest Apple smartphone with advanced features',
    price: 999.99,
    category: 'Electronics',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-20T15:30:00Z',
    photo_url: 'https://api.slingacademy.com/public/sample-products/1.png'
  },
  {
    id: 2,
    name: 'Ergonomic Office Chair',
    description: 'Comfortable chair with lumbar support',
    price: 299.99,
    category: 'Furniture',
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-03-19T14:20:00Z',
    photo_url: 'https://api.slingacademy.com/public/sample-products/2.png'
  }
];

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    // Find product in dummy data instead of API call
    product = SAMPLE_PRODUCTS.find((p) => p.id === Number(productId));
    if (!product) {
      notFound();
    }
    pageTitle = `Edit Product`;
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
