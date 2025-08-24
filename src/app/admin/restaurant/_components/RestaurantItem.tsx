"use client";

import MyAccordion from "@/components/ui/accordion";
import { RestaurantStatus } from "@/config/config";

const RestaurantItem = ({ items, onEdit, onDelete, chooseRestaurant, openItem, selectedRestaurant, fetchOwners, ownerList, onEditOwner }) => {
  return <MyAccordion
    openItem={openItem}
    selectedCategory={selectedRestaurant}
    chooseItem={chooseRestaurant}
    onEdit={onEdit}
    onDelete={onDelete}
    fetchMenu={fetchOwners}
    onEditOwner={onEditOwner}
    items={items.map(each => {
      return {
        id: each._id,
        header: each.name,
        subText: RestaurantStatus[each.status],
        content: "Restaurant",
        ownerList: ownerList
      }
    })} />
}

export default RestaurantItem;