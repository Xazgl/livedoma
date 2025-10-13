"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Tilda } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createColumns, parseSurveyData } from "./centro-utils";
import { generateSurveyExcel } from "@/lib/excel-tilda";

export function CentroTable({ applications }: { applications: Tilda[] }) {
  const [applicationsArr, setApplicationsArr] = useState<Tilda[]>(applications);
  const [value, setValue] = useState<Dayjs | null>(dayjs().subtract(30, "day"));
  const [valueEnd, setValueEnd] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    const params = new URLSearchParams();
    if (value) {
      params.append("date", value.startOf("day").toISOString());
    }
    if (valueEnd) {
      params.append("dateEnd", valueEnd.endOf("day").toISOString());
    }

    fetch("/api/app-centro?" + params)
      .then((res) => res.json())
      .then((el) => {
        const parsedData = parseSurveyData(el.applicationsExcel);
        setApplicationsArr(parsedData);
      });
  }, [value, valueEnd]);

  const columns = createColumns(applicationsArr);

  return (
    <section className="flex flex-col w-[100%] h-full">
      <div className="flex md:items-start w-full bg-white mt-5 text-black">
        <div className="flex flex-col items-center md:items-start w-full h-full md:w-[300px] gap-5 p-4">
          <h3 className="text-[12px] p-[0px]">Выберите даты от и до</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Дата от"
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Дата до"
                value={valueEnd}
                onChange={(newValue) => setValueEnd(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          <button
            className={`flex justify-center items-center w-[100%] h-[40px] rounded bg-[#f15282ca] text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] hover:bg-[#55529fc1] hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-[#55529fda] focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] active:bg-[#54529F] active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal transition duration-150 ease-in-out focus:outline-none focus:ring-0`}
            onClick={() => generateSurveyExcel(applicationsArr)}
          >
            Скачать
          </button>
          <h6 className="text-[8px] p-[0px] text-[#C0C0C0]">
            Файл будет содержать заявки в этом временном промежутке
          </h6>
        </div>
      </div>

      <div className="flex flex-col w-full bg-white h-full mt-[10px] md:mt-[5px]">
        <DataGrid
          sx={{ height: "100%" }}
          rows={applicationsArr}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[applicationsArr.length]}
          disableRowSelectionOnClick={true}
        />
      </div>
    </section>
  );
}
