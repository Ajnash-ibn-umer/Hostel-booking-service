"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { PAYMENT_LIST_GQL } from "@/graphql/queries/main.quiries";
import Link from "next/link";
import Pageniation from "../../../components/pagination/pagination";
import { DataTable } from "../../../components/Datatables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AlertConfirm } from "@/components/Alerts/alert";
import { useToast } from "@/hooks/use-toast";
import { Payment, PAYMENT_STATUS, VOUCHER_TYPE } from "./_lib/payment.entity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { PAYMENT_PAY_APPROVAL } from "@/graphql/queries/main.mutations";

function Payments() {
  const router = useRouter();
  const { toast } = useToast();
  const [changeStatus] = useMutation(PAYMENT_PAY_APPROVAL);

  const approvalStatusChange = async (paymentId: string, status: number) => {
    try {
      console.log(paymentId, { status });
      const { data, errors } = await changeStatus({
        variables: {
          updatePaymentApprovalStatus: {
            paymentId: paymentId,
            requestStatus: status,
          },
        },
      });

      if (data) {
        toast({
          variant: "default",
          title: "Successfully Status changed as Paid",
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
      cell: ({ row }) => row.original?.user?.userNo ?? "",
    },
    {
      accessorKey: "payAmount",
      header: "Amount",
      cell: ({ row }) => row.original.payAmount,
    },
    {
      accessorKey: "voucherType",
      header: "Payment Type",
      cell: ({ row }) => {
        return VOUCHER_TYPE[row.original.voucherType].replaceAll("_", " ");
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) =>
        PAYMENT_STATUS[row.original.paymentStatus].toLocaleLowerCase(),
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <>
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
                        PAYMENT_STATUS.PAYED,
                      )
                    }
                  >
                    Approve as Payed
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        );
      },
    },
  ];

  const [inputVariables, setInputVariables] = useState<{
    listPaymentInput: {
      statusArray: number[];
      limit: number;
      skip: number;
      searchingText: string | null;
      sortOrder: number;
    };
  }>({
    listPaymentInput: {
      statusArray: [1],
      limit: 10,
      skip: 0,
      searchingText: null,
      sortOrder: -1,
    },
  });

  const { loading, data, error, refetch } = useQuery(PAYMENT_LIST_GQL, {
    variables: inputVariables,
  });
  const changePage = (skip: number) => {
    console.log({ skip });
    setInputVariables({
      listPaymentInput: {
        ...inputVariables.listPaymentInput,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };
  useEffect(() => {
    console.log({ data });
    if (data) {
      const paymentList = data?.Payment_list?.list || [];
      console.log("inner", paymentList);
    }
    if (error) {
      alert(error.message);
    }
  }, [data]);
  return (
    <div>
      <Breadcrumb pageName="Payments" />

      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
          {/* <Button asChild>
            <Link href={"payments/create"}>Create</Link>
          </Button> */}
        </div>
        <DataTable columns={columns} data={data?.Payment_list?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listPaymentInput.skip || 0}
          totalCount={data?.Payment_list?.totalCount || 0}
          limit={inputVariables?.listPaymentInput.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
}

export default Payments;
