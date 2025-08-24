"use client";

import MyAccordion from "@/components/ui/accordion";
import { RestaurantOwnerStatus } from "@/config/config";

const RestaurantOwnerItem = ({ items, onDelete, openItem, selectedRestaurant, fetchOwners,onEdit }) => {

  return <>
    <MyAccordion
      openItem={openItem}
      selectedCategory={selectedRestaurant}
      chooseItem={() => { }}
      onEdit={onEdit}
      onDelete={onDelete}
      fetchMenu={fetchOwners}
      items={items.map(each => {
        return {
          id: each._id,
          header: each.personalInfo.fullName,
          subText: RestaurantOwnerStatus[each.accountStatus],
          content: "Restaurant"
        }
      })} />
  </>
}

export default RestaurantOwnerItem;