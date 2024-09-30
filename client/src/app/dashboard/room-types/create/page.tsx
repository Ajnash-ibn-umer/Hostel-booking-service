"use client";

import React from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { ROOM_TYPE_CREATE_GQL } from "@/graphql/queries/main.mutations"; // Adjust the import based on your actual mutation
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

function CreateRoomType() {
  const { toast } = useToast();
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
  const [createRoomType, { loading, error }] =
    useMutation(ROOM_TYPE_CREATE_GQL);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });

    try {
      const { data, errors } = await createRoomType({
        variables: {
          createRoomTypeInput: {
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

      if (data && data.RoomType_Create) {
        router.push("/dashboard/room-types");
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Response not found",
          description: "Response not found from room type creation",
        });
      }
    } catch (err: any) {
      console.error("Room Type Creation error:", err);
      toast({
        variant: "destructive",
        title: `Error Found`,
        description: err.toString(),
      });
    }
  }

  return (
    <>
      <div className="relative flex-wrap gap-5">
        <Card className="flex p-10 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative flex w-full flex-col space-y-8 "
            >
              <div className="flex w-full flex-col gap-5 space-y-3">
                <div className="flex w-full flex-wrap  gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                      <FormItem className="flex-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Room Type Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full flex-wrap justify-between gap-5">
                  <FormField
                    control={form.control}
                    name="bedCount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                      <FormItem className="flex-1">
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
                </div>
                <div className="flex w-full flex-wrap justify-between gap-5">
                  <FormField
                    control={form.control}
                    name="rentDailyUpper"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                      <FormItem className="flex-1">
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
                </div>
                <div className="flex w-full flex-wrap justify-between gap-5">
                  <FormField
                    control={form.control}
                    name="rentMonthlyUpper"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                      <FormItem className="flex-1">
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default CreateRoomType;
