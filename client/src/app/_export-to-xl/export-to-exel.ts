import saveAs from "file-saver";
import * as XLSX from "xlsx";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

interface JsonToExcelProps {
  data: any;
  title?: string;
  fileName: string;
  btnClassName?: string;
  btnColor?: string;
  multipleSheets?: boolean;
}

interface ExportToExcelData {
  sheetName: string;
  details: any[];
}

export const exportToExcel = (
  data: ExportToExcelData[] | any[],
  fileName: string,
  multipleSheets: boolean,
) => {
  const wb: XLSX.WorkBook = {
    Sheets: {},
    SheetNames: [],
  };

  if (multipleSheets) {
    (data as ExportToExcelData[]).forEach((item) => {
      const { sheetName, details } = item;
      const ws = XLSX.utils.json_to_sheet(details);
      wb.Sheets[sheetName] = ws;
      wb.SheetNames.push(sheetName);
    });
  } else {
    const ws = XLSX.utils.json_to_sheet(data as any[]);
    wb.Sheets["data"] = ws;
    wb.SheetNames.push("data");
  }

  const eb = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([eb], { type: EXCEL_TYPE });
  saveAs(blob, fileName + EXCEL_EXTENSION);
};
