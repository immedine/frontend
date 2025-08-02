"use client";

import { useUserStore } from "@/store/UserStore";


export default function SectionHeaders({ subHeader, mainHeader }) {
    const userData = useUserStore((state) => state.user);
  
  return (
    <>
      <h3 className="uppercase text-gray-500 font-semibold leading-4 font-lemon">
        {subHeader}
      </h3>
      <h2 className={`text-${!userData.dark ? 'white': 'black'} font-bold text-lg`}> {mainHeader}</h2>
    </>
  );
}
