"use client";

import MyAccordion from "@/components/ui/accordion";
import { getPathName } from "@/lib/utils";
import { menuService } from "@/services/menu.service";
import { uploadService } from "@/services/upload.service";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MenuItem = ({ items, chooseMenu, openItem, fetchMenu, selectedCategory }) => {

  const [localItems, setLocalItems] = useState(items);
  const pathname = usePathname();

  const toggleAvailability = async (item: any) => {
    const res = await menuService.updateMenu(item.id, {
      isAvailable: !item.isAvailable
    }, getPathName(pathname));

    if (res) {
      setLocalItems(localItems.map(each => {
        if (each._id === item.id) {
          each.isAvailable = !item.isAvailable;
        }

        return each;
      }))
    }
  };

  useEffect(() => {
    if (items) {
      setLocalItems(items);
    }
  }, [items]);

  const onEdit = async (data, images) => {
    const imageUrls = [];
    const fileImages = images.filter(item => item instanceof File);
    if (fileImages && fileImages.length) {
      for (let img in fileImages.filter(item => item instanceof File)) {
        const res = await uploadService.uploadImage(fileImages[img], getPathName(pathname));

        imageUrls.push(res.data);
      }
      
    }
    

    if (data.id !== "-1") {
      const res = await menuService.updateMenu(data.id, {
        name: data.name,
        order: Number(data.order),
        price: Number(data.price),
        categoryRef: data.categoryRef,
        isAvailable: data.isAvailable,
        isSpicy: data.isSpicy,
        isVeg: data.isVeg,
        isNonVeg: !data.isVeg,
        description: data.description,
        images: data.images ? [...data.images, ...imageUrls] : [...imageUrls],
        ingredients: data.ingredients && data.ingredients.length ?
          data.ingredients.includes('\n') ? data.ingredients.split('\n') : [data.ingredients] : []
      }, getPathName(pathname));

      if (res) {
        // setLocalItems(localItems.map(each => {
        //   if (each._id === data.id) {
        //     each = JSON.parse(JSON.stringify({
        //       ...data,
        //       images: [...data.images, ...imageUrls],
        //     }));
        //   }

        //   return each;
        // }));
        fetchMenu();
      }
    } else {
      const res = await menuService.addMenu({
        name: data.name,
        order: Number(data.order),
        price: Number(data.price),
        categoryRef: selectedCategory,
        isAvailable: data.isAvailable,
        isSpicy: data.isSpicy,
        isVeg: data.isVeg,
        images: [...imageUrls],
        isNonVeg: !data.isVeg,
        description: data.description,
        ingredients: data.ingredients && data.ingredients.length ?
          data.ingredients.includes('\n') ? data.ingredients.split('\n') : [data.ingredients] : []
      }, getPathName(pathname));
      if (res) {
        fetchMenu();
      }
      
    }

  };

  const onDelete = async (id: string) => {
    const res = await menuService.deleteMenu(id, getPathName(pathname));
    if (res) {
      fetchMenu();
    }
  }

  return <MyAccordion
    toggleAvailability={toggleAvailability}
    openItem={openItem}
    chooseItem={chooseMenu}
    onEdit={onEdit}
    onDelete={onDelete}
    items={localItems.map(each => {
      return {
        ...each,
        id: each._id,
        header: each.name,
        subText: each.order,
        content: "MenuDetails"
      }
    })} />
}

export default MenuItem;