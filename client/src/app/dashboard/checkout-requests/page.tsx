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

export type Payment = {
  _id: string;
  amount: number;
  description: string;
  createdDate: Date;
};

function CheckoutRequests() {
  const router = useRouter();
  const { toast } = useToast();

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "guestNo",
      header: "Guest No",
    },
    {
      accessorKey: "descrption",
      header: "Reason",
    },
    {
      accessorKey: "vaccateDate",
      header: "Vaccating Date",
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
  ];

  const [inputVariables, setInputVariables] = useState<{
    listPaymentInput: {
      limit: number;
      skip: number;
      sortOrder: number;
      statusArray: number[];
    };
  }>({
    listPaymentInput: {
      statusArray: [1],
      limit: 10,
      skip: 0,
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
      const paymentList = data?.Payment_List?.list || [];
      console.log("inner", paymentList);
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
          <Button asChild>
            <Link href={"checkout-requests/create"}>Create</Link>
          </Button>
        </div>
        <DataTable columns={columns} data={data?.Payment_List?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listPaymentInput.skip || 0}
          totalCount={data?.Payment_List?.totalCount || 0}
          limit={inputVariables?.listPaymentInput.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
}

export default CheckoutRequests;
