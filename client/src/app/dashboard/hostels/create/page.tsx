"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Button/Button";
import Selector from "@/components/MultiSelector/multiSelector";
import React from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
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

const dummyAmenities = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

function CreateHostelForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <div>
      <Breadcrumb pageName="CreateHostel" />

      <div className="flex  gap-10">
        <div className="flex w-full ">
          <form action="" className="flex w-full flex-col gap-5 p-10">
            <div className="flex w-full gap-5">
              <div className="w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <input
                      {...register("name", { required: true })}
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="sellingPrice"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Selling Price
                  </label>
                  <div className="relative">
                    <input
                      {...register("sellingPrice", { required: true })}
                      type="number"
                      name="sellingPrice"
                      placeholder="Enter Selling Price"
                      className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="totalRooms"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Total Rooms
                  </label>
                  <div className="relative">
                    <input
                      {...register("totalRooms", { required: true })}
                      type="number"
                      name="totalRooms"
                      placeholder="Enter Total Rooms"
                      className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="category"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Category
                  </label>
                  <div className="relative">
                  <Selector
                      name="category"
                      defaultValue={dummyAmenities[0] as any}
                      options={dummyAmenities}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="availabilityStatus"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Availability Status
                  </label>
                  <div className="relative">
                  <Selector
                      name="availabilityStatus"
                      defaultValue={dummyAmenities[0] as any}
                      options={dummyAmenities}
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="amenities"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Amenities
                  </label>
                  <div className="relative">
                    <Selector
                      name="Amenities"
                      defaultValue={dummyAmenities[0] as any}
                      options={dummyAmenities}
                    />
                  </div>
                </div>
              </div>

              <div className="w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="shortDescription"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Short Description
                  </label>
                  <div className="relative">
                    <input
                      {...register("shortDescription", { required: true })}
                      type="text"
                      name="shortDescription"
                      placeholder="Enter Short Description"
                      className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="standardPrice"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Standard Price
                  </label>
                  <div className="relative">
                    <input
                      {...register("standardPrice", { required: true })}
                      type="number"
                      name="standardPrice"
                      placeholder="Enter Standard Price"
                      className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="totalBeds"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Total Beds
                  </label>
                  <div className="relative">
                    <input
                      {...register("totalBeds", { required: true })}
                      type="number"
                      name="totalBeds"
                      placeholder="Enter Total Beds"
                      className="w-full rounded-lg border border-solid border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="location"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Location
                  </label>
                  <div className="relative">
                  <Selector
                      name="location"
                      defaultValue={dummyAmenities[0] as any}
                      options={dummyAmenities}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="purchaseBaseMode"
                    className="mb-2.5 block font-medium text-dark dark:text-white"
                  >
                    Purchase Base Mode
                  </label>
                  <div className="relative">
                  <Selector
                  isMulti
                      name="Amenities"
                      defaultValue={dummyAmenities[0] as any}
                      options={dummyAmenities}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-5">
              <label
                htmlFor="description"
                className="block font-medium text-dark dark:text-white"
              >
                Description
              </label>
              <div className="relative">
                <textarea
                  {...register("description", { required: true })}
                  name="description"
                  placeholder="Enter Description"
                  className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateHostelForm;
