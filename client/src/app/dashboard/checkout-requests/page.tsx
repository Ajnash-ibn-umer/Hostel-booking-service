"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CHECKOUT_REQUEST_LIST_GQL } from "@/graphql/queries/main.quiries";
import Link from "next/link";
import Pageniation from "../../../components/pagination/pagination";
import { DataTable } from "../../../components/Datatables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AlertConfirm } from "@/components/Alerts/alert";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { CHECKOUT_REQUEST_STATUS_UPDATE } from "@/graphql/queries/main.mutations";
import { CHECKOUT_REQUEST_STATUS } from "./_lib/checkout-req";

export type Payment = {
  _id: string;
  amount: number;
  description: string;
  createdDate: Date;
};

function CheckoutRequests() {
  const router = useRouter();
  const { toast } = useToast();
  const [changeStatus] = useMutation(CHECKOUT_REQUEST_STATUS_UPDATE);

  const approvalStatusChange = async (
    checkoutReqId: string,
    status: number,
  ) => {
    try {
      console.log(checkoutReqId, { status });
      const { data, errors } = await changeStatus({
        variables: {
          updateCheckoutInput: {
            chequoutRequestId: checkoutReqId,
            requestStatus: status,
            remark: "",
          },
        },
      });

      if (data) {
        toast({
          variant: "default",
          title: "Successfully Status changed",
          // description: "Booking Status Changed successfully",
        });
        refetch(); // Refetch the room bed list
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Status Change Failed",
        description: error.toString(),
      });
    }
  };
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "guestNo",
      header: "Guest No",
    },
    {
      accessorKey: "description",
      header: "Reason",
    },
    {
      accessorKey: "vaccateDate",
      header: "Vaccating Date",
      cell: ({ row }) =>
        dayjs(row.getValue("vaccateDate")).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) =>
        dayjs(row.getValue("vaccateDate")).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {/* <ComplaintDetailsSheet
      complaint={row.original}
    ></ComplaintDetailsSheet> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  approvalStatusChange(
                    row.original._id,
                    CHECKOUT_REQUEST_STATUS.APPROVED,
                  )
                }
              >
              Confirm Checkout
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  approvalStatusChange(
                    row.original._id,
                    CHECKOUT_REQUEST_STATUS.CANCELED,
                  )
                }
              >
                Cancel Checkout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const [inputVariables, setInputVariables] = useState<{
    listCheckoutRequestInput: {
      limit: number;
      skip: number;
      sortOrder: number;
      requestStatus?: number[];
      statusArray: number[];
    };
  }>({
    listCheckoutRequestInput: {
      statusArray: [1],
      limit: 10,
      skip: 0,
      requestStatus: [1, 2],
      sortOrder: -1,
    },
  });

  const { loading, data, error, refetch } = useQuery(
    CHECKOUT_REQUEST_LIST_GQL,
    {
      variables: inputVariables,
    },
  );
  const changePage = (skip: number) => {
    console.log({ skip });
    setInputVariables({
      listCheckoutRequestInput: {
        ...inputVariables.listCheckoutRequestInput,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };
  useEffect(() => {
    console.log({ data });
    if (data) {
      const checkoutRequestList = data?.CHECKOUT_REQUEST_LIST?.list || [];
      console.log("inner", checkoutRequestList);
    }
    if (error) {
      alert(error.message);
    }
  }, [data]);
  return (
    <div>
      <Breadcrumb pageName="Checkout Requests" />

      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
     
        </div>
        <DataTable
          columns={columns}
          data={data?.CHECKOUT_REQUEST_LIST?.list || []}
        />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listCheckoutRequestInput.skip || 0}
          totalCount={data?.CHECKOUT_REQUEST_LIST?.totalCount || 0}
          limit={inputVariables?.listCheckoutRequestInput.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
}

export default CheckoutRequests;
