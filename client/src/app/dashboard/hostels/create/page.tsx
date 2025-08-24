"use client";
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
import ReactSelect, { StylesConfig } from "react-select";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Selector from "@/components/MultiSelector/multiSelector";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client";
import {
  AMENITY_LIST_MINIMAL_GQL,
  LOCATION_LIST_MINIMAL_GQL,
  PROPERTY_CATEGORY_LIST,
  PROPERTY_CATEGORY_MINIMAL_LIST,
  ROOM_TYPE_LIST_MINIMAL_GQL,
} from "@/graphql/queries/main.quiries";
import {
  GALLERY_CREATE_GQL,
  GALLERY_CREATE_MULTIPLE_GQL,
  HOSTEL_CREATE_GQL,
} from "@/graphql/queries/main.mutations";
import { useRouter } from "next/navigation";
import MultiSelect from "@/components/MultiSelect/multi-selector";
import RoomCreationForm, { Bed } from "./room-form";
import { routeModule } from "next/dist/build/templates/app-page";
import MultiFileUploader from "@/components/MultiFileUploader/file-uploader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { s3Upload } from "@/config/aws";
import galleryUpload from "../../../../_lib/gallery-upload";
import { Hotel } from "lucide-react";
import Loader from "@/components/common/Loader";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface CreateHostelInput {
  totalBeds: number | null;
  totalRooms: number | null;
  standardPrice: number | null;
  shortDescription: string | null;
  sellingPrice: number | null;
  priceBaseMode: string | null;
  name: string | null;
  locationId: string | null;
  galleryIds: string[] | null;
  description: string | null;
  categoryId: string | null;
  availabilityStatus: string | null;
  aminityIds: string[] | null;
  rooms: Array<{
    aminityIds: string[] | null;
    beds: Array<{
      availabilityStatus: string | null;
      bedPosition: string | null;
      floor: number | null;
      name: string | null;
      paymentBase: string | null;
      roomTypeId: string | null;
    }>;
    floor: number | null;
    name: string | null;
    roomTypeId: string | null;
    totalBeds: number | null;
    galleryIds: string[] | null;
  }>;
}

interface FileWithPreview extends File {
  preview: string;
}

type Inputs = {
  name: string;
  sellingPrice: string;
  standardPrice: string;
  totalRooms: string;
  shortDescription: string;
  totalBeds: string;
  category: string;
  location: string;
  availabilityStatus: string;
  purchaseBaseMode: string;
  amenities: string[];
  description: string;
};

interface CatinputVariables {
  listInput: {
    statusArray: number[];
    limit: number;
    skip: number;
    searchingText: string | null;
    sortOrder: number;
  };
}

interface LocationinputVariables {
  listInputLocation: {
    statusArray: number[];
    limit: number;
    skip: number;
    searchingText: string | null;
    sortOrder: number;
  };
}

interface AmenityinputVariables {
  listInput: {
    statusArray: number[];
    limit: number;
    skip: number;
    searchingText: string | null;
    sortOrder: number;
  };
}

interface RoomTypeinputVariables {
  listInput: {
    statusArray: number[];
    limit: number;
    skip: number;
    searchingText: string | null;
    sortOrder: number;
  };
}
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  sellingPrice: z.string().min(1, {
    message: "Selling Price is required.",
  }),
  standardPrice: z.string().min(1, {
    message: "Standard Price is required.",
  }),
  totalRooms: z.string().min(1, {
    message: "Total Rooms is required.",
  }),
  shortDescription: z.string().optional(),
  totalBeds: z.string().min(1, {
    message: "Total Beds is required.",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required.",
  }),
  locationId: z.string().min(1, {
    message: "Location is required.",
  }),
  availabilityStatus: z.string().min(1, {
    message: "Availability Status is required.",
  }),
  purchaseBaseMode: z.string().min(1, {
    message: "Purchase Base Mode is required.",
  }),
  amenityIds: z.array(z.string()).optional(),
  description: z.string().optional(),
  galleryIds: z.array(z.string()).optional(),

  // rooms: z.array(
  //   z.object({
  //     aminityIds: z.array(z.string()).optional(),
  //     beds: z.array(
  //       z.object({
  //         availabilityStatus: z.number().min(1, {
  //           message: "Bed Availability Status is required.",
  //         }),
  //         bedPosition: z.number().min(1, {
  //           message: "Bed Position is required.",
  //         }),
  //         floor: z.string().min(1, {
  //           message: "Bed Floor is required.",
  //         }),
  //         name: z.string().min(1, {
  //           message: "Bed Name is required.",
  //         }),
  //         paymentBase: z.number().min(1, {
  //           message: "Bed Payment Base is required.",
  //         }),
  //         roomTypeId: z.string().min(1, {
  //           message: "Bed Room Type is required.",
  //         }),
  //       }),
  //     ),
  //     floor: z.string().min(1, {
  //       message: "Room Floor is required.",
  //     }),
  //     name: z.string().min(1, {
  //       message: "Room Name is required.",
  //     }),
  //     roomTypeId: z.string().min(1, {
  //       message: "Room Type is required.",
  //     }),
  //     totalBeds: z.number().min(1, {
  //       message: "Total Beds is required.",
  //     }),
  //     galleryIds: z.array(z.string()).optional(),
  //   }),
  // ),
});

type Room = {
  aminityIds: string[];
  beds: Bed[];
  floor: number;
  name: string;
  roomTypeId: string;
  totalBeds: number;
  files: File[];
};
type Hostel = {
  rooms: Room[];
};
const baseListInput = {
  statusArray: [1],
  limit: -1,
  skip: 0,
  searchingText: null,
  sortOrder: 1,
};
function CreateHostelForm() {
  const { toast } = useToast();

  const router = useRouter();
  const [hostel, setHostel] = useState<Hostel>({
    rooms: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [createHostel, { loading, error }] = useMutation(HOSTEL_CREATE_GQL);
  const [createGallery, { loading: galleryLoading, error: galleryError }] =
    useMutation(GALLERY_CREATE_MULTIPLE_GQL);

  const [catinputVariables, setCatInputVariables] = useState<CatinputVariables>(
    {
      listInput: baseListInput,
    },
  );
  const [amenityinputVariables, setamenityInputVariables] =
    useState<AmenityinputVariables>({
      listInput: baseListInput,
    });
  const [locationinputVariables, setlocationInputVariables] =
    useState<LocationinputVariables>({
      listInputLocation: baseListInput,
    });
  const [roomTypeinputVariables, setroomTypeInputVariables] =
    useState<RoomTypeinputVariables>({
      listInput: baseListInput,
    });
  const {
    loading: catLoading,
    data: catData,
    error: catError,
  } = useQuery(PROPERTY_CATEGORY_MINIMAL_LIST, {
    variables: catinputVariables,
  });

  const {
    loading: locationLoading,
    data: locationData,
    error: locationError,
  } = useQuery(LOCATION_LIST_MINIMAL_GQL, {
    variables: locationinputVariables,
  });
  const {
    loading: amenityLoading,
    data: amenityData,
    error: amenityError,
  } = useQuery(AMENITY_LIST_MINIMAL_GQL, {
    variables: amenityinputVariables,
  });
  const {
    loading: roomTypeLoading,
    data: roomTypeData,
    error: roomTypeError,
  } = useQuery(ROOM_TYPE_LIST_MINIMAL_GQL, {
    variables: roomTypeinputVariables,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sellingPrice: "0",
      standardPrice: "0",
      totalRooms: "0",
      shortDescription: "",
      totalBeds: "0",
      categoryId: undefined,
      locationId: undefined,
      availabilityStatus: "0",
      purchaseBaseMode: "1",
      amenityIds: [],
      description: "",
      galleryIds: [],
      // rooms: [
      //   {
      //     name: "Default Room",
      //     aminityIds: ["Default Amenity ID"],
      //     beds: [
      //       {
      //         name: "Default Bed",
      //         availabilityStatus: 0,
      //         bedPosition: 0,
      //         floor: "0",
      //         paymentBase: 0,
      //         roomTypeId: "Default Room Type ID",
      //       },
      //     ],
      //     floor: "0",
      //     roomTypeId: "Default Room Type ID",
      //     totalBeds: 0,
      //     galleryIds: ["Default Gallery ID"],
      //   },
      // ],
    },
  });

  const categoryOptions = useMemo(
    () =>
      catData?.PropertyCategory_List?.list?.map((cat: any) => ({
        value: cat._id,
        label: cat.name,
      })) ?? [],
    [catData],
  );

  const locationOptions = useMemo(
    () =>
      locationData?.Location_List?.list?.map((loc: any) => ({
        value: loc._id,
        label: loc.name,
      })) ?? [],
    [locationData],
  );

  const amenityOptions = useMemo(
    () =>
      amenityData?.Amenity_List?.list?.map((amenity: any) => ({
        value: amenity._id,
        label: amenity.name,
      })) ?? [],
    [amenityData],
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const rooms: any[] = [];

      if (hostel.rooms.length === 0) {
        throw "Rooms is Required";
      }
      for (const room of hostel.rooms) {
        let beds: any[] = [];
        if (hostel.rooms.length !== Number(values.totalRooms)) {
          throw `Room Count doent match `;
        }
        let roomGalleries: string[] = [];
        if (room.files && room.files.length > 0) {
          roomGalleries = await galleryUpload({
            images: room.files,
            createGallery,
          });
        }
        if (room.beds && room.beds.length > 0) {
          if (room.beds.length !== Number(room.totalBeds)) {
            throw `Bed  Count doesnt match in room ${room.name}`;
          }

          room.beds.map((bed) => {
            beds.push({
              availabilityStatus: Number(bed.availabilityStatus),
              bedPosition: Number(bed.bedPosition),
              floor: room.floor,
              paymentBase: Number(bed.paymentBase),
              roomTypeId: room.roomTypeId,
            });
          });
        }

        rooms.push({
          name: room.name,
          aminityIds: room.aminityIds,
          floor: room.floor,
          roomTypeId: room.roomTypeId,
          totalBeds: Number(room.totalBeds),
          galleryIds: roomGalleries,
          beds: beds,
        });
      }

      let galleryIds: string[] = [];
      if (images && images.length > 0) {
        galleryIds = await galleryUpload({ images, createGallery });
      }
      const inputData = {
        createHostelInput: {
          totalBeds: Number(values.totalBeds),
          totalRooms: Number(values.totalRooms),
          standardPrice: Number(values.standardPrice),
          shortDescription: values.shortDescription,
          sellingPrice: Number(values.sellingPrice),
          priceBaseMode: Number(values.purchaseBaseMode),
          name: values.name,
          locationId: values.locationId,
          galleryIds: galleryIds,
          description: values.description,
          categoryId: values.categoryId,
          availabilityStatus: Number(values.availabilityStatus),
          aminityIds: values.amenityIds,
          rooms: rooms,
        },
      };
      const { data, errors } = await createHostel({
        variables: inputData,
      });

      setIsLoading(false);

      if (data && data.Hostel_Create) {
        router.push("/dashboard/hostels");
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Response not found",
          description: "Response not found from hostel creation",
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (err: any) {
      setIsLoading(false);

      if (Array.isArray(err)) {
        toast({
          variant: "destructive",
          title: `Uh oh! ${err.toString() || err}.`,
          description: err.toString(),
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
      toast({
        variant: "destructive",
        title: `Uh oh! ${err.message || err}.`,
        description: err.message || err,
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      // Handle login error (e.g., show error message)
    }
  }
  return (
    <div>
      <Breadcrumb pageName="CreateHostel" />

      <div className="flex  gap-10">
        <div className="flex w-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative flex w-full flex-col space-y-8"
            >
              <div className="relative z-10 w-full flex-row">
                {isLoading ? <Loader></Loader> : <></>}

                <Card className=" relative -z-10 flex w-full flex-col p-4">
                  <Card className="mb-10 flex w-full flex-col p-5">
                    <MultiFileUploader
                      onChange={(files: File[]) => {
                        setImages(files);
                      }}
                      
                      files={files}
                      setFiles={setFiles}
                    ></MultiFileUploader>
                  </Card>

                  <div className="flex w-full flex-row justify-between gap-5 p-2 ">
                    <div className="w-1/2 ">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Hostel Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="sellingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selling Price</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Selling Price"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-row justify-between gap-5 p-2 ">
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="standardPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Standard Price</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Standard Price"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="totalRooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Rooms</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Total Rooms"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex w-full flex-row justify-between gap-5 p-2 ">
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="totalBeds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Beds</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Total Beds"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Cateogory" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categoryOptions.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex w-full flex-row justify-between gap-5 p-2 ">
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="locationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Location..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {locationOptions.map((loc) => (
                                    <SelectItem key={loc.value} value={loc.value}>
                                      {loc.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="availabilityStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Availability Status</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Availablity Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="0">Available</SelectItem>
                                  <SelectItem value="1">Engaged</SelectItem>
                                  <SelectItem value="2">Occupied</SelectItem>
                                  <SelectItem value="3">
                                    Not Available
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex w-full flex-row justify-between gap-5 p-2 ">
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="purchaseBaseMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Base</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Payment base" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">Daily</SelectItem>
                                  <SelectItem value="2">Monthly</SelectItem>
                                  <SelectItem value="3">Both</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="amenityIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amenities</FormLabel>
                            <FormControl>
                              <MultiSelect
                                selectedValues={field.value as any}
                                onChange={field.onChange}
                                values={amenityOptions}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 p-2">
                    <div className="w-full ">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Hostel Description"
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
                </Card>
              </div>
              <div className="align-start flex w-full p-2">
                <RoomCreationForm
                  hostel={hostel}
                  setHostel={setHostel}
                  form={form as any}
                  amenityData={amenityData}
                  roomTypeData={roomTypeData}
                ></RoomCreationForm>
              </div>

              <Button className="h-10 w-30 self-end" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateHostelForm;
