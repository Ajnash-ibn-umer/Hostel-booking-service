"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Category = {
  _id: string
  name: number
  description:string
  createdDate: Date
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "slug",
    header: "UID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
       new Date(row.getValue("createdAt")).toLocaleString()
      ),
  },
  {
    id:'operations',
    cell:({row})=>{
      
      return(
<>
<div className="flex gap-2">
<Button variant={'destructive'} >Delete</Button>
<Button variant={'link'} >Edit</Button>
</div>


</>

    )}
  }
]
