"use client";

import MyAccordion from "@/components/ui/accordion";

const CategoryItem = ({ items, onEdit, onDelete, chooseCategory, openItem, menuList, openMenuItem, setOpenMenuItem, fetchMenu, selectedCategory }) => {
  return <MyAccordion
    openItem={openItem}
    selectedCategory={selectedCategory}
    chooseItem={chooseCategory}
    onEdit={onEdit}
    onDelete={onDelete}
    openMenuItem={openMenuItem}
    setOpenMenuItem={setOpenMenuItem}
    fetchMenu={fetchMenu}
    items={items.map(each => {
      return {
        id: each._id,
        header: each.name,
        subText: each.order,
        content: "Menu",
        menuList: menuList
      }
    })} />
}

export default CategoryItem;