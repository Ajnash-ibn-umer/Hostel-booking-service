"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import {
  AMENITY_CREATE_GQL,
  GALLERY_CREATE_MULTIPLE_GQL,
} from "@/graphql/queries/main.mutations";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import galleryUpload from "@/_lib/gallery-upload";
import { s3Upload } from "@/config/aws";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  icon: z.any().nullable(),
});

function CreateAmenity() {
  const { toast } = useToast();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: null,
    },
  });
  const [createGallery, { loading: galleryLoading, error: galleryError }] =
    useMutation(GALLERY_CREATE_MULTIPLE_GQL);
  const [createAmenity, { loading, error }] = useMutation(AMENITY_CREATE_GQL);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });

    try {
      let createData:any = {
        name: values.name,
        description: values.description,
      };
      if (file) {
        console.log("myFile", file);
        const fileUploadReponses: any[] = (await s3Upload([file])) as any;
        createData["icon"] = fileUploadReponses[0]?.location;
      }
      const { data, errors } = await createAmenity({
        variables: {
          createAmenityInput: createData,
        },
      });

      if (data && data.Amenity_Create) {
        router.push("/dashboard/amenities");
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Response not found",
          description: "Response not found from amenity creation",
        });
      }
    } catch (err: any) {
      console.error("Amenity Creation error:", err);

      toast({
        variant: "destructive",
        title: `Error Found`,
        description: err.toString(),
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
                          <Textarea
                            placeholder="Amenity Description"
                            {...field}
                          />
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
                            {...field}
                            onChange={(e) => {
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default CreateAmenity;
