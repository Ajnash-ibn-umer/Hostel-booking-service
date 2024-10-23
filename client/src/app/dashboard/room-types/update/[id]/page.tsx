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
import { ROOM_TYPE_UPDATE_GQL } from "@/graphql/queries/main.mutations";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ROOM_TYPE_LIST_GQL } from "@/graphql/queries/main.quiries";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  bedCount: z.string().min(1, {
    message: "Bed count must be at least 1.",
  }),
  rentDailyLower: z.string().min(0, {
    message: "Rent daily lower must be at least 0.",
  }),
  rentDailyUpper: z.string().min(0, {
    message: "Rent daily upper must be at least 0.",
  }),
  rentMonthlyLower: z.string().min(0, {
    message: "Rent monthly lower must be at least 0.",
  }),
  rentMonthlyUpper: z.string().min(0, {
    message: "Rent monthly upper must be at least 0.",
  }),
  securityDeposit: z.string().min(0, {
    message: "Security deposit must be at least 0.",
  }),
});

function UpdateRoomType({ params }: any) {
  const { toast } = useToast();
  const id = params.id;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      bedCount: "1",
      rentDailyLower: "0",
      rentDailyUpper: "0",
      rentMonthlyLower: "0",
      rentMonthlyUpper: "0",
      securityDeposit: "0",
    },
  });

  const { data: roomTypeData, loading: roomTypeLoading } = useQuery(
    ROOM_TYPE_LIST_GQL,
    {
      variables: {
        listInput: {
          statusArray: [1],
          roomTypeIds: [id],
          limit: 1,
          skip: 0,
          searchingText: null,
          sortOrder: 1,
        },
      },
      fetchPolicy: "no-cache",
    },
  );

  useEffect(() => {
    if (
      roomTypeData &&
      roomTypeData.RoomType_List &&
      roomTypeData.RoomType_List.list.length > 0
    ) {
      const {
        name,
        description,
        bedCount,
        rentDailyLower,
        rentDailyUpper,
        rentMonthlyLower,
        rentMonthlyUpper,
        securityDeposit,
      } = roomTypeData.RoomType_List.list[0];
      console.log({ name, description });
      form.reset({
        name,
        description,
        bedCount,
        rentDailyLower,
        rentDailyUpper,
        rentMonthlyLower,
        rentMonthlyUpper,
        securityDeposit,
      });
    }
  }, [roomTypeData, form, id]);

  const [updateRoomType, { loading }] = useMutation(ROOM_TYPE_UPDATE_GQL);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await updateRoomType({
        variables: {
          updateRoomTypeInput: {
            _id: id,
            name: values.name,
            description: values.description,
            bedCount: parseFloat(values.bedCount),
            rentDailyLower: parseFloat(values.rentDailyLower),
            rentDailyUpper: parseFloat(values.rentDailyUpper),
            rentMonthlyLower: parseFloat(values.rentMonthlyLower),
            rentMonthlyUpper: parseFloat(values.rentMonthlyUpper),
            securityDeposit: parseFloat(values.securityDeposit),
          },
        },
      });

      if (data && data.RoomType_Update) {
        toast({
          title: "Success",
          description: "Room type updated successfully",
        });
        router.push("/dashboard/room-types");
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update room type",
        });
      }
    } catch (err: any) {
      console.error("Room Type Update error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.toString(),
      });
    }
  }

  if (roomTypeLoading) return <div>Loading...</div>;

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
                          <Input placeholder="Room Type Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Room Type Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bedCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Beds</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of Beds"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rentDailyLower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Daily Rent For Lower Bed</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Daily Rent Lower"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rentDailyUpper"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Daily Rent For Upper Bed</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Daily Rent Upper"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rentMonthlyLower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Monthly Rent For Lower Bed</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Monthly Rent Lower"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rentMonthlyUpper"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Monthly Rent For Upper Bed</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Monthly Rent Upper"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="securityDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Security Deposit"
                            {...field}
                          />
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

export default UpdateRoomType;
