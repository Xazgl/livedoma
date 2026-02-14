"use client";

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Tilda } from "@prisma/client";

export type GenericTableProps<T> = {
  fetchUrl: string;
  generateExcel: (data: T[]) => void;
  createColumns: (data: any[]) => any;
  initialApplications: {
    applicationsExcel: Tilda[];
    allFilteredSales: Tilda[];
  };
  parseData: (data: any[]) => T[];
};

export function GenericTable<T>({
  fetchUrl,
  generateExcel,
  createColumns,
  initialApplications,
  parseData,
}: GenericTableProps<T>) {
  const [applicationsArr, setApplicationsArr] = useState<unknown[]>(
    parseData(initialApplications.allFilteredSales)
  );
  const [applicationsExcel, setApplicationsExcel] = useState(
    parseData(initialApplications.applicationsExcel)
  );
  const [value, setValue] = useState<Dayjs | null>(dayjs().subtract(30, "day"));
  const [valueEnd, setValueEnd] = useState<Dayjs | null>(dayjs());

  const handleDateChange = async (newData: any | null, isStart: boolean) => {
    const params = new URLSearchParams();
    const newStart = isStart ? newData : value;
    const newEnd = !isStart ? newData : valueEnd;

    if (isStart) {
      setValue(newData);
    } else {
      setValueEnd(newData);
    }

    if (newStart) {
      params.append("date", newStart.startOf("day").toISOString());
    }

    if (newEnd) {
      params.append("dateEnd", newEnd.endOf("day").toISOString());
    }

    fetch(`${fetchUrl}?${params}`)
      .then((res) => res.json())
      .then((el) => {
        const excelApp = el.applicationsExcel;
        const parsedData = parseData ? parseData(excelApp) : excelApp;
        setApplicationsArr(parsedData);
        setApplicationsExcel(parsedData);
      });
  };

  const columns = createColumns(applicationsArr);

  return (
    <section className="flex flex-col w-full h-full">
      <div className="flex md:items-start w-full bg-white mt-5 text-black">
        <div className="flex flex-col items-center md:items-start w-full h-full md:w-[300px] gap-5 p-4">
          <h3 className="text-[12px] p-[0px]">Выберите даты от и до</h3>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Дата от"
                value={value}
                onChange={(newValue) => handleDateChange(newValue, true)}
              />
              <DatePicker
                label="Дата до"
                value={valueEnd}
                onChange={(newValue) => handleDateChange(newValue, false)}
              />
            </DemoContainer>
          </LocalizationProvider>

          <button
            className="flex justify-center items-center w-full h-[40px] rounded bg-[#f15282ca] text-neutral-50 shadow hover:bg-[#55529fc1] px-6 pb-2 pt-2.5 text-sm font-medium uppercase transition duration-150"
            onClick={() => generateExcel(applicationsExcel)}
          >
            Скачать
          </button>
          <h6 className="text-[8px] text-[#C0C0C0]">
            Файл будет содержать заявки в этом временном промежутке
          </h6>
        </div>
      </div>

      <div className="flex flex-col w-full bg-white h-full mt-[10px] md:mt-[5px]">
        <DataGrid
          sx={{ height: "100%" }}
          rows={applicationsArr}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[applicationsArr.length]}
          disableRowSelectionOnClick
        />
      </div>
    </section>
  );
}
