"use client";

// import { useCartProductsStore } from "@/store/CartProductStore";
import { useEffect, useState } from "react";
import MenuItemBox from "@/components/menu/MenuItemBox";
import Image from "next/image";
// import FlyingButton from "react-flying-item";
export default function MenuItem(menuItem) {
  const [showPopup, setShowPopup] = useState(false);
  const [menuData, setMenuData] = useState(menuItem);

  const { price, name, image, description, sizes, extraIngredientPrices, inCartCount } =
    menuData;

  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  // const addToCart = useCartProductsStore((state) => state.addToCart);
  const addToCart = () => {};

  // const cartData = useCartProductsStore((state) => state.cartProducts);
  const cartData = [];

  // useEffect(() => {
  //   if (cartData?.length > 0) {
  //     // check if items in cart are available in the menuItems
  //     const cartItemIds = cartData.map((item) => item._id);
  //     if (cartItemIds.includes(menuItem._id)) {
  //       setMenuData((prev) => ({
  //         ...prev,
  //         inCartCount: cartData.filter((item) => item._id === menuItem._id)[0]?.inCartCount || 0,
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
    // const hasOptions = sizes?.length > 0 || extraIngredientPrices?.length > 0;
    // if (hasOptions && !showPopup) {
    //   setShowPopup(true);
    //   return;
    // }

    addToCart(menu, count);
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // setShowPopup(false);
  };

  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => {
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  }

  //Price:
  let selectedPrice = price;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }
  return (
    <>
      {/* RQ:inset-0: It sets the top, right, bottom, and left positions of the element to 0,
       effectively making the element cover the entire viewport. */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-30"
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            className="my-8 bg-white p-2 rounded-lg max-w-md"
          >
            <div
              className="overflow-y-scroll p-2"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              <Image
                src={image}
                alt={name}
                width={300}
                height={200}
                className="mx-auto"
              />
              <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                {description}
              </p>
              <div className="flex justify-around items-center">
                {/* <FlyingButton targetTop={"5%"} targetLeft={"95%"} src={image}> */}
                <button
                  className="primary sticky bottom-2 bg-primary text-white rounded-full px-6 py-2 hover:bg-red-500"
                  onClick={handleAddToCard}
                >
                  Add to cart ${selectedPrice}
                </button>
                {/* </FlyingButton> */}

                <button
                  className="bg-gray-500 text-white rounded-full px-6 py-2 hover:bg-red-500"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <MenuItemBox handleAddToCard={handleAddToCard} menuItem={menuData} onClick={menuItem.onClick} />
    </>
  );
}
