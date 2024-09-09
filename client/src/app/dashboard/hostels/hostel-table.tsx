import { Package } from "@/types/templateTypes/package";

interface HostelTableProps {
  headings: string[];
  data: Record<string, any>[];
}

const HostelTable = (props: HostelTableProps) => {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              {props.headings &&
                props.headings.map((head, index) => (
                  <th
                    key={index + Number(Date.now())}
                    className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5"
                  >
                    {head}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {props.data.map((itemData, index) => (
              <tr key={index}>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === props.data.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  {itemData.name || ""}
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === props.data.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  {itemData.propertyNo || ""}
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === props.data.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  {itemData.sellingPrice || ""}
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === props.data.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  {itemData.standardPrice || ""}
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === props.data.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  {itemData.totalRooms || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostelTable;
