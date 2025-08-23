'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ControlledDialog from '@/components/ui/dialog';
import HeaderWithButton from '@/components/ui/HeaderWithButton';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, getPathName } from '@/lib/utils';
import { restaurantService } from '@/services/restaurant.service';
import RestaurantItem from './RestaurantItem';
import RestaurantForm from './RestaurantForm';
import { toast } from 'sonner';

export default function RestaurantListingPage() {
  const pathname = usePathname();
  const [restaurants, setRestaurants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editableRestaurantId, setEditableRestaurantId] = useState("");
  const [selectedRestaurant, selectRestaurant] = useState("");
  const [openItem, setOpenItem] = useState("");
  const [openMenuItem, setOpenMenuItem] = useState("");

  const fetchRestaurants = async () => {
    const res = await restaurantService.getRestaurants({
      filters: {},
      sortConfig: {}
    }, getPathName(pathname));

    if (res.data && res.data.data) {
      setRestaurants(res.data.data);
    }
  };

  useEffect(() => {
    if (selectedRestaurant) {
      setOpenItem(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const deleteRestaurant = async (id: string) => {
    const res = await restaurantService.deleteRestaurantFromAdmin(id, getPathName(pathname));
    if (res) {
      toast.success("Restaurant deleted successfully");
      fetchRestaurants();
    }
  };

  const editRestaurant = (id: string) => {
    setIsOpen(true);
    setEditableRestaurantId(id);
  };

  const setUpdated = () => {
    setIsOpen(false);
    setEditableRestaurantId("");
    fetchRestaurants();
  }

  return (
    <>
      <ControlledDialog
        heading="Update Category"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <RestaurantForm restaurantId={editableRestaurantId} fromAdmin={true} setAdded={setUpdated} />
      </ControlledDialog>
      <div className="flex items-start justify-between">
        <HeaderWithButton
          title="Restaurant Management"
          description="Manage restaurants"
          formType={"Restaurant"}
          buttonClass={cn(buttonVariants(), 'text-xs md:text-sm')}
          buttonText='Add Restaurant'
          fetchData={fetchRestaurants}
        />
      </div>
      <Separator className='my-4' />
      {restaurants.length ?
        <RestaurantItem
          openItem={openItem}
          items={restaurants}
          onEdit={editRestaurant}
          onDelete={deleteRestaurant}
          chooseRestaurant={(item: any) => selectRestaurant(item.id)}
          selectedRestaurant={selectedRestaurant}
        />
        : <div className="flex items-center justify-center p-4">No restaurants available!</div>}
    </>
  );
}
