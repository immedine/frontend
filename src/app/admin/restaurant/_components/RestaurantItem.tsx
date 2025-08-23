"use client";

import MyAccordion from "@/components/ui/accordion";
import { RestaurantStatus } from "@/config/config";

const RestaurantItem = ({ items, onEdit, onDelete, chooseRestaurant, openItem, selectedRestaurant }) => {
  return <MyAccordion
    openItem={openItem}
    selectedCategory={selectedRestaurant}
    chooseItem={chooseRestaurant}
    onEdit={onEdit}
    onDelete={onDelete}
    items={items.map(each => {
      return {
        id: each._id,
        header: each.name,
        subText: RestaurantStatus[each.status],
        content: "Restaurant"
      }
    })} />
}

export default RestaurantItem;