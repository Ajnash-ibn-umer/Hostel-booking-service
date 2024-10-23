"use client";

import React, { useEffect, useState } from "react";
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
import { AMENITY_LIST_GQL } from "@/graphql/queries/main.quiries";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AMENITY_UPDATE_GQL } from "@/graphql/queries/main.mutations";
import { URL } from "url";
import { s3Upload } from "@/config/aws";

async function fetchIcon(icon: string) {
  let response = await fetch(icon);
  let data = await response.blob();

  let fileName = String(icon).split("/").pop(); // Get the file name from the icon URL
  let metadata = {
    type: "image/jpeg",
  };

  console.log({ fileName });

  let file = new File([data], fileName as string, metadata);
  return file;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  icon: z.any().optional(),
});

function UpdateAmenity({ params }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const amenityId = params.id;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: null,
    },
  });
  const [updateAmenity, { loading, error }] = useMutation(AMENITY_UPDATE_GQL);
  const [file, setFile] = useState<File | null>(null);

  const {
    data: amenityData,
    loading: amenityLoading,
    error: amenityFetchError,
  } = useQuery(AMENITY_LIST_GQL, {
    variables: {
      listInput: {
        statusArray: [1],
        limit: 1,
        skip: 0,
        searchingText: null,
        sortOrder: 1,
        amenityIds: [amenityId],
      },
    },
  });

  useEffect(() => {
    if (amenityData && amenityData.Amenity_List) {
      if (
        !amenityData.Amenity_List ||
        amenityData.Amenity_List.list.length === 0 ||
        amenityFetchError
      ) {
        alert("Amenity Not found");
      }
      const { name, description, icon } = amenityData.Amenity_List.list[0];

      fetchIcon(icon).then((response) => {
        console.log({ response });
        setFile(response);
        form.reset({ name, description });
      });
    }
  }, [amenityData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log({ values });
      let updateData: any = {
        _id: amenityId,
        name: values.name,
        description: values.description,
      };
      if (file) {
        console.log("myFile", file);

        const fileUploadReponses: any[] = (await s3Upload([file])) as any;
        updateData["icon"] = fileUploadReponses[0]?.location;
      }

      const { data, errors } = await updateAmenity({
        variables: {
          updateAmenityInput: updateData,
        },
      });

      if (data && data.Amenity_Update) {
        toast({
          title: "Success",
          description: "Amenity updated successfully",
        });
        router.push("/dashboard/amenities");
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update amenity",
        });
      }
    } catch (err: any) {
      console.error("Amenity Update error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.toString(),
      });
    }
  }

  if (amenityLoading) return <div>Loading...</div>;

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
                          <Input placeholder="Amenity Name" {...field} />
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
                          <Input placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            placeholder="Icon URL"
                            {...field}
                            accept="image/jpeg, image/png"
                            defaultValue={file ? file.name : ""}
                            onChange={(e) => {
                              console.log({
                                onchange: e.target.files as any,
                              });
                              if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                              }
                            }}
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

export default UpdateAmenity;
