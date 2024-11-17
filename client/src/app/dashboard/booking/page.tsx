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
import { Download, EyeIcon } from "lucide-react";
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
import {
  BED_POSITION,
  BedAvailabilityStatus,
  BookingStatus,
  PRICE_BASE_MODE,
} from "./_lib/enums";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import BookingDetailsSheet from "./details";
import { Badge } from "@/components/ui/badge";
import { Document, pdf, usePDF } from "@react-pdf/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export type Booking = {
  _id: string;
  arrivalTime: Date;
  basePrice: number;
  bedId: string;
  bedName: string;
  bookingNumber: string;
  bookingStatus: BookingStatus;
  canteenFacility: string;
  laudryFacility: string;
  email: string;
  name: string;
  phone: string;
  propertyId: string;
  regNo: string;
  roomId: string;
  securityDeposit: number;
  bedPosition: number;
  idProofDocUrls: string[];
  selectedPaymentBase: string;
  status: number;
  createdAt: Date;
  checkInDate: Date;
  checkOutDate: Date;
  address: string;
  bloodGroup: string;
  city: string;
  companyName: string;
  dob: Date;
  emergencyName: string;
  emergencyMobile: string;
  emergenyRelation: string;
  jobTitle: string;
  userRemark: string;
  property: {
    name: string;
    _id: string;
  };
};
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import MembershipPDF from "./pdf-form";
import dayjs from "dayjs";

function ApprovalOperationsCell({
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
  console.log("booking", booking.bookingNumber, booking.propertyId);
  const { data } = useQuery(ROOM_BED_LIST_GQL, {
    fetchPolicy: "network-only",
    variables: {
      listInputRoom: {
        limit: -1,
        // roomIds: [booking.roomId],
        hostelIds: [booking.propertyId],
        skip: -1,
        statusArray: [1],
        bedFilters: {
          availabilityStatus: [
            BedAvailabilityStatus.AVAILABLE,
            BedAvailabilityStatus.ENGAGED,
          ],
          // bedPositions: [booking.bedPosition],
          priceBaseModes: [booking.selectedPaymentBase, PRICE_BASE_MODE.BOTH],
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
          color: "green",
          title: data.Booking_ApprovalStatusChange.message,
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
      <DropdownMenuItem
        disabled={booking.bookingStatus >= BookingStatus.ADMIN_APPROVED}
        className="w-full"
        onClick={(e) => {
          e.preventDefault();
          setIsDialogOpen(true);
        }}
      >
        Approve
      </DropdownMenuItem>

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
                  {data?.Room_List?.list?.map((room: any) =>
                    room.beds?.map((bed: any) => (
                      <SelectItem key={bed._id} value={bed._id}>
                        {`${bed.name}-${BED_POSITION[bed.bedPosition].toLowerCase()} (${BedAvailabilityStatus[bed.availabilityStatus].toLowerCase().replace("_", " ")})`}
                      </SelectItem>
                    )),
                  )}
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
function CheckInOperationsCell({
  booking,
  refetch,
}: {
  booking: Booking;
  refetch: any;
}) {
  console.log("my bbok", booking);
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<string | null>(null);

  const [changeStatus] = useMutation(BOOKING_STATUS_CHANGE);

  const approveStatus = async () => {
    try {
      const { data, errors } = await changeStatus({
        variables: {
          dto: {
            bookingIds: booking._id,
            date: date,
            remark: "Bed selected",
            status: BookingStatus.CHECK_IN,
          },
        },
      });

      if (data) {
        toast({
          variant: "default",
          title: data.Booking_ApprovalStatusChange.message,
          // description: "Booking Status Changed successfully",
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
      <DropdownMenuItem
        disabled={booking.bookingStatus !== BookingStatus.ADMIN_APPROVED}
        className="w-full"
        onClick={(e) => {
          e.preventDefault();
          setIsDialogOpen(true);
        }}
      >
        Check In
      </DropdownMenuItem>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Check In Date</DialogTitle>
            <DialogDescription>
              Submit guest Check In date for Approval
            </DialogDescription>
          </DialogHeader>
          <Input
            onChange={(e) => setDate(e.target.value)}
            className="p-5"
            type="datetime-local"
          ></Input>
          <DialogFooter>
            <Button disabled={!date} onClick={approveStatus}>
              Confirm Check In
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
        const name = row?.original?.property?.name || "";
        return name;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Booking Date",
      cell: ({ row }) => dayjs(row.getValue("createdAt")).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "bookingStatus",
      header: "Booking Status",
      cell: ({ row }) => {
        const status = row.getValue("bookingStatus");
        switch (status) {
          case 1:
            <Badge variant={"secondary"}>Init</Badge>;
          case 2:
            return <Badge variant={"secondary"}>Form Submitted</Badge>;
          case 3:
            return <Badge variant={"secondary"}>Payment Failed</Badge>;
          case 4:
            return (
              <Badge style={{ background: "green", color: "white" }}>
                Booking Completed
              </Badge>
            );
          case 5:
            return (
              <Badge
                style={{ background: "#2cbf93", color: "white" }}
                variant={"secondary"}
              >
                Admin Approved
              </Badge>
            );
          case 6:
            return <Badge variant={"secondary"}>Check in</Badge>;
          default:
            return <Badge variant={"secondary"}>Unknown</Badge>;
        }
      },
    },
    {
      id: "operations",
      header: "Operations",

      cell: ({ row }) => (
        <div className="flex gap-1">
          <BookingDetailsSheet booking={row.original}></BookingDetailsSheet>

          {/* <Button
            onClick={async (e) => {
              const data = row.original;
              const blob = await pdf(
                MembershipPDF({
                  formData: {
                    address: data.address,
                    companyName: data.companyName,
                    contactNumber: data.phone,
                    date:
                      (data.createdAt &&
                        dayjs(data?.createdAt).format("DD/MM/YYYY")) ??
                      "",
                    dob:
                      (data.dob && dayjs(data?.dob).format("DD/MM/YYYY")) ?? "",
                    email: data.email,
                    emergencyContact: data.emergencyName,
                    emergencyContactNumber: data.emergencyMobile,
                    idCardNumber: data.bookingNumber,
                    jobTitle: data.jobTitle,
                    name: data.name,
                    relation: data.emergenyRelation,
                    roomPreference: data.bedName,
                    stayDuration: "",
                    bloodGroup: data.bloodGroup,
                    roomName: "",
                    healthIssue: data.userRemark,
                  },
                }),
              ).toBlob();

              console.log(blob);
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${row.original.bookingNumber}.pdf`;
              document.body.appendChild(link);
              link.click();

              link.remove();
              window.URL.revokeObjectURL(url);
            }}
            style={{ background: "transparent" }}
          >
            <Download color="green" size={"15px"}></Download>
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <ApprovalOperationsCell
                booking={row.original}
                refetch={refetch}
              />
              <CheckInOperationsCell booking={row.original} refetch={refetch} />

              <DropdownMenuItem
                onClick={async (e) => {
                  const data = row.original;
                  const blob = await pdf(
                    MembershipPDF({
                      formData: {
                        address: data.address,
                        companyName: data.companyName,
                        contactNumber: data.phone,
                        date:
                          (data.createdAt &&
                            dayjs(data?.createdAt).format("DD/MM/YYYY")) ??
                          "",
                        dob:
                          (data.dob && dayjs(data?.dob).format("DD/MM/YYYY")) ??
                          "",
                        email: data.email,
                        emergencyContact: data.emergencyName,
                        emergencyContactNumber: data.emergencyMobile,
                        idCardNumber: data.bookingNumber,
                        jobTitle: data.jobTitle,
                        name: data.name,
                        relation: data.emergenyRelation,
                        roomPreference: data.bedName,
                        stayDuration: "",
                        bloodGroup: data.bloodGroup,
                        roomName: "",
                        healthIssue: data.userRemark,
                      },
                    }),
                  ).toBlob();

                  console.log(blob);
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${row.original.bookingNumber}.pdf`;
                  document.body.appendChild(link);
                  link.click();

                  link.remove();
                  window.URL.revokeObjectURL(url);
                }}
              >
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const [inputVariables, setInputVariables] = useState<{
    dto: {
      statusArray: number[];
      limit: number;
      skip: number;
      bookingStatus: number[];
      searchingText: string | null;
      sortOrder: number;
      sortType?: number;
    };
  }>({
    dto: {
      statusArray: [1],
      bookingStatus: [3, 4, 5, 6],
      limit: 10,
      skip: 0,
      searchingText: null,
      sortOrder: -1,
    },
  });

  const { loading, data, error, refetch } = useQuery(BOOKING_LIST_MINIMAL_GQL, {
    fetchPolicy: "no-cache",
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
      toast({
        variant: "destructive",
        title: "Uh oh! Response not found",
        description: error.message,
      });
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
