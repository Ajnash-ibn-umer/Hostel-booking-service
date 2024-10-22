"use client";

import { HOSTEL_DETAILS } from "@/graphql/queries/main.quiries";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

const HostelDetails: React.FC = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { loading, data, error } = useQuery(HOSTEL_DETAILS, {
    variables: {
      listInputHostel: {
        hostelIds: id,
        statusArray: 1,
        limit: 1,
      },
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Response not found",
        description: error.message,
      });
    }
  }, [data, error, toast]);

  if (loading) {
    return (
      <div className="container mx-auto mt-8">
        <h3>loading</h3>
      </div>
    );
  }

  const hostel = data?.Hostel_List?.list[0];

  if (!hostel) {
    return (
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold">Hostel not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 space-y-8">
      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{hostel.name}</CardTitle>
          <CardDescription>{hostel.description}</CardDescription>
        </CardHeader>
      </Card>
      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Property No:</span>
              <span className="text-lg font-semibold">{hostel.propertyNo}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Selling Price:</span>
              <span className="text-lg font-semibold">
                {hostel.sellingPrice}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Standard Price:</span>
              <span className="text-lg font-semibold">
                {hostel.standardPrice}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Rooms:</span>
              <span className="text-lg font-semibold">{hostel.totalRooms}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Gallery</CardTitle>
        </CardHeader>
        <div className="w-full">
          <Carousel className="hover" opts={{ loop: true }}>
            <CarouselContent>
              {hostel.galleries.map((gallery: any, index: number) => (
                <CarouselItem
                  key={`${index}`}
                  className={`${
                    index === 0
                      ? "md:basis-1/3 lg:basis-1/3"
                      : "w-5 md:basis-1/3 lg:basis-1/3"
                  } basis-full p-5`}
                >
                  <CardContent className="relative flex aspect-square items-center justify-center p-6">
                    <Image
                      src={gallery?.url}
                      alt={`Gallery Image ${index + 1}`}
                      className="transform rounded-3xl object-cover transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg"
                      fill
                    />
                  </CardContent>
                </CarouselItem>
              ))}
            </CarouselContent>
            {hostel.galleries?.length > 0 && (
              <>
                <CarouselPrevious className="ml-6 h-12 w-12 rounded-full bg-gray-200 p-2 text-sm" />
                <CarouselNext className="mr-7 h-12 w-12 rounded-full bg-gray-200 p-2 text-sm" />
              </>
            )}
          </Carousel>
        </div>
      </Card>
      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Amenities</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
          {hostel.amenities.map((amenity: any, index: number) => (
            <div key={index} className="flex items-center space-x-4">
              <img
                src={amenity.icon}
                alt={amenity.name}
                className="h-8 w-8 object-cover"
              />
              <span>{amenity.name}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hostel.rooms.map((room: any) => (
            <Card key={room._id} className="p-2">
              <CardHeader>
                <CardTitle className="text-lg">{room.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
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
                    <strong>Room ID:</strong> {room._id}
                  </div>
                  <div>
                    <strong>Beds:</strong> {room.beds.length}
                  </div>
                  {room.beds.map((bed: any, index: number) => (
                    <Badge key={index} className="mr-2">
                      Bed ID: {bed._id}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HostelDetails;
