'use client';
import { useEffect, useState } from 'react';
import { categoryService } from '@/services/category.service';
import { usePathname } from 'next/navigation';
import CategoryItem from './CategoryItem';
import ControlledDialog from '@/components/ui/dialog';
import CategoryForm from './category-form';
import HeaderWithButton from '@/components/ui/HeaderWithButton';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, getPathName } from '@/lib/utils';
import { menuService } from '@/services/menu.service';

export default function CategoryListingPage() {
  const pathname = usePathname();
  const [categories, setCategories] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editableCategoryId, setEditableCategoryId] = useState("");
  const [selectedCategory, selectCategory] = useState("");
  const [openItem,setOpenItem] = useState("");
  const [openMenuItem,setOpenMenuItem] = useState("");

  const fetchCategories = async () => {
    const res = await categoryService.getCategories({
      filters: {},
      sortConfig: {}
    }, getPathName(pathname));

    if (res.data && res.data.data) {
      setCategories(res.data.data);
    }
  };

  const fetchMenu = async () => {
    const res = await menuService.getMenus({
      filters: {
        categoryRef: selectedCategory
      }
    }, getPathName(pathname));

    setOpenItem(selectedCategory);
    setOpenMenuItem("");

    if (res.data && res.data.data) {
      setMenuList(res.data.data);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchMenu();
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id: string) => {
    const res = await categoryService.deleteCategory(id, getPathName(pathname));
    if (res) {
      fetchCategories();
    }
  };

  const editCategory = (id: string) => {
    setIsOpen(true);
    setEditableCategoryId(id);
  };

  const setUpdated = () => {
    setIsOpen(false);
    setEditableCategoryId("");
    fetchCategories();
  }

  useEffect(() => {
    openItem && setOpenMenuItem("");
  }, [openItem]);

  return (
    <>
      <ControlledDialog
        heading="Update Category"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <CategoryForm categoryId={editableCategoryId} setAdded={setUpdated} />
      </ControlledDialog>
      <div className="flex items-start justify-between">
        <HeaderWithButton
          title="Category Menu Management"
          description="Manage your food categories and menu items"
          formType={"Category"}
          buttonClass={cn(buttonVariants(), 'text-xs md:text-sm')}
          buttonText='Add Category'
          fetchData={fetchCategories}
        />
      </div>
      <Separator />
      {categories.length ?
        <CategoryItem
          menuList={menuList}
          openItem={openItem}
          items={categories}
          onEdit={editCategory}
          onDelete={deleteCategory}
          chooseCategory={(item: any) => selectCategory(item.id)}
          openMenuItem={openMenuItem}
          setOpenMenuItem={setOpenMenuItem}
          selectedCategory={selectedCategory}
          fetchMenu={fetchMenu}
        />
        : null}
    </>
  );
}
