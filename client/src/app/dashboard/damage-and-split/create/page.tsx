"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useToast } from "@/hooks/use-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";
import {
  CREATE_DAMAGE_AND_SPLITS,
  HOSTEL_LIST,
  USER_LIST,
} from "@/graphql/queries/main.mutations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MultiSelect from "@/components/MultiSelect/multi-selector";
import { CalendarIcon } from "lucide-react";
import { convertToIST } from "@/utils/date";

type User = {
  value: string;
  label: string;
};

type SplitDetail = {
  userId: string | null;
  amount: number | null;
};

type FormData = {
  hostelId: string;
  title: string;
  description: string;
  documentUrl: string;
  dueDate: string;
  totalAmount: number;
  splitDetails: SplitDetail[];
};

type Hostel = {
  _id: string;
  name: string;
};

type HostelListResponse = {
  Hostel_List: {
    list: Hostel[];
  };
};

type ListInputHostel = {
  skip: number;
  limit: number;
  statusArray: number;
};

const CreateDamageAndSplit: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedHostelId, setSelectedHostelId] = useState<string>("");
  const [dobInput, setDobInput] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    hostelId: "",
    title: "",
    description: "",
    documentUrl: "",
    dueDate: "",
    totalAmount: 0,
    splitDetails: [],
  });

  const [createDamageAndSplit] = useMutation<
    {
      DamageAndSplit_Create: any;
    },
    { createDamageAndSplitInput: FormData }
  >(CREATE_DAMAGE_AND_SPLITS);

  const { data: hostelData } = useQuery<
    HostelListResponse,
    { listInputHostel: ListInputHostel }
  >(HOSTEL_LIST, {
    variables: { listInputHostel: { skip: 1, limit: 10, statusArray: 1 } },
  });

  const { data: userData } = useQuery(USER_LIST, {
    variables: {
      listUserInput: { limit: 10, skip: 1, sortType: 1, statusFilter: [1] },
    },
  });

  useEffect(() => {
    const userCount = selectedUserIds.length;
    const splitAmount = userCount > 0 ? formData.totalAmount / userCount : 0;
    const updatedSplitDetails = selectedUserIds.map((userId) => ({
      userId,
      amount: parseFloat(splitAmount.toFixed(2)),
    }));

    setFormData((prev) => ({
      ...prev,
      hostelId: selectedHostelId,
      splitDetails: updatedSplitDetails,
    }));
  }, [selectedUserIds, formData.totalAmount]);

  const handleSubmit = async () => {
    try {
      const { data } = await createDamageAndSplit({
        variables: { createDamageAndSplitInput: formData },
      });
      if (data?.DamageAndSplit_Create?._id) {
        toast({
          variant: "default",
          description: "Damage and split created successfully!",
        });
        setFormData({
          hostelId: "",
          title: "",
          description: "",
          dueDate: "",
          splitDetails: [],
          documentUrl: "",
          totalAmount: 0,
        });
        router.back();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create damage and split.",
        description: error?.message,
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-xl font-bold">Create Damage and Split</h1>
      <div className="space-y-4">
        <Select onValueChange={setSelectedHostelId} value={selectedHostelId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a hostel" />
          </SelectTrigger>
          <SelectContent>
            {hostelData?.Hostel_List?.list?.map((hostel) => (
              <SelectItem key={hostel._id} value={hostel._id}>
                {hostel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <MultiSelect
          selectedValues={selectedUserIds}
          onChange={setSelectedUserIds}
          values={userData?.User_List?.list.map((user: any) => ({
            value: user._id,
            label: user.name,
          }))}
        />

        <Input
          name="Title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <Input
          placeholder="Document URL"
          value={formData.documentUrl}
          onChange={(e) =>
            setFormData({ ...formData, documentUrl: e.target.value })
          }
        />
        {/* <DatePickerTwo
          selected={formData.dueDate}
          onChange={(date) => setFormData({ ...formData, dueDate: date })}
        /> */}

        <div className="relative">
          <Input
            type="text"
            placeholder="Select a Due Date"
            className="border border-black pr-10 placeholder-gray-500"
            autoComplete="off"
            value={dobInput}
            onFocus={() => setOpenDatePicker(true)}
            readOnly
          />
          <CalendarIcon
            className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-gray-500"
            onClick={() => setOpenDatePicker(true)}
          />
        </div>

        {openDatePicker && (
          <Calendar
            value={formData.dueDate ? new Date(formData.dueDate) : null}
            onChange={(value) => {
              if (value instanceof Date) {
                setFormData({
                  ...formData,
                  dueDate: convertToIST(value),
                });
                setDobInput(value.toLocaleDateString());
              } else {
                setFormData({ ...formData, dueDate: "" });
                setDobInput("");
              }
              setOpenDatePicker(false);
            }}
          />
        )}
        <div />

        <Input
          placeholder="Total Amount"
          type="number"
          value={formData.totalAmount === 0 ? "" : formData.totalAmount}
          onChange={(e) =>
            setFormData({
              ...formData,
              totalAmount: parseFloat(e.target.value) || 0,
            })
          }
        />

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="mt-6 w-full">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateDamageAndSplit;
