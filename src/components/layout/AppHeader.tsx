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
export default function AppHeader() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuItems = [
    { title: "Menu", href: "/menu" },
    // { title: "Contact", href: "/#contact" },
  ];
  const userData = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  return (
    <header className={`flex items-center justify-between font-poppins font-xl bg-${!userData?.dark ? 'primary' : 'primary'} pt-4 pb-2 pl-2 pr-2`}>
        <div className="flex justify-between items-center w-full px-4">
          <Link
            className={`text-white font-semibold text-lg`}
            href="/menu"
          >
            [Restaurant]
          </Link>
          <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setUser({dark: !userData?.dark})}
                checked={userData?.dark}
                aria-label="Toggle dark/light mode"
              />
              <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none border rounded-full peer  transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 transition-transform peer-checked:translate-x-5">
                {userData?.dark ?
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block text-white align-top" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
              </svg> : 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block text-black align-top" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                    fill="currentColor"
                  />
                </svg>}
              </div>
            </label>
        </div>
    </header> 
  );
}
