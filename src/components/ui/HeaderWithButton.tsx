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
import RestaurantForm from "@/app/admin/restaurant/_components/RestaurantForm";

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
  fetchData
}: HeaderWithButtonProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const setAdded = () => {
    setIsOpen(false);
    fetchData();
  };
  
  return <>
    <Heading
      title={title}
      description={description}
    />
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
    {formType === "Category" ?
    <ControlledDialog 
      heading="Create Category"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      >
        <CategoryForm categoryId="new" setAdded={setAdded} />
      </ControlledDialog> : formType === "Restaurant" ?
    <ControlledDialog 
      heading="Create Restaurant"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      >
        <RestaurantForm setAdded={setAdded} fromAdmin={true} />
      </ControlledDialog> : null}
  </>
};

export default HeaderWithButton;