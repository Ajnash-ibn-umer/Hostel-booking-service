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
import { Complaint, COMPLAINT_STATUS } from "./_lib/complaint.model";
import { Download } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";

interface ComplaintDetailsSheetProps {
  complaint?: Complaint;
}

export default function ComplaintDetailsSheet({
  complaint,
}: ComplaintDetailsSheetProps) {
  const [open, setOpen] = useState(false);

  if (!complaint) {
    return null; // Or return a placeholder component
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>View</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Complaint Details</SheetTitle>
          <SheetDescription>{complaint.title}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">User Name</h4>
              <p className="text-sm text-gray-500">
                {complaint?.user?.name ?? "User Name not found"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Email</h4>
              <p className="text-sm text-gray-500">
                {complaint?.user?.email ?? "Email not found"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Property</h4>
              <p className="text-sm text-gray-500">
                {complaint?.property?.name ?? "Property not found"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Room</h4>
              <p className="text-sm text-gray-500">
                {complaint?.room?.name ?? "Room not found"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-gray-500">
              {complaint?.description ?? ""}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Request Status</h4>
              <p className="text-sm text-gray-500">
                {COMPLAINT_STATUS[complaint?.requestStatus]
                  .toUpperCase()
                  .replaceAll("_", " ")}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Created At</h4>
              <p className="text-sm text-gray-500">
                {dayjs(complaint.createdAt).format("DD/MM/YYYY")}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Last Updated At</h4>
              <p className="text-sm text-gray-500">
                {complaint.updatedAt
                  ? dayjs(complaint.updatedAt).format("DD/MM/YYYY")
                  : "Not updated yet"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Attachments</h4>
            <div>
              {complaint.galleries &&
                complaint.galleries.length > 0 &&
                complaint.galleries.map((gallery) => (
                  <>
                    <Button
                      key={gallery._id}
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
                        fetch(gallery.url)
                          .then((response) => response.blob())
                          .then((blob) => {
                            const downloadUrl =
                              window.URL.createObjectURL(blob);
                            const a: any = document.createElement("a");
                            a.style.display = "none";
                            a.href = downloadUrl;
                            a.download = gallery.name;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(downloadUrl);
                          })
                          .catch(() => alert("Failed to download file"));
                      }}
                    >
                      {gallery.name}
                      <Download size={"15px"}></Download>
                    </Button>
                  </>
                ))}
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
