"use client";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HOSTEL_DETAILS } from "@/graphql/queries/main.quiries";
import { useQuery } from "@apollo/client";
import { BedAvailabilityStatus } from "../../booking/_lib/enums";

interface HostelDetailsProps {
  hostelId: string;
}

function HostelDetailsSheet({ hostelId }: HostelDetailsProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data } = useQuery(HOSTEL_DETAILS, {
    fetchPolicy: "cache-first",
    variables: {
      listInputHostel: {
        hostelIds: hostelId,
        statusArray: 1,
        limit: 1,
      },
    },
  });

  const hostelDetails = data?.Hostel_List?.list[0];

  // useEffect(() => {
  //   if (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Response not found",
  //       description: error.message,
  //     });
  //   }
  // }, [error, toast]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  if (!hostelDetails) {
    return <p>Hostel not found</p>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>View</Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col sm:max-w-[540px]">
        <div className="scrollable-sheet px-4">
          <SheetHeader>
            <SheetTitle>{hostelDetails?.name}</SheetTitle>
            <SheetDescription>{hostelDetails.description}</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            <Card className="p-2">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-start gap-6">
                    <span className="text-sm text-gray-500">Property No:</span>
                    <span className="text-sm font-semibold">
                      {hostelDetails.propertyNo}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-start gap-6">
                    <span className="text-sm text-gray-500">Total Beds:</span>
                    <span className="text-sm font-semibold">
                      {hostelDetails.totalBeds ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-start gap-6">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-semibold">
                      {hostelDetails.location?.name ?? ""}
                    </span>
                  </div>
                  {hostelDetails.category?.name && (
                    <div className="flex flex-row items-center justify-start gap-6">
                      <span className="text-sm text-gray-500">Category</span>
                      <span className="text-sm font-semibold">
                        {hostelDetails.category?.name ?? ""}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-row items-center justify-start gap-6">
                    <span className="text-sm text-gray-500">Total Rooms:</span>
                    <span className="text-sm font-semibold">
                      {hostelDetails.totalRooms}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <Carousel className="hover" opts={{ loop: true }}>
                <CarouselContent>
                  {hostelDetails?.galleries?.map(
                    (gallery: any, index: number) => (
                      <CarouselItem key={index} className="h-84 w-64">
                        <CardContent className="relative flex aspect-square items-center justify-center p-6">
                          {" "}
                          {/* Adjust height and width here */}
                          <Image
                            src={gallery?.url}
                            alt={`Gallery Image ${index + 1}`}
                            className="h-full w-full transform rounded-3xl object-cover transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg"
                            fill
                          />
                        </CardContent>
                      </CarouselItem>
                    ),
                  )}
                </CarouselContent>

                {hostelDetails?.galleries?.length > 0 && (
                  <>
                    <CarouselPrevious className="ml-6 h-12 w-12 rounded-full bg-gray-200 p-2 text-sm" />
                    <CarouselNext className="mr-7 h-12 w-12 rounded-full bg-gray-200 p-2 text-sm" />
                  </>
                )}
              </Carousel>
            </Card>

            <Card className="p-2">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-start justify-start gap-4">
                {hostelDetails?.amenities?.map(
                  (amenity: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-row items-center space-x-4"
                    >
                      <img
                        src={amenity.icon}
                        alt={amenity.name}
                        className="h-8 w-8 object-cover"
                      />
                      <span>{amenity.name}</span>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hostelDetails?.rooms?.map((room: any) => (
                  <Card key={room._id} className="p-2">
                    <CardHeader>
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                      {/* Room Image */}
                      <div className="flex-1">
                        <img
                          src={room.galleries[0]?.url}
                          alt={room.name}
                          className="h-30 w-30 rounded-lg object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <strong>Room ID:</strong> {room.slug}
                        </div>
                        <div>
                          <strong>Beds:</strong> {room.beds.length}
                        </div>
                        {room.beds.map((bed: any, index: number) => (
                          <Badge
                            style={{
                              background:
                                bed.availabilityStatus === 2
                                  ? "wheat"
                                  : bed.availabilityStatus === 0
                                    ? "green"
                                    : "black",
                            }}
                            key={index}
                            className="mr-2"
                          >
                            Bed ID: {bed.name} (
                            {BedAvailabilityStatus[bed.availabilityStatus]})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Close</Button>
          </SheetClose>
        </SheetFooter> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default HostelDetailsSheet;
