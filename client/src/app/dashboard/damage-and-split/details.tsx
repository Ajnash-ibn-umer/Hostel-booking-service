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
import dayjs from "dayjs";
import { DamageAndSplit } from "./_lib/damageAndSplit";

interface DamageAndSplitDetailsSheetProps {
  damageAndSplit?: DamageAndSplit;
}

export default function DamageAndSplitDetailsSheet({
  damageAndSplit,
}: DamageAndSplitDetailsSheetProps) {
  const [open, setOpen] = useState(false);

  if (!damageAndSplit) {
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
            <SheetTitle>Damage and Split Details</SheetTitle>
            <SheetDescription>Title: {damageAndSplit.title}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Total Amount</h4>
                <p className="text-sm text-gray-500">
                  {damageAndSplit.totalAmount}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Received Amount</h4>
                <p className="text-sm text-gray-500">
                  {damageAndSplit.receivedAmount}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Due Date</h4>
                <p className="text-sm text-gray-500">
                  {dayjs(damageAndSplit.dueDate).format("DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Payment Status</h4>
                <p className="text-sm text-gray-500">
                  {damageAndSplit.amountStatus === 0
                    ? "Pending"
                    : damageAndSplit.amountStatus === 1
                      ? "Partially Received"
                      : damageAndSplit.amountStatus === 3
                        ? "Fully Received"
                        : "Unknown"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Hostel</h4>
                <p className="text-sm text-gray-500">
                  {damageAndSplit.hostel.name}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Split Details</h4>
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                      Username
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                      User No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                      Bed No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                      Split Amount
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {damageAndSplit.splitDetails.map((detail) => (
                    <tr key={detail._id}>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500">
                        {detail.user?.name ?? ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500">
                        {detail.user?.userNo ?? ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500">
                        {detail.user?.booking.bedName ?? ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500">
                        {detail.amount}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500">
                        {detail.payed ? "Paid" : "Not paid"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
