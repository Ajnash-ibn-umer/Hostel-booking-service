import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { BED_POSITION, BookingStatus, PRICE_BASE_MODE } from "./_lib/enums";
import { Booking } from "./page";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Download } from "lucide-react";
import dayjs from "dayjs";

interface BookingDetailsSheetProps {
  booking?: Booking;
}

export default function BookingDetailsSheet({
  booking,
}: BookingDetailsSheetProps) {
  const [open, setOpen] = useState(false);

  if (!booking) {
    return null; // Or return a placeholder component
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>View</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-[540px]">
        <div className="scrollable-sheet px-4">
          <SheetHeader>
            <SheetTitle>Booking Details</SheetTitle>
            <SheetDescription>
              Booking number: {booking.bookingNumber}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4  py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Guest Name</h4>
                <p className="text-sm text-gray-500">{booking.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm text-gray-500">{booking.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Phone</h4>
                <p className="text-sm text-gray-500">{booking.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Registration Number</h4>
                <p className="text-sm text-gray-500">{booking.bookingNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Property Details</h4>
              <p className="text-sm text-gray-500">
                {booking?.property?.name || ""}
              </p>
              <p className="text-sm text-gray-500">
                Room: {booking.bedName} (Position:{" "}
                {BED_POSITION[booking.bedPosition].toLowerCase()})
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Check-in Date</h4>
                <p className="text-sm text-gray-500">
                  {booking.checkInDate
                    ? dayjs(booking.checkInDate).format("DD/MM/YYYY")
                    : "Not Check-in Yet"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Booking Date</h4>
                <p className="text-sm text-gray-500">
                  {dayjs(booking.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Payment Base</h4>
                <p className="text-sm text-gray-500">
                  {PRICE_BASE_MODE[
                    booking.selectedPaymentBase as any
                  ].toLowerCase()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Booking Status</h4>
                <p className="text-sm text-gray-500">
                  {BookingStatus[booking.bookingStatus]
                    .toLowerCase()
                    .replaceAll("_", " ")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Base Price</h4>
              <p className="text-sm text-gray-500">
                RS {booking.basePrice.toFixed(2)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Security Deposit</h4>
              <p className="text-sm text-gray-500">
                RS {booking.securityDeposit.toFixed(2)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Total Amount</h4>
              <p className="text-sm text-gray-500">RS {booking.netAmount ?? 0}</p>
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Laundry Facility</h4>
                <p className="text-sm text-gray-500">
                  {booking.laudryFacility ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Canteen Facility</h4>
                <p className="text-sm text-gray-500">
                  {booking.canteenFacility ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <div>
                  <h4 className="text-sm font-medium">Guest Information</h4>
                  <p className="text-sm text-gray-500">
                    Date of Birth:{" "}
                    {booking.dob !== null
                      ? dayjs(booking.dob).format("DD/MM/YYYY")
                      : "Not found"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Address: {booking.address}
                  </p>
                  <p className="text-sm text-gray-500">City: {booking.city}</p>
                  <p className="text-sm text-gray-500">
                    Company Name: {booking.companyName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Job Title: {booking.jobTitle}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Emergency Contact</h4>
                  <p className="text-sm text-gray-500">
                    Name: {booking.emergencyName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Contact No: {booking.emergencyMobile}
                  </p>
                  <p className="text-sm text-gray-500">
                    Relation: {booking.emergenyRelation}
                  </p>
                  <p className="text-sm text-gray-500">
                    Blood Group: {booking.bloodGroup}
                  </p>
                </div>
                {booking.userRemark && booking.userRemark !== "" && (
                  <div>
                    <h4 className="text-sm font-medium">Health Issues</h4>
                    <p className="text-sm text-gray-500">
                      {booking.userRemark}
                    </p>
                  </div>
                )}

                <h4 className="text-sm font-medium">ID documents</h4>
                <div className="flex flex-col gap-2">
                  {booking.idProofDocUrls &&
                    booking.idProofDocUrls.length > 0 &&
                    booking.idProofDocUrls.map((url) => (
                      <Button
                        style={{
                          backgroundColor: "#f0f0f0",
                          color: "#333",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        onClick={() => {
                          fetch(url)
                            .then((response) => response.blob())
                            .then((blob) => {
                              const downloadUrl =
                                window.URL.createObjectURL(blob);
                              const a: any = document.createElement("a");
                              a.style.display = "none";
                              a.href = downloadUrl;
                              a.download = url.split("/").pop();
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(downloadUrl);
                            })
                            .catch(() => alert("Failed to download file"));
                        }}
                      >
                        {url.split("/").pop()}
                        <Download size={"15px"}></Download>
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Close</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
