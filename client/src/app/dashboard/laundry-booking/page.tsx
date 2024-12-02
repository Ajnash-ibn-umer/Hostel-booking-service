"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { LaundryBooking_List } from "@/graphql/queries/main.quiries";
import dayjs from "dayjs";
import Pageniation from "../../../components/pagination/pagination";
import { DataTable } from "../../../components/Datatables/data-table";
import { ColumnDef } from "@tanstack/react-table";

export type LaundryBooking = {
  _id: string;
  bookingDate: string;
  bookingType: string;
  createdAt: string;
  createdUser: { name: string };
  hostel: { name: string };
  requestStatus: number
};

function CheckoutRequests() {
  const router = useRouter();

  const columns: ColumnDef<LaundryBooking>[] = [
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) =>
        dayjs(row.getValue("bookingDate")).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "bookingType",
      header: "Booking Type",
      cell: ({ row }) => (row.getValue("bookingType") === 1 ? "Free" : "Pay"),
    },
    {
      accessorKey: "createdUser",
      header: "Created By",
      cell: ({ row }) => row?.original?.createdUser?.name,
    },
    {
      accessorKey: "hostel",
      header: "Hostel Name",
      cell: ({ row }) => row?.original?.hostel?.name,
    },
    {
      accessorKey: "requestStatus",
      header: "Request Status",
      cell: ({ row }) => {
        const status = row.getValue("requestStatus");
        switch (status) {
          case 1:
            return "Approved";
          case 2:
            return "Pending";
          case 3:
            return "Rejected";
          default:
            return "Unknown";
        }
      },
    }
  ];
  

  const [inputVariables, setInputVariables] = useState<{
    listInputLaundryBooking: {
      limit: number;
      skip: number;
      sortOrder: number;
    };
  }>({
    listInputLaundryBooking: {
      limit: 10,
      skip: 0,
      sortOrder: -1,
    },
  });

  const { loading, data, error, refetch } = useQuery(LaundryBooking_List, {
    variables: inputVariables,
  });

  

  const changePage = (skip: number) => {
    setInputVariables({
      listInputLaundryBooking: {
        ...inputVariables.listInputLaundryBooking,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };

  useEffect(() => {
    if (error) {
      console.log(error.message);
    }
  }, [data, error]);

  return (
    <div>
      <Breadcrumb pageName="Laundry Bookings" />

      <div className="flex flex-col gap-10">
        <DataTable
          columns={columns}
          data={data?.LaundryBooking_List?.list || []}
        />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listInputLaundryBooking.skip || 0}
          totalCount={data?.LaundryBooking_List?.totalCount || 0}
          limit={inputVariables?.listInputLaundryBooking.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
}

export default CheckoutRequests;
