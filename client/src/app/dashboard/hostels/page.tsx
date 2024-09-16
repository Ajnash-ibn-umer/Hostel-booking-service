"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import ButtonDefault from "@/components/Button/Button";
import MainTable from "@/components/Tables/MainTable";
import {
  HOSTEL_LIST_DASHBOARD,
  PROPERTY_CATEGORY_LIST,
} from "@/graphql/queries/main.quiries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "./hostel-table";
import { useRouter } from "next/navigation";
import { hostelColumns } from "./column";

interface hostelListInterface {
  name: string;
  propertyNo: string;
  sellingPrice: number;
  standardPrice: number;
  totalRooms: number;
}
const HostelList: React.FC = () => {
  const router = useRouter();
  const [hostelListData, setHostelListData] = useState<
    Array<hostelListInterface>
  >([]);



  const inputVaribales = {
    listInputHostel: {
      statusArray: [1],
      limit: -1,
      skip: -1,
      searchingText: null,
      sortOrder: null,
      sortType: null,
      categoryIds: null,
      hostelIds: null,
      availblityStatusFilter: null,
      amenityIds: null,
      locationIds: null,
      priceBaseModeFilter: null,
      priceRangeFilter: null,
      propertyNumberFilter: null,
    },
  };

  const { loading, data, error } = useQuery(HOSTEL_LIST_DASHBOARD, {
    variables: inputVaribales,
  });

  useEffect(() => {
    console.log(data);
    if (data) {
      const hostelList = data.Hostel_List?.list || [];
      console.log("inner", hostelList);
      setHostelListData(hostelList);
    }
    if (error) {
      alert(error.message);
    }
  }, [data]);

  return (
    <div>
      <Breadcrumb pageName="Hostel" />

      {/* <p className="mt-[3px] text-body-sm font-medium">
                    ${itemData.price}
                  </p> */}

      <div className="flex flex-col gap-10">
        <div className="flex justify-end ">
          <Button onClick={() => router.push("hostels/create")}>Create</Button>
        </div>

        <DataTable columns={hostelColumns} data={hostelListData || []} />
      </div>
    </div>
  );
};

export default HostelList;
