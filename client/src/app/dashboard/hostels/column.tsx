"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
interface hostelListInterface {
  name: string;
  propertyNo: string;
  sellingPrice: number;
  standardPrice: number;
  totalRooms: number;
}

export const hostelColumns: ColumnDef<hostelListInterface>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "propertyNo",
    header: "Property Number",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "standardPrice",
    header: "Standard Price",
  },
  {
    accessorKey: "totalRooms",
    header: "Total Rooms",
  },
]
