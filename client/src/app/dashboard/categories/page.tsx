"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { PROPERTY_CATEGORY_LIST } from "@/graphql/queries/main.quiries";
import Link from "next/link";
import Pageniation from "../../../components/pagination/pagination";
import { DataTable } from "../../../components/Datatables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AlertConfirm } from "@/components/Alerts/alert";
import { useToast } from "@/hooks/use-toast";
import { CATEGORY_DELETE_GQL } from "@/graphql/queries/main.mutations";

export type Category = {
  _id: string;
  name: number;
  description: string;
  createdDate: Date;
};

function Category() {
  const router = useRouter();
  const { toast } = useToast();

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "slug",
      header: "UID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
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
        const [deleteData, { loading, error }] =
          useMutation(CATEGORY_DELETE_GQL);

        const deleteCategory = async () => {
          try {
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
                title: `Delete successful`,
                description: `Category deleted successfully`,
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
                title="Do you want to delete this category?"
                onContinue={deleteCategory}
              >
                <Button variant={"destructive"}>Delete</Button>
              </AlertConfirm>
              <Link href={`categories/update/${row.original._id}`}>
                <Button variant={"link"}>Edit</Button>
              </Link>
            </div>
          </>
        );
      },
    },
  ];

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

  const { loading, data, error, refetch } = useQuery(PROPERTY_CATEGORY_LIST, {
    variables: inputVariables,
  });
  const changePage = (skip: number) => {
    console.log({ skip });
    setInputVariables({
      listInput: {
        ...inputVariables.listInput,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };
  useEffect(() => {
    console.log({ data });
    if (data) {
      const hostelList = data?.PropertyCategory_List?.list || [];
      console.log("inner", hostelList);
    }
    if (error) {
      alert(error.message);
    }
  }, [data]);
  return (
    <div>
      <Breadcrumb pageName="Category" />

      {/* <p className="mt-[3px] text-body-sm font-medium">
                  ${itemData.price}
                </p> */}

      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
          <Button asChild>
            <Link href={"categories/create"}>Create</Link>
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={data?.PropertyCategory_List?.list || []}
        />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listInput.skip || 0}
          totalCount={data?.PropertyCategory_List?.totalCount || 0}
          limit={inputVariables?.listInput.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
}

export default Category;
