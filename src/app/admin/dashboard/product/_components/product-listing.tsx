import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import { Product } from '@/constants/data';

// Sample product data
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
  },
  {
    id: 3,
    name: 'Nike Air Max',
    description: 'Premium running shoes for athletes',
    price: 149.99,
    category: 'Clothing',
    created_at: '2024-02-15T11:30:00Z',
    updated_at: '2024-03-18T16:45:00Z',
    photo_url: 'https://api.slingacademy.com/public/sample-products/3.png'
  },
  {
    id: 4,
    name: 'Samsung 4K Smart TV',
    description: '55-inch QLED display with smart features',
    price: 799.99,
    category: 'Electronics',
    created_at: '2024-03-01T13:15:00Z',
    updated_at: '2024-03-17T12:10:00Z',
    photo_url: 'https://api.slingacademy.com/public/sample-products/4.png'
  }
];

export default async function ProductListingPage() {
  // Get search params
  const page = Number(searchParamsCache.get('page')) || 1;
  const search = searchParamsCache.get('q');
  const pageLimit = Number(searchParamsCache.get('limit')) || 10;
  const categories = searchParamsCache.get('categories');

  // Implement simple filtering logic
  let filteredProducts = [...SAMPLE_PRODUCTS];

  // Apply category filter
  if (categories) {
    const categoryList = categories.split('.');
    filteredProducts = filteredProducts.filter((product) =>
      categoryList.includes(product.category)
    );
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  }

  // Calculate total before pagination
  const total = filteredProducts.length;

  // Apply pagination
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <ProductTable
      columns={columns}
      data={paginatedProducts}
      totalItems={total}
    />
  );
}
