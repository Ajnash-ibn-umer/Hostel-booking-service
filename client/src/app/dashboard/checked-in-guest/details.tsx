import { useEffect, useState } from "react";
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
import {
  CHECK_IN_GUEST,
  CHECK_IN_GUEST_DETAILS,
} from "@/graphql/queries/main.quiries";
import { CheckInGuestUserList } from "./_lib/check-in-guest";

export default function GuestDetailsSheet({
  userData,
}: {
  userData: CheckInGuestUserList;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>View</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-[540px]">
        <div className="scrollable-sheet px-4">
          <SheetHeader>
            <SheetTitle>Guest Details</SheetTitle>
            <SheetDescription>User number: {userData?.userNo}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4  py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Guest Name</h4>
                <p className="text-sm text-gray-500">{userData?.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm text-gray-500">{userData?.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Phone</h4>
                <p className="text-sm text-gray-500">{userData?.phoneNumber}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Registration Number</h4>
                <p className="text-sm text-gray-500">
                  {userData?.booking?.bookingNumber ?? ""}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Monthly Laundry Limit</h4>
                <p className="text-sm text-gray-500">
                  {userData?.contract?.laundryMonthlyCount ?? ""}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Canteen facility</h4>
                <p className="text-sm text-gray-500">
                  {userData?.booking.canteenFacility
                    ? "Allowed"
                    : "Not Allowed"}
                </p>
              </div>
            </div>
            <SheetTitle>Personal Info</SheetTitle>
            <div>
              <div>
                <h4 className="text-sm font-medium">Guest Information</h4>
                <p className="text-sm text-gray-500">
                  Date of Birth:{" "}
                  {userData.booking.dob !== null
                    ? dayjs(userData.booking.dob).format("DD/MM/YYYY")
                    : "Not found"}
                </p>
                <p className="text-sm text-gray-500">
                  Address: {userData.booking.address}
                </p>
                <p className="text-sm text-gray-500">
                  City: {userData.booking.city}
                </p>
                <p className="text-sm text-gray-500">
                  Company Name: {userData.booking.companyName}
                </p>
                <p className="text-sm text-gray-500">
                  Job Title: {userData.booking.jobTitle}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Emergency Contact</h4>
                <p className="text-sm text-gray-500">
                  Name: {userData.booking.emergencyName}
                </p>
                <p className="text-sm text-gray-500">
                  Contact No: {userData.booking.emergencyMobile}
                </p>
                <p className="text-sm text-gray-500">
                  Relation: {userData.booking.emergenyRelation}
                </p>
                <p className="text-sm text-gray-500">
                  Blood Group: {userData.booking.bloodGroup}
                </p>
              </div>
              {userData.booking.userRemark &&
                userData.booking.userRemark !== "" && (
                  <div>
                    <h4 className="text-sm font-medium">Health Issues</h4>
                    <p className="text-sm text-gray-500">
                      {userData.booking.userRemark}
                    </p>
                  </div>
                )}

              <h4 className="text-sm font-medium">ID documents</h4>
              <div className="flex flex-col gap-2">
                {userData.booking.idProofDocUrls &&
                  userData.booking.idProofDocUrls.length > 0 &&
                  userData.booking.idProofDocUrls.map((url) => (
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
