"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import Pageniation from "@/components/pagination/pagination";
import { DataTable } from "@/components/Datatables/data-table";
import { AMENITY_LIST_GQL } from "@/graphql/queries/main.quiries";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { AMENITY_DELETE_GQL } from "@/graphql/queries/main.mutations";
import { AlertConfirm } from "@/components/Alerts/alert";
import Image from "next/image";
import { Image as imageDummy } from "lucide-react";

export type Amenity = {
  _id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  createdAt: Date;
  createdUserId: string;
};

function Amenities() {
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

  const { loading, data, error, refetch } = useQuery(AMENITY_LIST_GQL, {
    variables: inputVariables,
  });

  const columns: ColumnDef<Amenity>[] = [
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => {
        return (
          <>
            <Image
              width={30}
              height={30}
              src={row.original.icon || ""}
              alt={"icon"}
              onError={() => imageDummy}
            />
          </>
        );
      },
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
      accessorKey: "slug",
      header: "Slug",
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
          useMutation(AMENITY_DELETE_GQL);

        const deleteAmenity = async () => {
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
                description: `Amenity deleted successfully`,
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
                title="Do you want to delete this amenity?"
                onContinue={deleteAmenity}
              >
                <Button variant={"destructive"}>Delete</Button>
              </AlertConfirm>
              <Link href={`amenities/update/${row.original._id}`}>
                <Button variant={"link"}>Edit</Button>
              </Link>
            </div>
          </>
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
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Response not found",
        description: error.message,
      });
    }
  }, [data, error, toast]);

  return (
    <div>
      <Breadcrumb pageName="Amenities" />

      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
          <Button asChild>
            <Link href={"amenities/create"}>Create</Link>
          </Button>
        </div>
        <DataTable columns={columns} data={data?.Amenity_List?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listInput.skip || 0}
          totalCount={data?.Amenity_List?.totalCount || 0}
          limit={inputVariables?.listInput.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
}

export default Amenities;
