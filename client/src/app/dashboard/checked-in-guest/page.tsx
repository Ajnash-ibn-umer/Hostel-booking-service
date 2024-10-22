"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import Pageniation from "@/components/pagination/pagination";
import { DataTable } from "@/components/Datatables/data-table";
import { CONTACT_LIST_FOR_TABLE_GQL, CHECK_IN_GUEST } from "@/graphql/queries/main.quiries";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { AlertConfirm } from "@/components/Alerts/alert";

export type CheckInUser = {
    _id: string;
    name: string;
    email: string;
    status: number;
    phoneNumber: string;
    userNo: string;
    isActive: boolean;
};

function CheckedInGuest() {
    const router = useRouter();
    const { toast } = useToast();
    const [inputVariables, setInputVariables] = useState<{
        listUserInput: {
            statusFilter: number[];
            bookingStatusFilter: number[];
            limit: number;
            skip: number;
            sortOrder: number;
        };
    }>({
        listUserInput: {
            statusFilter: [1],
            limit: 10,
            skip: 0,
            sortOrder: -1,
            bookingStatusFilter: [6]
        },
    });

    const { data, error, refetch } = useQuery(
        CHECK_IN_GUEST,
        {
            variables: inputVariables,
        },
    );


    const columns: ColumnDef<CheckInUser>[] = [
        {
            accessorKey: "userNo",
            header: "User Number",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone",
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => {
                return row.getValue("isActive") ? "Active" : "Inactive";
            },
        },
        // {
        //     accessorKey: "createdAt",
        //     header: "Check in Date",
        //     cell: ({ row }) =>
        //         new Date(row.getValue("createdAt")).toLocaleDateString(),
        // },
    ];

    const changePage = (skip: number) => {
        setInputVariables({
            listUserInput: {
                ...inputVariables.listUserInput,
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
    }, [error]);

    return (
        <div>
            <Breadcrumb pageName="Checked-In Guest" />

            <div className="flex flex-col gap-10">
                <DataTable columns={columns} data={data?.User_List?.list || []} />
                <Pageniation
                    fetch={changePage}
                    skip={inputVariables?.listUserInput.skip || 0}
                    totalCount={data?.User_List?.totalCount || 0}
                    limit={inputVariables?.listUserInput.limit || 10}
                />
            </div>
        </div>
    );
}

export default CheckedInGuest;
