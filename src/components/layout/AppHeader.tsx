"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   NavbarMenuToggle,
//   NavbarMenuItem,
//   NavbarMenu,
//   user,
// } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/UserStore";
import { restaurantService } from "@/services/restaurant.service";
import { primaryColor } from "@/config/config";
import Cookies from "js-cookie";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/config/cookie-keys";
import ListIcon from "./svg/List";
export default function AppHeader({restaurantId}) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const pathname = usePathname();
  // const menuItems = [
  //   { title: "Menu", href: "/menu" },
  //   // { title: "Contact", href: "/#contact" },
  // ];
  
  const userData = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const fetchRestaurantDetails = async () => {
    const res = await restaurantService.getRestaurantFromApp(restaurantId);

    if (res.data) {
      setUser({
        ...userData,
        restaurant: res.data
      });
      
      Cookies.set(PRIMARY_COLOR, res.data.primaryColor || primaryColor);
      Cookies.set(SECONDARY_COLOR, res.data.secondaryColor || primaryColor);
    }
  };

  useEffect(() => {
    restaurantId && !userData?.restaurant && fetchRestaurantDetails();
  }, [restaurantId]);

  return (
    <header className={`flex items-center justify-between font-poppins font-xl p-2`} style={{
      backgroundColor: userData?.restaurant?.primaryColor || primaryColor
    }}>
        <div className="flex justify-between items-center w-full px-4 h-12">
          <Link
            className={`text-white font-semibold text-lg`}
            href="/menu"
          >
            {userData?.restaurant?.logo ? <img src={userData?.restaurant?.logo} alt="Restaurant Logo" className="w-12 mr-2 inline-block" />
            :userData?.restaurant?.name || "[Restaurant Name]"}
          </Link>
          <button type="button"
            onClick={() => setUser({...userData, isFilterOpen: !userData?.isFilterOpen})}
          >
            <ListIcon 
              width="w-6"
              height="h-6"
            />
          </button>
        </div>
    </header> 
  );
}
