"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import Pageniation from "@/components/pagination/pagination";
import { DataTable } from "@/components/Datatables/data-table";
import { ROOM_TYPE_LIST_GQL } from "@/graphql/queries/main.quiries";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { ROOM_TYPE_DELETE_GQL } from "@/graphql/queries/main.mutations";
import { AlertConfirm } from "@/components/Alerts/alert";

export type RoomType = {
  _id: string;
  bedCount: number;
  description: string;
  name: string;
  rentDailyLower: number;
  rentDailyUpper: number;
  rentMonthlyLower: number;
  rentMonthlyUpper: number;
  securityDeposit: number;
  createdAt: Date;
  createdUser: any;
};

function RoomTypes() {
  const router = useRouter();
  const { toast } = useToast();
  const [inputVariables, setInputVariables] = useState<{
    listInput: {
      statusArray: number[];
      limit: number;
      skip: number;
      searchingText: string | null;
      sortOrder: number;
    };
  }>({
    listInput: {
      statusArray: [1],
      limit: 10,
      skip: 0,
      searchingText: null,
      sortOrder: 1,
    },
  });

  const { loading, data, error, refetch } = useQuery(ROOM_TYPE_LIST_GQL, {
    variables: inputVariables,
  });

  const columns: ColumnDef<RoomType>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "bedCount",
      header: "Bed Count",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    
    {
      accessorKey: "createdUser.name",
      header: "Created User",
      cell: ({ row }) => {
        return row.original.createdUser?.name || "";
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "operations",
      cell: ({ row }) => {
        const { toast } = useToast();
        const [deleteData, { loading, error }] =
          useMutation(ROOM_TYPE_DELETE_GQL);

        const deleteRoomType = async () => {
          try {
            const { data } = await deleteData({
              variables: {
                statusChangeInput: {
                  _status: 2,
                  ids: [row.original._id],
                },
              },
            });

            if (data) {
              toast({
                variant: "default",
                title: `Delete successful`,
                description: `Room type deleted successfully`,
              });
              refetch(inputVariables);
            }
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: `Delete Failed`,
              description: error.toString(),
            });
          }
        };

        return (
          <div className="flex gap-2">
            <AlertConfirm
              cancel="Cancel"
              confirm="Delete"
              description=""
              title="Do you want to delete this room type?"
              onContinue={deleteRoomType}
            >
              <Button variant={"destructive"}>Delete</Button>
            </AlertConfirm>
            <Link href={`room-types/update/${row.original._id}`}>
              <Button variant={"link"}>Edit</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const changePage = (skip: number) => {
    setInputVariables({
      listInput: {
        ...inputVariables.listInput,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };

  useEffect(() => {
    if (data) {
      console.log("Room Types Data:", data);
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Response not found",
        description: error.message,
      });
    }
  }, [data]);

  return (
    <div>
      <Breadcrumb pageName="Room Types" />
      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
          <Button asChild>
            <Link href={"room-types/create"}>Create</Link>
          </Button>
        </div>
        <DataTable columns={columns} data={data?.RoomType_List?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listInput.skip || 0}
          totalCount={data?.RoomType_List?.totalCount || 0}
          limit={inputVariables?.listInput.limit || 10}
        />
      </div>
    </div>
  );
}

export default RoomTypes;
