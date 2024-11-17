"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Pageniation from "@/components/pagination/pagination";
import { DataTable } from "@/components/Datatables/data-table";
import { COMPLAINT_GQL } from "@/graphql/queries/main.quiries";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { Complaint, COMPLAINT_STATUS } from "./_lib/complaint.model";
import dayjs from "dayjs";
import ComplaintDetailsSheet from "./details";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

function Complaints() {
  const router = useRouter();
  const { toast } = useToast();
  const [inputVariables, setInputVariables] = useState<{
    dto: {
      limit: number;
      skip: number;
      sortOrder: number;
      statusArray: number[];
    };
  }>({
    dto: {
      limit: 10,
      skip: -1,
      sortOrder: -1,
      statusArray: [1],
    },
  });

  const { data, error, refetch } = useQuery(COMPLAINT_GQL, {
    variables: inputVariables,
  });

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => `${row.original.description.substring(0, 20)}...`,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => dayjs(row.getValue("createdAt")).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "user.name",
      header: "User Name",
      cell: ({ row }) => `${row.original?.user?.name ?? ""}` ?? "",
    },
    {
      accessorKey: "requestStatus",
      header: "Approval Status",
      cell: ({ row }) => (
        <Badge variant={"secondary"} >
        
          {COMPLAINT_STATUS[row.original?.requestStatus]
            .toUpperCase()
            .replaceAll("_", " ")}
        
        </Badge>
      ),
    },
    {
      accessorKey: "Action",
      header: "Actions",
      cell: ({ row }) => (
        <>
          <ComplaintDetailsSheet
            complaint={row.original}
          ></ComplaintDetailsSheet>
        </>
      ),
    },
  ];

  const changePage = (skip: number) => {
    setInputVariables({
      dto: {
        ...inputVariables.dto,
        skip: skip || -1,
      },
    });
    refetch(inputVariables);
  };

  useEffect(() => {
    console.log({ data });
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
      <Breadcrumb pageName="Complaints" />

      <div className="flex flex-col gap-10">
        <DataTable columns={columns} data={data?.Complaint_List?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.dto.skip || 0}
          totalCount={data?.Complaint_List?.totalCount || 0}
          limit={inputVariables?.dto.limit || 10}
        />
      </div>
    </div>
  );
}

export default Complaints;
