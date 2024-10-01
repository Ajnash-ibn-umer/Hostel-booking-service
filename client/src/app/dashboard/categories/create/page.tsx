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
import { CATEGORY_CREATE_GQL } from "@/graphql/queries/main.mutations";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().optional(),
  // icon: z.instanceof(File).optional(),
});

function CreateCategory() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });
  const [createcategory, { loading, error }] = useMutation(CATEGORY_CREATE_GQL);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });

    try {
      const { data, errors } = await createcategory({
        variables: {
          createPropertyCategoryInput: {
            description: values.description,
            // icon: values.icon,
            name: values.name,
            slug: values.slug,
          },
        },
      });

      if (data && data.PropertyCategory_Create) {
        router.push("/dashboard/categories");
      } else {
       
        toast({
          variant: "destructive",
          title: `Creation Failed`,
          description: `Response Not found`,
        });
      }
    } catch (err: any) {
      console.error("Category Creation error:", err);

      toast({
        variant: "destructive",
        title: `Creation Failed`,
        description: err.toString(),
      });
      // Handle login error (e.g., show error message)
    }
  }

  return (
    <>
      <div className="relative flex-wrap gap-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative flex w-full flex-col space-y-8"
          >
            <div className="flex w-full flex-col">
              <div className="space-between w-full flex-wrap gap-5">
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
                        <Input placeholder="category-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Category Description"
                          {...field}
                          className="resize-none rounded-md border p-2"
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
      </div>
    </>
  );
}

export default CreateCategory;
