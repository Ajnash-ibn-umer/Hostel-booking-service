"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTableCategory } from "./data-table";
import { columns } from "./column";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { PROPERTY_CATEGORY_LIST } from "@/graphql/queries/main.quiries";
import Link from "next/link";
import Pageniation from "./pagniation";

function Category() {
  const router = useRouter();

  const [inputVariables, setInputVariables] = useState<{
    listInput: {
      statusArray: number[];
      limit: number;
      skip: number;
      searchingText: string | null;
      sortOrder: number;
    };
  }>({
    listInput: {
      statusArray: [1],
      limit: 2,
      skip: 0,
      searchingText: null,
      sortOrder: 1,
    },
  });

  const { loading, data, error, refetch } = useQuery(PROPERTY_CATEGORY_LIST, {
    variables: inputVariables,
  });
  const changePage = (skip: number) => {
    console.log({ skip });
    setInputVariables({
      listInput: {
        ...inputVariables.listInput,
        skip: skip || 0,
      },
    });
    refetch(inputVariables);
  };
  useEffect(() => {
    console.log({ data });
    if (data) {
      const hostelList = data?.PropertyCategory_List?.list || [];
      console.log("inner", hostelList);
    }
    if (error) {
      alert(error.message);
    }
  }, [data]);
  return (
    <div>
      <Breadcrumb pageName="Category" />

      {/* <p className="mt-[3px] text-body-sm font-medium">
                  ${itemData.price}
                </p> */}

      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
          <Button asChild>
            <Link href={"categories/create"}>Create</Link>
          </Button>
        </div>
        <DataTableCategory
          columns={columns}
          data={data?.PropertyCategory_List?.list || []}
        />
        <Pageniation
          fetch={changePage}
          skip={inputVariables?.listInput.skip || 0}
          totalCount={data?.PropertyCategory_List?.totalCount || 0}
          limit={inputVariables?.listInput.limit || 10}
        ></Pageniation>
      </div>
    </div>
  );
}

export default Category;
