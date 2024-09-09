"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Button/Button";
import ButtonDefault from "@/components/Button/Button";
import MainTable from "@/components/Tables/MainTable";
import { HOSTEL_LIST_DASHBOARD } from "@/graphql/queries/main.quiries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import HostelTable from "./hostel-table";
import {useRouter} from 'next/navigation'
interface hostelListInterface {
  name: string;
  propertyNo: string;
  sellingPrice: number;
  standardPrice: number;
  totalRooms: number;
}
const HostelList: React.FC = () => {
  const router=useRouter()
  const [hostelListData, setHostelListData] = useState<
    Array<hostelListInterface>
  >([]);

  const headings = ["Name", "UID", "SellingPrice", "StandardPrice","TotalRooms"];

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
      const hostelList = data.
      Hostel_List?.list
       || [];
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
          <Button
            background="primary"
            fontColor="white"
            buttonType="rounded-corner"
            onClick={()=>router.push('hostels/create')}
          >
            Create
          </Button>
        </div>

        <HostelTable headings={headings} data={hostelListData} />
      </div>
    </div>
  );
};

export default HostelList;
