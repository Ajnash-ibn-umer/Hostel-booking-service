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
import { LOCATION_CREATE_GQL } from "@/graphql/queries/main.mutations";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  locationLink: z.string().min(2, {
    message: "Location link must be at least 2 characters.",
  }),
  gps_location: z.any().optional(),
});

function CreateLocation() {
    const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      locationLink: "",
      gps_location: null,
    },
  });
  const [createLocation, { loading, error }] = useMutation(LOCATION_CREATE_GQL);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });

    try {
      const { data, errors } = await createLocation({
        variables: {
          createLocationInput: {
            name: values.name,
            locationLink: values.locationLink,
            gps_location: values.gps_location,
          },
        },
      });

      if (data && data.Location_Create) {
        router.push("/dashboard/locations");
      } else {
      
        toast({
            variant: "destructive",
            title: "Uh oh! Response not found",
            description: "Response not found from hostel creation",
            // action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
      }
    } catch (err: any) {
      console.error("Location Creation error:", err);
  
      toast({
        variant: "destructive",
        title: `Error Found`,
        description:err.toString(),
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default CreateLocation;
