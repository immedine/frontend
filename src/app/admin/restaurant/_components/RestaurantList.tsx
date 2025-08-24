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
// import RestaurantForm from './RestaurantForm';
import { toast } from 'sonner';
import RestaurantForm from '@/app/restaurant-details/_components/RestaurantForm';
import { restaurantOwnerService } from '@/services/restaurant-owner.service';
import OwnerForm from '@/app/auth/register/_components/OwnerForm';

export default function RestaurantListingPage() {
  const pathname = usePathname();
  const [restaurants, setRestaurants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [editableRestaurantId, setEditableRestaurantId] = useState("");
  const [editableOwner, setEditableOwner] = useState({});
  const [selectedRestaurant, selectRestaurant] = useState("");
  const [openItem, setOpenItem] = useState("");
  const [ownerList, setOwnerList] = useState([]);


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
      // setOpenItem(selectedRestaurant);
      fetchOwners();
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

  const setUpdated2 = () => {
    setIsOpen2(false);
    setEditableOwnerId("");
    fetchOwners();
  }

  const fetchOwners = async () => {
    const res = await restaurantOwnerService.getRestaurantOwners({
      filters: {
        restaurantRef: selectedRestaurant
      }
    }, getPathName(pathname));

    setOpenItem(selectedRestaurant);
    // setOpenMenuItem("");

    if (res.data && res.data.data) {
      setOwnerList(res.data.data);
    }
  };

  const editOwner = (id: string) => {
    const item = ownerList.filter(each => each._id === id)[0];
    setEditableOwner({
      email: item.personalInfo.email,
      phoneNumber: item.personalInfo.phone?.number || "",
      fullName: item.personalInfo.fullName,
      restaurantRef: item.restaurantRef
    });
    setIsOpen2(true);
  };

  return (
    <>
      <ControlledDialog
      heading="Update Owner"
      isOpen={isOpen2}
      setIsOpen={setIsOpen2}
    >
      {restaurants?.length ? <OwnerForm ownerData={editableOwner} fromAdmin={true} setAdded={setUpdated2} restaurants={restaurants} /> : <div>Please add a restaurant</div>}
    </ControlledDialog>
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
          button2Text='Add Owner'
          fetchData2={() => {}}
          restaurants={restaurants}
        />
      </div>
      <Separator className='my-4' />
      {restaurants.length ?
        <RestaurantItem
          openItem={openItem}
          items={restaurants}
          onEdit={editRestaurant}
          onEditOwner={editOwner}
          onDelete={deleteRestaurant}
          chooseRestaurant={(item: any) => selectRestaurant(item.id)}
          selectedRestaurant={selectedRestaurant}
          ownerList={ownerList}
        />
        : <div className="flex items-center justify-center p-4">No restaurants available!</div>}
    </>
  );
}
