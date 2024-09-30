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
  LOCATION_LIST_FOR_TABLE_GQL,
  LOCATION_LIST_GQL,
} from "@/graphql/queries/main.quiries";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { LOCATION_DELETE_GQL } from "@/graphql/queries/main.mutations";
import { AlertConfirm } from "@/components/Alerts/alert";

export type Location = {
  _id: string;
  name: number;
  createdAt: Date;
  createdUser: any;
};

function Location() {
  const router = useRouter();
  const { toast } = useToast();
  const [inputVariables, setInputVariables] = useState<{
    listInputLocation: {
      statusArray: number[];
      limit: number;
      skip: number;
      searchingText: string | null;
      sortOrder: number;
    };
  }>({
    listInputLocation: {
      statusArray: [1],
      limit: 10,
      skip: 0,
      searchingText: null,
      sortOrder: 1,
    },
  });

  const { loading, data, error, refetch } = useQuery(
    LOCATION_LIST_FOR_TABLE_GQL,
    {
      variables: inputVariables,
    },
  );

  const columns: ColumnDef<Location>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "createdUser.name",
      header: "Created User",
      cell: ({ row }) => {
        return row.original.createdUser.name;
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
          useMutation(LOCATION_DELETE_GQL);

        const deleteLocation = async () => {
          try {
            console.log();
            const { data, errors } = await deleteData({
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
                title: `Delete succesfull`,
                description: `Delete succesfull`,
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
          <>
            <div className="flex gap-2">
              <AlertConfirm
                cancel="Cancel"
                confirm="Delete"
                description=""
                title="Do you want to delete location ?"
                onContinue={deleteLocation}
              >
                <Button variant={"destructive"}>Delete</Button>
              </AlertConfirm>
              <Link href={`locations/update/${row.original._id}`}>
                <Button variant={"link"}>Edit</Button>
              </Link>
            </div>
          </>
        );
      },
    },
  ];

  const changePage = (skip: number) => {
    console.log({ skip });
    setInputVariables({
      listInputLocation: {
        ...inputVariables.listInputLocation,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };
  useEffect(() => {
    console.log({ data });
    if (data) {
      const hostelList = data?.Location_List?.list || [];
      console.log("inner", hostelList);
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Response not found",
        description: error.message,
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }, [data]);
  return (
    <div>
      <Breadcrumb pageName="Location" />

      {/* <p className="mt-[3px] text-body-sm font-medium">
                  ${itemData.price}
                </p> */}

      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
          <Button asChild>
            <Link href={"locations/create"}>Create</Link>
          </Button>
        </div>
        <DataTable columns={columns} data={data?.Location_List?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listInputLocation.skip || 0}
          totalCount={data?.Location_List?.totalCount || 0}
          limit={inputVariables?.listInputLocation.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
}

export default Location;
