"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { BOOKING_LIST_MINIMAL_GQL } from "@/graphql/queries/main.quiries"; // Assuming a similar query exists for bookings
import Link from "next/link";
import Pageniation from "../../../components/pagination/pagination";
import { DataTable } from "../../../components/Datatables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AlertConfirm } from "@/components/Alerts/alert";
import { useToast } from "@/hooks/use-toast";

export type Booking = {
  _id: string;
  arrivalTime: Date;
  basePrice: number;
  bedId: string;
  bedName: string;
  bookingNumber: string;
  bookingStatus: number;
  canteenFacility: string;
  email: string;
  name: string;
  phone: string;
  propertyId: string;
  regNo: string;
  roomId: string;
  securityDeposit: number;
  selectedPaymentBase: string;
  status: number;
  checkInDate: Date;
  checkOutDate: Date;
  property: {
    name: string;
    _id: string;
  };
};

function Booking() {
  const router = useRouter();
  const { toast } = useToast();

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "bookingNumber",
      header: "BookingNo",
    },
    {
      accessorKey: "name",
      header: "Customer Name",
    },
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ row }) => {
        const name = row.original.property["name"];
        return name;
      },
    },
    {
      accessorKey: "arrivalTime",
      header: "Check-In Date",
      cell: ({ row }) =>
        new Date(row.getValue("arrivalTime")).toLocaleDateString(),
    },
    {
      accessorKey: "bookingStatus",
      header: "Booking Status",
      cell: ({ row }) => {
        const status = row.getValue("bookingStatus");
        switch (status) {
          case 1:
            return "Init";
          case 2:
            return "Form Submitted";
          case 3:
            return "Payment Failed";
          case 4:
            return "Payment Sucess";
          case 5:
            return "Admin Approved";
          case 6:
            return "Chek in";
          default:
            return "Unknown";
        }
      },
    },
    {
      id: "operations",
      header: "Operations",

      cell: ({ row }) => {
        // const [deleteData, { loading, error }] = useMutation(BOOKING_DELETE_GQL);

        // const deleteBooking = async () => {
        //   try {
        //     const { data, errors } = await deleteData({
        //       variables: {
        //         statusChangeInput: {
        //           _status: 2,
        //           ids: [row.original._id],
        //         },
        //       },
        //     });

        //     if (data) {
        //       toast({
        //         variant: "default",
        //         title: `Delete successful`,
        //         description: `Booking deleted successfully`,
        //       });
        //       refetch(inputVariables);
        //     }
        //   } catch (error: any) {
        //     toast({
        //       variant: "destructive",
        //       title: `Delete Failed`,
        //       description: error.toString(),
        //     });
        //   }
        // };

        return (
          <div className="flex gap-2">
            <AlertConfirm
              cancel="Cancel"
              confirm="Delete"
              description=""
              title="Do you want to delete this booking?"
              onContinue={() => {}}
            >
              <Button variant={"secondary"}>Approve</Button>
            </AlertConfirm>
            <Link href={`bookings/update/${row.original._id}`}>
              <Button variant={"link"}>Cancel</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const [inputVariables, setInputVariables] = useState<{
    dto: {
      statusArray: number[];
      limit: number;
      skip: number;
      searchingText: string | null;
      sortOrder: number;
    };
  }>({
    dto: {
      statusArray: [1],
      limit: 10,
      skip: 0,
      searchingText: null,
      sortOrder: 1,
    },
  });

  const { loading, data, error, refetch } = useQuery(BOOKING_LIST_MINIMAL_GQL, {
    variables: inputVariables,
  });

  const changePage = (skip: number) => {
    setInputVariables({
      dto: {
        ...inputVariables.dto,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };

  useEffect(() => {
    if (error) {
      alert(error.message);
    }
  }, [error]);

  return (
    <div>
      <Breadcrumb pageName="Booking" />

      <div className="flex flex-col gap-10">
        {/* <div className="flex justify-end ">
          <Button asChild>
            <Link href={"bookings/create"}>Approve</Link>
          </Button>
        </div> */}
        <DataTable columns={columns} data={data?.Booking_List?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.dto.skip || 0}
          totalCount={data?.Booking_List?.totalCount || 0}
          limit={inputVariables?.dto.limit || 10}
        />
      </div>
    </div>
  );
}

export default Booking;
