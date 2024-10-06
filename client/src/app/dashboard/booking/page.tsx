"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  BOOKING_LIST_MINIMAL_GQL,
  ROOM_BED_LIST_GQL,
} from "@/graphql/queries/main.quiries"; // Assuming a similar query exists for bookings
import Link from "next/link";
import Pageniation from "../../../components/pagination/pagination";
import { DataTable } from "../../../components/Datatables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AlertConfirm } from "@/components/Alerts/alert";
import { useToast } from "@/hooks/use-toast";
import { EyeIcon } from "lucide-react";
import { BOOKING_STATUS_CHANGE } from "@/graphql/queries/main.mutations";
import DialogComp from "@/components/dialog/Dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Form } from "react-hook-form";
import { BedAvailabilityStatus, BookingStatus } from "./_lib/enums";
import { EyeOpenIcon } from "@radix-ui/react-icons";

export type Booking = {
  _id: string;
  arrivalTime: Date;
  basePrice: number;
  bedId: string;
  bedName: string;
  bookingNumber: string;
  bookingStatus: BookingStatus;
  canteenFacility: string;
  email: string;
  name: string;
  phone: string;
  propertyId: string;
  regNo: string;
  roomId: string;
  securityDeposit: number;
  bedPosition: number;
  selectedPaymentBase: string;
  status: number;
  checkInDate: Date;
  checkOutDate: Date;
  property: {
    name: string;
    _id: string;
  };
};

function OperationsCell({
  booking,
  refetch,
}: {
  booking: Booking;
  refetch: any;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<string>("");

  const [changeStatus] = useMutation(BOOKING_STATUS_CHANGE);

  const { data } = useQuery(ROOM_BED_LIST_GQL, {
    variables: {
      listInputRoom: {
        limit: -1,
        roomIds: [booking.roomId],
        skip: -1,
        statusArray: [1],
        bedFilters: {
          availabilityStatus: [
            BedAvailabilityStatus.AVAILABLE,
            BedAvailabilityStatus.ENGAGED,
          ],
          bedPositions: [booking.bedPosition],
          priceBaseModes: [booking.selectedPaymentBase],
        },
      },
    },
  });

  const approveStatus = async () => {
    try {
      if (!selectedBed) {
        toast({
          variant: "destructive",
          title: "Bed is required",
          description: "You must select a bed",
        });
        return;
      }

      const { data, errors } = await changeStatus({
        variables: {
          dto: {
            bookingIds: booking._id,
            date: null,
            remark: "Bed selected",
            selectedBedId: selectedBed,
            status: BookingStatus.ADMIN_APPROVED,
          },
        },
      });

      if (data) {
        toast({
          variant: "default",
          title: "Status changed successfully",
          description: "Booking Status Changed successfully",
        });
        setIsDialogOpen(false);
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

  return (
    <div className="flex gap-2">
      <Button onClick={() => setIsDialogOpen(true)} variant="secondary">
        Approve
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Bed for Approval</DialogTitle>
            <DialogDescription>
              Choose a bed for the booking and click confirm to approve.
            </DialogDescription>
          </DialogHeader>
          {data?.Room_List?.list[0]?.beds &&
          data?.Room_List?.list[0]?.beds.length > 0 ? (
            <div className="grid gap-4 py-4">
              <Select onValueChange={setSelectedBed} value={selectedBed}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a bed" />
                </SelectTrigger>
                <SelectContent>
                  {data?.Room_List?.list[0]?.beds?.map((bed: any) => (
                    <SelectItem key={bed._id} value={bed._id}>
                      {`${bed.name}-${bed.bedPosition} (${BedAvailabilityStatus[bed.availabilityStatus].toLowerCase().replace("_", " ")})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <span>
                Bed Not available for this room with selected requirements
              </span>
            </>
          )}
          <DialogFooter>
            <Button onClick={approveStatus} disabled={!selectedBed}>
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div></div>
    </div>
  );
}

function Booking() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedBed, setSelectedBed] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "bookingNumber",
      header: "BookingNo",
    },
    {
      accessorKey: "name",
      header: "Customer Name",
    },
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ row }) => {
        const name = row.original.property["name"];
        return name;
      },
    },
    {
      accessorKey: "arrivalTime",
      header: "Check-In Date",
      cell: ({ row }) =>
        new Date(row.getValue("arrivalTime")).toLocaleDateString(),
    },
    {
      accessorKey: "bookingStatus",
      header: "Booking Status",
      cell: ({ row }) => {
        const status = row.getValue("bookingStatus");
        switch (status) {
          case 1:
            return "Init";
          case 2:
            return "Form Submitted";
          case 3:
            return "Payment Failed";
          case 4:
            return "Payment Sucess";
          case 5:
            return "Admin Approved";
          case 6:
            return "Chek in";
          default:
            return "Unknown";
        }
      },
    },
    {
      id: "operations",
      header: "Operations",

      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.bookingStatus < BookingStatus.ADMIN_APPROVED && (
            <OperationsCell booking={row.original} refetch={refetch} />
          )}
          <Button>
            <EyeOpenIcon />
          </Button>
        </div>
      ),
    },
  ];

  const [inputVariables, setInputVariables] = useState<{
    dto: {
      statusArray: number[];
      limit: number;
      skip: number;
      searchingText: string | null;
      sortOrder: number;
      sortType?: number;
    };
  }>({
    dto: {
      statusArray: [1],
      limit: 10,
      skip: 0,
      searchingText: null,
      sortOrder: -1,
    },
  });

  const { loading, data, error, refetch } = useQuery(BOOKING_LIST_MINIMAL_GQL, {
    variables: inputVariables,
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
    if (error) {
      alert(error.message);
    }
  }, [error]);

  return (
    <div>
      <Breadcrumb pageName="Booking" />

      <div className="flex flex-col gap-10">
        <DataTable columns={columns} data={data?.Booking_List?.list || []} />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.dto.skip || 0}
          totalCount={data?.Booking_List?.totalCount || 0}
          limit={inputVariables?.dto.limit || 10}
        />
      </div>
    </div>
  );
}

export default Booking;
