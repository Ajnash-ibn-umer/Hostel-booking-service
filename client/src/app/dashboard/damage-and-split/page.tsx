"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import MainTable from "@/components/Tables/MainTable";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { AlertConfirm } from "@/components/Alerts/alert";
import { DAMAGE_AND_SPLIT_LIST_QUERY } from "@/graphql/queries/main.quiries";

const DamageAndSplitList: React.FC = () => {
  const router = useRouter();
  const [damageAndSplitData, setDamageAndSplitData] = useState<any[]>([]);

  const { data, loading } = useQuery(DAMAGE_AND_SPLIT_LIST_QUERY, {
    variables: {
      dto: {
        sortOrder: -1,
        limit: 10,
      },
    },
  });

  useEffect(() => {
    if (data?.DamageAndSplit_List?.list) {
      setDamageAndSplitData(data.DamageAndSplit_List.list);
    }
  }, [data]);

  const tableHeadings = [
    "Title",
    "Hostel",
    "Total Amount",
    "Received",
    "Due Date",
    "Status",
    "Actions",
  ];

  const getStatusLabel = (status: number) => {
    switch (status) {
      case -1:
        return { label: "Default", color: "gray" };
      case 1:
        return { label: "Active", color: "green" };
      case 0:
        return { label: "Inactive", color: "yellow" };
      case 2:
        return { label: "Deleted", color: "red" };
      default:
        return { label: "Unknown", color: "gray" };
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Damage and Split Management" />
      <div className="mb-6 flex justify-end">
        <Button
          variant="default"
          onClick={() => router.push("damage-and-split/create")}
        >
          Create New
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MainTable
          headings={tableHeadings}
          data={damageAndSplitData.map((item) => {
            const { label, color } = getStatusLabel(item.status);
            return {
              title: item?.title,
              hostel: item?.hostel || "N/A",
              totalAmount: item?.totalAmount.toFixed(2),
              receivedAmount: item?.receivedAmount.toFixed(2),
              dueDate: new Date(item?.dueDate).toLocaleDateString(),
              status: (
                <h5 className={`text-${color}-600 font-semibold`}>{label}</h5>
              ),
              actions: (
                <div className="flex gap-4">
                  <Button
                    variant="default"
                    onClick={() =>
                      router.push(`damage-and-split/edit/${item._id}`)
                    }
                  >
                    Edit
                  </Button>
                  <AlertConfirm
                    cancel="Cancel"
                    confirm="Delete"
                    description=""
                    title="Do you want to delete Hostel ?"
                    onContinue={() => console.log("Delete:", item._id)}
                  >
                    <Button variant="destructive">Delete</Button>
                  </AlertConfirm>
                </div>
              ),
            };
          })}
        />
      )}
    </div>
  );
};

export default DamageAndSplitList;
