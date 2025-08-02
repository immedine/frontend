"use client";
// import { useCartProductsStore } from "@/store/CartProductStore";
import Image from "next/image";
import { useUserStore } from "@/store/UserStore";
// import { AddToCart } from "../ui/addToCart";
import { useEffect, useState } from "react";

export default function MenuListItem({ product, onRemove, hideAddToCart }) {
  const addToCart = () => {};
  // const addToCart = useCartProductsStore((state) => state.addToCart);
  const userData = useUserStore((state) => state.user);
  const [menuData, setMenuData] = useState(product);
  

  const cartData = [];
  // const cartData = useCartProductsStore((state) => state.cartProducts);
  
    // useEffect(() => {
    //   if (cartData?.length > 0) {
    //     // check if items in cart are available in the menuItems
    //     const cartItemIds = cartData.map((item) => item._id);
    //     if (cartItemIds.includes(product._id)) {
    //       setMenuData((prev) => ({
    //         ...prev,
    //         inCartCount: cartData.filter((item) => item._id === product._id)[0]?.inCartCount || 0,
    //       }));
    //     } else {
    //       setMenuData((prev) => ({
    //         ...prev,
    //         inCartCount: 0,
    //       }));
    //     }
    //   } else {
    //     setMenuData((prev) => ({
    //       ...prev,
    //       inCartCount: 0,
    //     }));
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [cartData]);


  const handleAddToCard = async (menu, count) => {
    addToCart(menu, count);
  };

  return (
    <div className={` py-2 px-2 ${!userData?.dark ? 'bg-[#2f2e33] text-white' : 'bg-white text-black'} rounded-lg mb-4`} style={{
      boxShadow: userData?.dark ? '2px 2px 7px 0px rgba(0,0,0,0.7)' : 'none'
    }}>
      <div className="flex justify-between items-center gap-4">
        {/* <div className="w-16 h-16">
          <Image width={100} height={100} src={product.image} alt={""} className="rounded-lg h-full" />
        </div> */}
        <div className="grow">

          <div className={`${!hideAddToCart ? 'flex justify-between items-center' : ''} gap-4 relative`}>
            <div>
              <h3 className="text-xs">{product.name}</h3>

              <div className="flex justify-between items-center">
                <div className="text-xs font-semibold mt-1">
                  ₹{(product.price).toFixed(2)}
                </div>
              </div>
            </div>
            {/* <AddToCart
              menuItem={product}
              handleAddToCard={handleAddToCard}
              inCartCount={menuData?.inCartCount || 0}
              classes={`top-[5px] -top-[18px] p-1`}
              isVertical={false}
            /> */}
            {/* {!!onRemove && (
            <div>
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon onClick={() => onRemove()} />
              </span>
            </div>
          )} */}
          </div>


        </div>
      </div>
    </div>
  );
}
