"use client";
import { InputLabel, MenuItem, Pagination, Select, Stack } from "@mui/material";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Sales } from "@prisma/client";
import { generateExcel } from "@/lib/excelFunc";
import { columnsSets, titles } from "./myFilter";

type Props = {
  sales: Sales[];
  uniqueDateStages: (string | null)[];
  formattedYesterday: string;
};

type FilterUserOptions = {
  dateStage: string[];
};

export function TableFirst({sales,uniqueDateStages,formattedYesterday,}: Props) {
  const [transactions, setTransactions] = useState<Sales[]>(sales);

  //Конкретные выбранные фильтры
  const [currentFilter, setCurrentFilter] = useState<FilterUserOptions>({
    dateStage: [],
  });

  const [table, setTable] = useState(1);
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setTable(value);
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (currentFilter.dateStage) {
      currentFilter.dateStage.forEach((dateStage) => {
        params.append("dateStage", dateStage);
      });
    }

    fetch("/api/transactions?" + params)
      .then((res) => res.json())
      .then((el) => {
        // setCountObjects(el.countObjects);
        // setAllPages(el.totalPages);
        setTransactions(el.allFilteredSales);
      });
  }, [currentFilter]);

  const options = currentFilter.dateStage;
  const columns = columnsSets[table - 1]; // Выбор набора столбцов по индексу
  const titleMain = titles[table - 1];

  return (
    <section className="flex flex-col w-[100%] h-[100vh]">
      <div className="flex  md:items-start w-full  bg-white  mt-5 text-black">
        <div className="flex flex-col items-center md:items-start w-full  h-full md:w-[300px] gap-5 p-4">
         <h3 className="text-[12px] p-[0px]">Выберите дату от</h3>
          <Select
            sx={{
              display: "flex",
              minWidth: "100%",
              color: "black",
              marginTop: "0px",
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            placeholder="Выберите дату"
            value={currentFilter.dateStage ?? []}
            label={``}
            onChange={(event) => {
              const selectedDateStage = event.target.value as string;
              setCurrentFilter((prevFilterState) => {
                const updatedDateStage = prevFilterState.dateStage?.includes(
                  selectedDateStage
                )
                  ? prevFilterState.dateStage.filter(
                      (datStage) => datStage !== selectedDateStage
                    )
                  : [...(prevFilterState.dateStage ?? []), selectedDateStage];
                return {
                  ...prevFilterState,
                  dateStage: updatedDateStage,
                };
              });
            }}
          >
            {uniqueDateStages?.length > 0 &&
              (options?.length > 0
                ? options.map((datStage) => (
                    <MenuItem key={datStage ?? ""} value={datStage ?? ""}>
                      {datStage ?? ""}
                    </MenuItem>
                  ))
                : uniqueDateStages.sort().reverse().map((datStage) => (
                    <MenuItem key={datStage ?? ""} value={datStage ?? ""}>
                      {datStage ?? ""}
                    </MenuItem>
                  )))}
          </Select>
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
            onClick={() => generateExcel(transactions)}
          >
            Скачать
          </button>
          <h6 className="text-[8px] p-[0px] text-[#C0C0C0]">Файл будет содержать сделки от даты выше</h6>
        </div>
      </div>
      <h1 className="flex text-[25px] w-full mt-[25px] text-black justify-center md:justify-start  ">
        {titleMain}
      </h1>
      <div className="flex flex-col w-full bg-white  mt-[10px] md:mt-[5px]">
        <DataGrid
          sx={{ height: "auto"}}
          rows={transactions}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[transactions.length]}
          disableRowSelectionOnClick={true}
          // checkboxSelection
        />
        <div className="flex flex-col mt-[5px] items-center gap-[5px]">
          <h3 className="w-fill text-[12px] text-[#C0C0C0]">Вкладки таблицы</h3>
          <Stack spacing={2}>
            <Pagination
              count={6}
              size="small"
              onChange={handleChangePage}
              variant="outlined" 
              color="secondary"
            />
          </Stack>
          <h4 className="w-fill text-[8px] text-[#C0C0C0]">Открыта вкладка {titleMain}</h4>
        </div>
      </div>
   
    </section>
  );
}
