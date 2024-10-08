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
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Booking Details</SheetTitle>
          <SheetDescription>
            Booking number: {booking.bookingNumber}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
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
              <p className="text-sm text-gray-500">{booking.regNo}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Property Details</h4>
            <p className="text-sm text-gray-500">{booking.property.name}</p>
            <p className="text-sm text-gray-500">
              Room: {booking.bedName} (Position:{" "}
              {BED_POSITION[booking.bedPosition].toLowerCase()})
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Check-in Date</h4>
              <p className="text-sm text-gray-500">
                {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Check-out Date</h4>
              <p className="text-sm text-gray-500">
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Arrival Time</h4>
              <p className="text-sm text-gray-500">
                {new Date(booking.arrivalTime).toLocaleDateString()}
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
                RS{booking.basePrice.toFixed(2)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Security Deposit</h4>
              <p className="text-sm text-gray-500">
                RS{booking.securityDeposit.toFixed(2)}
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
              <h4 className="text-sm font-medium">Canteen Facility</h4>
              <p className="text-sm text-gray-500">
                {booking.canteenFacility ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
