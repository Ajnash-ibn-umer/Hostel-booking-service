"use client"

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/navigation'
import React from 'react'

function Category() {
  const router=useRouter()

  return (
    <div>
    <Breadcrumb pageName="Category" />

    {/* <p className="mt-[3px] text-body-sm font-medium">
                  ${itemData.price}
                </p> */}

    <div className="flex flex-col gap-10">
      <div className="flex justify-end ">
        <Button
          background="primary"
          fontColor="white"
          buttonType="rounded-corner"
          onClick={()=>router.push('categories/create')}
        >
          Create
        </Button>
      </div>

    </div>
  </div>
  )
}

export default Category