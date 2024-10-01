"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import {
  LOCATION_LIST_GQL,
  LOCATION_LIST_MINIMAL_GQL,
} from "@/graphql/queries/main.quiries";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LOCATION_UPDATE_GQL } from "@/graphql/queries/main.mutations";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  locationLink: z.string().min(2, {
    message: "Location link must be at least 2 characters.",
  }),
  gps_location: z.any().optional(),
});

function UpdateLocation({ params }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const locationId = params.id;
  console.log({ locationId });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      locationLink: "",
      gps_location: null,
    },
  });
  const [updateLocation, { loading, error }] = useMutation(LOCATION_UPDATE_GQL);

  const {
    data: locationData,
    loading: locationLoading,
    error: locationFetchError,
  } = useQuery(LOCATION_LIST_MINIMAL_GQL, {
    variables: {
      listInputLocation: {
        statusArray: [1],
        limit: 1,
        skip: 0,
        searchingText: null,
        sortOrder: 1,
        locationIds: [locationId],
      },
    },
  });

  useEffect(() => {
    if (locationData && locationData.Location_List) {
      if (
        !locationData.Location_List ||
        locationData.Location_List.list.length === 0 || locationFetchError
      ) {
        alert("Location Not found");
      }
      const { name, locationLink, gps_location } =
        locationData.Location_List.list[0];
      form.reset({ name, locationLink, gps_location });
    }
  }, [locationData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, errors } = await updateLocation({
        variables: {
          updateLocationInput: {
            _id: locationId,
            name: values.name,
            locationLink: values.locationLink,
            gps_location: values.gps_location,
          },
        },
      });

      if (data && data.Location_Update) {
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
        router.push("/dashboard/locations");
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update location",
        });
      }
    } catch (err: any) {
      console.error("Location Update error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.toString(),
      });
    }
  }

  if (locationLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="relative flex-wrap gap-10">
        <Card className="flex p-10 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative flex w-full flex-col space-y-8 "
            >
              <div className="flex w-full flex-col gap-5 space-y-8">
                <div className="w-full flex-col flex-wrap justify-around gap-10 space-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Location Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="locationLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Link</FormLabel>
                        <FormControl>
                          <Input placeholder="Location Link" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gps_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input disabled placeholder="Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default UpdateLocation;
