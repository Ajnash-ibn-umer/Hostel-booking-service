"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import MainTable from "@/components/Tables/MainTable";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Pagination from "@/components/pagination/pagination";

import { AlertConfirm } from "@/components/Alerts/alert";
import { DAMAGE_AND_SPLIT_LIST_QUERY } from "@/graphql/queries/main.quiries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DamageAndSplit } from "./_lib/damageAndSplit";
import { DataTable } from "@/components/Datatables/data-table";
import dayjs from "dayjs";
import DamageAndSplitDetailsSheet from "./details";
const DamageAndSplitList: React.FC = () => {
  const router = useRouter();
  const [damageAndSplitData, setDamageAndSplitData] = useState<any[]>([]);
  const [inputVariables, setInputVariables] = useState<{
    dto: {
      statusArray: number[];
      limit: number;
      skip: number;
      sortOrder: number;
    };
  }>({
    dto: {
      statusArray: [1],
      limit: 10,
      skip: 0,
      sortOrder: -1,
    },
  });
  const { data, loading, refetch } = useQuery(DAMAGE_AND_SPLIT_LIST_QUERY, {
    variables: inputVariables,
    fetchPolicy: "network-only",
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
    if (data?.DamageAndSplit_List?.list) {
      setDamageAndSplitData(data.DamageAndSplit_List.list);
    }
  }, [data]);
  const columns: ColumnDef<DamageAndSplit>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
    },
    {
      accessorKey: "receivedAmount",
      header: "Received",
    },
    {
      accessorKey: "amountStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        switch (row.original.amountStatus) {
          case 0:
            return "Pending";
          case 1:
            return "Partially Received";
          case 3:
            return "Fully Received";
          default:
            return "Unknown";
        }
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => dayjs(row.original.dueDate).format("DD/MM/YYYY"),
    },

    {
      accessorKey: "hostel.name",
      header: "Hostel Name",
      cell: ({ row }) => {
        return row.original.hostel?.name ?? "";
      },
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <DamageAndSplitDetailsSheet
              damageAndSplit={row.original}
            ></DamageAndSplitDetailsSheet>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem>Confirm Checkout</DropdownMenuItem>

                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <Breadcrumb pageName="Damage and Split Management" />
      <div className="mb-6 flex justify-end">
        <Button
          variant="default"
          onClick={() => router.push("damage-and-split/create")}
        >
          Create New
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <DataTable
          columns={columns}
          data={data?.DamageAndSplit_List?.list || []}
        />
        <Pagination
          fetch={changePage}
          skip={inputVariables?.dto.skip || 0}
          totalCount={data?.DamageAndSplit_List?.totalCount || 0}
          limit={inputVariables?.dto.limit || 10}
        />
      </div>
    </div>
  );
};

export default DamageAndSplitList;
