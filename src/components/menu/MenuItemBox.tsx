import React from "react";
import Image from "next/image";
import { defaultImage } from "@/config/config";
// import {AddToCart} from "@/components/ui/addToCart";

// import FlyingButton from "react-flying-item";
export default function MenuItemBox({ menuItem, handleAddToCard }) {
  const { name, description, image, price, inCartCount } = menuItem;
  return (
    <div className="mx-auto  w-full rounded-lg flex flex-col bg-white shadow-[0_0px_5px_rgba(0,0,0,0.25)] hover:shadow-black/25 transition-all relative" style={{
      height: "130px"
    }}
    // style={{
    //   backgroundImage: `url(${image})`,
    //   backgroundSize: 'cover',
    //   backgroundPosition: 'center',
    //   backgroundRepeat: 'no-repeat',
    //   backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    //   backdropFilter: 'blur(5px)',
    //   WebkitBackdropFilter: 'blur(5px)',
    //   borderRadius: '0.5rem'
    // }}
    >
      <div className="h-full w-full relative">
        <Image src={image || defaultImage} layout={"fill"} alt={""} className="rounded-lg" />
      </div>

      <div className="absolute left-0 bottom-0 bg-black/50 rounded-lg px-2 py-2 w-full text-white">
        <div className="flex justify-between items-center relative">
          <div>
            <h4 className="font-semibold text-xs"
              style={{
                paddingRight: '30px'
              }}
            >{name}</h4>
            <span className="font-semibold text-xs">
              ₹{price.toFixed(2)}
            </span>
          </div>
          <div className="">
            {/* <AddToCart
              menuItem={menuItem}
              handleAddToCard={handleAddToCard}
              inCartCount={inCartCount}
            /> */}
          </div>
        </div>
      </div>
      {/* </FlyingButton> */}
    </div>
  );
}