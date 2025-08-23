'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Pencil, PlusIcon, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import MenuForm from './MenuComponent/MenuForm';
import MenuItem from './MenuComponent/MenuItem';
import { Switch } from './switch';
import { Badge } from './badge';
import CustomAlertDialog from './alert-dialog';

export default function MyAccordion({ items, onEdit, onDelete, chooseItem, openItem, openMenuItem, setOpenMenuItem, toggleAvailability, fetchMenu, selectedCategory }) {

  const [openDeleteConfirmation, setDeleteConfirmation] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState("");

  return (
    <>
    {openDeleteConfirmation && <CustomAlertDialog 
      header={"Delete Confirmation"}
      description={"Are you sure you want to delete this item?"}
      submitButtonText={"Delete"}
      onSubmit={() => {
        onDelete(itemToBeDeleted);
        setDeleteConfirmation(false);
      }}
      open={openDeleteConfirmation}
      setOpen={setDeleteConfirmation}
    />} 
    <Accordion.Root type="single" value={openItem} id={openItem} collapsible className="w-full rounded border border-gray-300">
      {items.map(item => {
        return <Accordion.Item value={`${item.id}`} className="border-b" key={item.id} onClick={() => chooseItem(item)}>
          {item.id !== "-1" ?
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex justify-between items-center w-full p-4 text-left font-medium">
              <span>{item.header}
                {item.type === "Category" ? <span className='text-xs ml-2'>({item.subText})</span> : null}
                  <>
                    <button className="ml-2 align-middle" onClick={(e) => { e.stopPropagation(); onEdit(item.id) }}>
                      <Pencil size={16} />
                    </button>
                    <button className="ml-2 align-middle" onClick={(e) => { e.stopPropagation(); setItemToBeDeleted(item.id); setDeleteConfirmation(true); }}>
                      <Trash2 size={16} />
                    </button>
                  </>
                {item.content === "MenuDetails" ? <div className='text-medium'>Price: ₹{item.price}</div> : null}
              </span>
              {item.content === "Menu" ?
                <ChevronDownIcon className="transition-transform duration-300 AccordionChevron" /> :
                item.content === "Restaurant" ? 
                <div>
                  {item.subText}
                </div>
                :
                <div>
                    <div className='mb-2 flex items-center justify-end'>
                      <Badge
                        text={item.isVeg ? "Veg" : "Non Veg"}
                        bgColor={item.isVeg ? "bg-green-600" : "bg-red-600"}
                      />
                      {item.isSpicy ?
                      <Badge
                        classes={'ml-2'}
                        text={"Spicy"}
                        bgColor={"bg-orange-600"}
                      /> : null}
                    </div>
                  
                  <div className='flex items-center'>
                    <label className="font-medium mr-2">Available</label>
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => toggleAvailability(item)}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                  </div>
              }
            </Accordion.Trigger>
          </Accordion.Header> :
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex items-center w-full p-4 text-left font-medium">
              <PlusIcon /> Add menu item
            </Accordion.Trigger>
          </Accordion.Header>}
          <Accordion.Content className={`px-4 bg-gray-50 ${item.content === "MenuDetails" ? 'pt-0 pb-4' : 'py-4'}`}>
            {item.content === "Menu" ?
              <div>
                {!item.menuList?.length ?
                  <>
                    <MenuItem
                      openItem={openMenuItem}
                      items={[{
                        _id: "-1",
                        id: "-1"
                      }]}
                      chooseMenu={(item: any) => setOpenMenuItem(item.id)}
                      fetchMenu={fetchMenu}
                      selectedCategory={selectedCategory}
                    />
                    {/* <MenuForm /> */}
                  </> :
                  <MenuItem
                    openItem={openMenuItem}
                    items={[{
                        _id: "-1",
                        id: "-1"
                      }].concat(item.menuList)}
                    // onEdit={editMenu}
                    // onDelete={deleteMenu}
                    chooseMenu={(item: any) => setOpenMenuItem(item.id)}
                    fetchMenu={fetchMenu}
                    selectedCategory={selectedCategory}
                  />
                }
              </div> : 
              item.content === "MenuDetails" ? 
              <div>
                <MenuForm
                  details={item.id === "-1" ? undefined : item}
                  submitForm={(data, images) => {
                    onEdit({
                      ...data,
                      id: item.id
                    }, images, setOpenMenuItem);
                  }}
                />

              </div>
              : item.content
            }
          </Accordion.Content>
        </Accordion.Item>
      })}


    </Accordion.Root>
    </>
  );
}
