"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../../components/Datatables/data-table";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { HOSTEL_LIST_DASHBOARD } from "@/graphql/queries/main.quiries";
import { AlertConfirm } from "@/components/Alerts/alert";
import { Link } from "lucide-react";
import { HOSTEL_DELETE_GQL } from "@/graphql/queries/main.mutations";
import Pageniation from "@/components/pagination/pagination";

interface HostelListInterface {
  _id: string;
  name: string;
  propertyNo: string;
  sellingPrice: number;
  standardPrice: number;
  totalRooms: number;
}

const HostelList: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [hostelListData, setHostelListData] = useState<HostelListInterface[]>(
    [],
  );
  const [inputVariables, setInputVariables] = useState({
    listInputHostel: {
      statusArray: [1],
      limit: 10,
      skip: 0,
      searchingText: null,
      sortOrder: null,
      sortType: null,
      categoryIds: null,
      hostelIds: null,
      availblityStatusFilter: null,
      amenityIds: null,
      locationIds: null,
      priceBaseModeFilter: null,
      priceRangeFilter: null,
      propertyNumberFilter: null,
    },
  });

  const { loading, data, error, refetch } = useQuery(HOSTEL_LIST_DASHBOARD, {
    variables: inputVariables,
  });

  const hostelColumns: ColumnDef<HostelListInterface>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "propertyNo",
      header: "Property Number",
    },
    {
      accessorKey: "sellingPrice",
      header: "Selling Price",
    },
    {
      accessorKey: "standardPrice",
      header: "Standard Price",
    },
    {
      accessorKey: "totalRooms",
      header: "Total Rooms",
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
        const [deleteData, { loading, error }] = useMutation(HOSTEL_DELETE_GQL);

        const deleteHostel = async () => {
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
                title="Do you want to delete Hostel ?"
                onContinue={deleteHostel}
              >
                <Button variant={"destructive"}>Delete</Button>
              </AlertConfirm>
              <Link href={`locations/update/${row.original._id}`}>
                <Button variant={"link"}>Edit</Button>
              </Link>
              {/* <Link  href={`hostels/update/${row.original._id}`}>
                <Button variant={"link"}>Edit</Button>
              </Link> */}
            </div>
          </>
        );
      },
    },
  ];

  const changePage = (skip: number) => {
    console.log({ skip });
    setInputVariables({
      listInputHostel: {
        ...inputVariables.listInputHostel,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };

  useEffect(() => {
    if (data) {
      const hostelList = data.Hostel_List?.list || [];
      setHostelListData(hostelList);
    }
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
      <Breadcrumb pageName="Hostel" />
      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
          <Button onClick={() => router.push("hostels/create")}>Create</Button>
        </div>
        <DataTable columns={hostelColumns} data={hostelListData} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listInputHostel.skip || 0}
          totalCount={data?.Location_List?.totalCount || 0}
          limit={inputVariables?.listInputHostel.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
};

export default HostelList;
