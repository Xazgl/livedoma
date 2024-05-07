"use client";
import { Pagination, Stack } from "@mui/material";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { constructionApplications } from "@prisma/client";
import { generateExcel, generateExcel2 } from "@/lib/excelFunc";
import { columnsSetsApplication, titlesApplication } from "./myFilter";

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type Props = {
  applications: constructionApplications[];
};

type FilterUserOptions = {
  dateStage: string[];
};

export function TableSecond({ applications }: Props) {
  const [applicationsArr, setApplicationsArr] = useState<constructionApplications[]>(applications);
  const [applicationsExcel, setApplicationsExcel] = useState<constructionApplications[]>(applications);
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [valueEnd, setValueEnd] = useState<Dayjs | null>(dayjs());

  const [table, setTable] = useState(1);

  useEffect(() => {
    setValue(dayjs().subtract(30, 'day'));
  }, []);
  

  useEffect(() => {
    const params = new URLSearchParams();

    if (value) {
      params.append("date", value.toISOString().split("T")[0]);
    }
    if (valueEnd) {
      params.append("dateEnd", valueEnd.toISOString().split("T")[0]);
    }
    if (table) {
      params.append("table", table.toString());
    }

    fetch("/api/applications?" + params)
      .then((res) => res.json())
      .then((el) => {
        setApplicationsArr(el.allFilteredSales);
        setApplicationsExcel(el.applicationsExcel)
      });
  }, [value, valueEnd]);

  const options = value;
  const columns = columnsSetsApplication[table - 1]; // Выбор набора столбцов по индексу
  const titleMain = titlesApplication[table - 1];

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setTable(value);
  };

  return (
    <section className="flex flex-col w-[100%] h-full">
      <div className="flex  md:items-start w-full  bg-white  mt-5 text-black">
        <div className="flex flex-col items-center md:items-start w-full  h-full md:w-[300px] gap-5 p-4">
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
            className={`flex  justify-center  items-center  w-[100%]  
            h-[40px]   rounded  bg-[#f15282ca]
           text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)]
           hover:bg-[#55529fc1] 
            hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)]
            focus:bg-[#55529fda] focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)]
            active:bg-[#54529F] active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] 
            px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal 
            transition duration-150 ease-in-out focus:outline-none focus:ring-0`}
            onClick={() => generateExcel2(applicationsExcel)}
          >
            Скачать
          </button>
          <h6 className="text-[8px] p-[0px] text-[#C0C0C0]">
            Файл будет содержать заявки в этом временном промежутке 
          </h6>
        </div>
      </div>
      <h1 className="flex text-[25px] w-full mt-[25px] text-black justify-center md:justify-start  ">
        {titleMain}
      </h1>
      <div className="flex flex-col w-full bg-white h-full	 mt-[10px] md:mt-[5px]">
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
          // checkboxSelection
        />
        <div className="flex flex-col mt-[5px] items-center gap-[5px]">
          <h3 className="w-fill text-[12px] text-[#C0C0C0]">Вкладки таблицы</h3>
          <Stack spacing={2}>
            <Pagination
              count={2}
              size="small"
              onChange={handleChangePage}
              variant="outlined"
              color="secondary"
            />
          </Stack>
          <h4 className="w-fill text-[8px] text-[#C0C0C0]">
            Открыта вкладка {titleMain}
          </h4>
        </div>
      </div>
    </section>
  );
}
