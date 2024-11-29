"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import Pageniation from "@/components/pagination/pagination";
import { DataTable } from "@/components/Datatables/data-table";
import {
  CONTACT_LIST_FOR_TABLE_GQL,
  CHECK_IN_GUEST,
} from "@/graphql/queries/main.quiries";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { AlertConfirm } from "@/components/Alerts/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { CHECKOUT_FORCED } from "@/graphql/queries/main.mutations";
import { CheckInGuestUserList } from "./_lib/check-in-guest";

export type checkoutInput = {
  bedId: string;
  contractId: string;
  guestId: string;
  remark: string;
};

function CheckedInGuest() {
  const router = useRouter();
  const { toast } = useToast();
  const [checkoutForce] = useMutation(CHECKOUT_FORCED);
  const approvalCheckout = async (checkoutInput: checkoutInput) => {
    try {
      const { data, errors } = await checkoutForce({
        variables: {
          forcedCheckoutInput: {
            bedId: checkoutInput.bedId,
            contractId: checkoutInput.contractId,
            guestId: checkoutInput.guestId,
            remark: "admin forced checkouted",
          },
        },
      });

      if (data) {
        toast({
          variant: "default",
          title: "Successfully Checkouted",
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
  const [inputVariables, setInputVariables] = useState<{
    listUserInput: {
      statusFilter: number[];
      bookingStatusFilter: number[];
      limit: number;
      skip: number;
      sortOrder: number;
    };
  }>({
    listUserInput: {
      statusFilter: [1],
      limit: 10,
      skip: 0,
      sortOrder: -1,
      bookingStatusFilter: [6],
    },
  });

  const { data, error, refetch } = useQuery(CHECK_IN_GUEST, {
    variables: inputVariables,
  });

  const columns: ColumnDef<CheckInGuestUserList>[] = [
    {
      accessorKey: "userNo",
      header: "User Number",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        return row.getValue("isActive") ? "Active" : "Inactive";
      },
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        return (
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
                    approvalCheckout({
                      bedId: row.original.contract.bedId ?? null,
                      contractId: row.original.contract._id,
                      guestId: row.original._id,
                      remark: "admin forced checkouted",
                    })
                  }
                >
                  Confirm Checkout
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const changePage = (skip: number) => {
    setInputVariables({
      listUserInput: {
        ...inputVariables.listUserInput,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Response not found",
        description: error.message,
      });
    }
  }, [error]);

  return (
    <div>
      <Breadcrumb pageName="Checked-In Guest" />

      <div className="flex flex-col gap-10">
        <DataTable columns={columns} data={data?.User_List?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listUserInput.skip || 0}
          totalCount={data?.User_List?.totalCount || 0}
          limit={inputVariables?.listUserInput.limit || 10}
        />
      </div>
    </div>
  );
}

export default CheckedInGuest;
