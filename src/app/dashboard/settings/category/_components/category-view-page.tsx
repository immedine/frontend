import CategoryForm from './category-form';

type TCategoryViewPageProps = {
  categoryId: string;
};

export default async function CategoryViewPage({
  categoryId
}: TCategoryViewPageProps) {
  const pageTitle =
    categoryId === 'new' ? 'Create New Category' : 'Edit Category';

  return <CategoryForm categoryId={categoryId} pageTitle={pageTitle} />;
}
