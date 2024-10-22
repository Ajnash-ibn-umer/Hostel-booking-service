import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Button from '@/components/Button/Button';
import ButtonDefault from '@/components/Button/Button';
import MainTable from '@/components/Tables/MainTable'
import React from 'react'

const UsersList: React.FC =()=> {


const packageData: any[] = [
  {
    name: "Free package",
    price: 0.0,
    invoiceDate: `Jan 13,2023`,
    status: "Paid",
  },
  {
    name: "Standard Package",
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: "Paid",
  },
  {
    name: "Business Package",
    price: 99.0,
    invoiceDate: `Jan 13,2023`,
    status: "Unpaid",
  },
  {
    name: "Standard Package",
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: "Paid",
  },
];

const headings=["Name","Price","Invoice Date","Status"]
  return (
    <div>
  <Breadcrumb pageName="Laundry Bookings" />

  {/* <p className="mt-[3px] text-body-sm font-medium">
                    ${itemData.price}
                  </p> */}

  <div className="flex flex-col gap-10">
    <div className='flex justify-end '>
    <Button  background='primary' fontColor='white'   buttonType='rounded-corner' >Create</Button>

    </div>
        <MainTable headings={headings} data={packageData}  />
      </div>
    </div>
  )
}

export default UsersList