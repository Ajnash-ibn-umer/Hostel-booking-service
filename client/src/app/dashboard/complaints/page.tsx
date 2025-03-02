"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { COMPLAINT_APPROVAL_STATUS_CHANGE } from "@/graphql/queries/main.mutations";

function Complaints() {
  const router = useRouter();
  const { toast } = useToast();
  const [changeStatus] = useMutation(COMPLAINT_APPROVAL_STATUS_CHANGE);

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
  
  const approvalStatusChange = async (
    complaintId: string,
    status: number,
    remarks: string,
  ) => {
    try {
      console.log(complaintId, { status });
      const { data, errors } = await changeStatus({
        variables: {
          updateApprovalStatusInput: {
            complaintId: complaintId,
            remark: remarks ?? "",
            requestStatus: status,
          },
        },
      });

      if (data) {
        toast({
          variant: "default",
          title: "Successfully Status changed for",
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
      cell: ({ row }) => row.original?.user?.name ?? "",
    },
    {
      accessorKey: "requestStatus",
      header: "Approval Status",
      cell: ({ row }) => {
        const status = row.getValue("requestStatus");
        switch (status) {
          case COMPLAINT_STATUS.PENDING:
            return (
              <Badge style={{ background: "#2cbf93", color: "white" }}>
                {COMPLAINT_STATUS[row.original?.requestStatus]
                  .toUpperCase()
                  .replaceAll("_", " ")}
              </Badge>
            );
          case COMPLAINT_STATUS.REJECTED:
            return (
              <Badge variant={"destructive"}>
                {COMPLAINT_STATUS[row.original?.requestStatus]
                  .toUpperCase()
                  .replaceAll("_", " ")}
              </Badge>
            );
          case COMPLAINT_STATUS.ACTION_TAKEN:
            return (
              <Badge style={{ background: "green", color: "white" }}>
                {COMPLAINT_STATUS[row.original?.requestStatus]
                  .toUpperCase()
                  .replaceAll("_", " ")}
              </Badge>
            );
          default:
            return (
              <Badge variant={"default"}>
                {COMPLAINT_STATUS[row.original?.requestStatus]
                  .toUpperCase()
                  .replaceAll("_", " ")}
              </Badge>
            );
        }
      },
    },
    {
      accessorKey: "Action",
      header: "Actions",
      enableHiding: false,

      cell: ({ row }) => (
        <>
          <div className="flex gap-2">
            <ComplaintDetailsSheet
              complaint={row.original}
            ></ComplaintDetailsSheet>

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
                      COMPLAINT_STATUS.REJECTED,
                      "",
                    )
                  }
                >
                  Reject this Complaint
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    approvalStatusChange(
                      row.original._id,
                      COMPLAINT_STATUS.ACTION_TAKEN,
                      "",
                    )
                  }
                >
                  Approve as action taked this Complaint
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
