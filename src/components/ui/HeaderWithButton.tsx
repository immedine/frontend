"use client";
import Link from "next/link";
import { Heading } from "./heading";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import ControlledDialog from "./dialog";
import { useState } from "react";
import { getPathName } from "@/lib/utils";
import CategoryForm from "@/app/category/_components/category-form";
import RestaurantForm from "@/app/restaurant-details/_components/RestaurantForm";
import OwnerForm from "@/app/auth/register/_components/OwnerForm";
// import RestaurantForm from "@/app/admin/restaurant/_components/RestaurantForm";

interface HeaderWithButtonProps {
  title: string;
  description: string;
  buttonText: string;
  buttonClass?: string;
  buttonHref?: string;
  formType?: string;
  fetchData?: any;
}

const HeaderWithButton = ({
  title,
  description,
  buttonText,
  buttonClass,
  buttonHref,
  formType,
  fetchData,
  button2Text,
  fetchData2,
  restaurants
}: HeaderWithButtonProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const setAdded = () => {
    setIsOpen(false);
    fetchData();
  };

  const setAdded2 = () => {
    setIsOpen2(false);
    fetchData2();
  };
  
  return <>
    <Heading
      title={title}
      description={description}
    />
    <div>
    {buttonHref ?
    <Link
      href={`${getPathName(pathname, true)}${buttonHref}`}
      className={buttonClass}
    >
      <Plus className="mr-2 h-4 w-4" /> {buttonText}
    </Link> : null}
    {formType ? <Button onClick={() => setIsOpen(true)}>
      <Plus className="mr-2 h-4 w-4" /> {buttonText}
    </Button> : null}
    {button2Text ? <Button className="ml-2" onClick={() => setIsOpen2(true)}>
      <Plus className="mr-2 h-4 w-4" /> {button2Text}
    </Button> : null}
    {formType === "Category" ?
    <ControlledDialog 
      heading="Create Category"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      >
        <CategoryForm categoryId="new" setAdded={setAdded} />
      </ControlledDialog> : 
      formType === "Restaurant" ?
      <>
    <ControlledDialog 
      heading="Create Restaurant"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      >
        <RestaurantForm setAdded={setAdded} fromAdmin={true} />
      </ControlledDialog>
      <ControlledDialog 
      heading="Create Owner"
      isOpen={isOpen2}
      setIsOpen={setIsOpen2}
      >
        {restaurants?.length ? <OwnerForm fromAdmin={true} setAdded={setAdded2} restaurants={restaurants} /> : <div>Please add a restaurant</div>}
      </ControlledDialog>
      </> 
     : null}
     </div>
  </>
};

export default HeaderWithButton;