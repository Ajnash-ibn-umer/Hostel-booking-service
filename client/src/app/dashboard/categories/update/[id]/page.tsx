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
import { PROPERTY_CATEGORY_LIST } from "@/graphql/queries/main.quiries";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CATEGORY_UPDATE_GQL } from "@/graphql/queries/main.mutations";
import { s3Upload } from "@/config/aws";



const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

function UpdateCategory({ params }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const categoryId = params.id;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });
  const [updateCategory, { loading, error }] = useMutation(CATEGORY_UPDATE_GQL);


  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryFetchError,
  } = useQuery(PROPERTY_CATEGORY_LIST, {
    variables: {
      listInput: {
        statusArray: [1],
        limit: 1,
        skip: 0,
        searchingText: null,
        sortOrder: 1,
        categoryIds: [categoryId],
      },
    },
  });

  useEffect(() => {
    if (categoryData && categoryData.PropertyCategory_List) {
      if (
        !categoryData.PropertyCategory_List ||
        categoryData.PropertyCategory_List.list.length === 0 ||
        categoryFetchError
      ) {
        alert("Category Not found");
      }
      const { name, slug, description } = categoryData.PropertyCategory_List.list[0];

      form.reset({ name, slug, description });
    }
  }, [categoryData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let updateData: any = {
        _id: categoryId,
        name: values.name,
        slug: values.slug,
        description: values.description,
      };

      const { data, errors } = await updateCategory({
        variables: {
            updatePropertyCategoryInput: updateData,
        },
      });

      if (data && data.PropertyCategory_Update) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        router.push("/dashboard/categories");
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update category",
        });
      }
    } catch (err: any) {
      console.error("Category Update error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.toString(),
      });
    }
  }

  if (categoryLoading) return <div>Loading...</div>;

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
                          <Input placeholder="Category Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="Category Slug" {...field} />
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

export default UpdateCategory;
