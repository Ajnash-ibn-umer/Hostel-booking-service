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
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Download } from "lucide-react";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { CHECK_IN_GUEST } from "@/graphql/queries/main.quiries";

export default function GuestDetailsSheet({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
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
      bookingStatusFilter: [6],
    },
  });

  const { data, error, refetch } = useQuery(CHECK_IN_GUEST, {
    variables: inputVariables,
  });
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>View</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-[540px]">
        <div className="scrollable-sheet px-4">
          <SheetHeader>
            <SheetTitle>Guest Details</SheetTitle>
            <SheetDescription>User number:</SheetDescription>
          </SheetHeader>
          <div className="space-y-4  py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Guest Name</h4>
                <p className="text-sm text-gray-500"></p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm text-gray-500"></p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Phone</h4>
                <p className="text-sm text-gray-500"></p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Registration Number</h4>
                <p className="text-sm text-gray-500"></p>
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
