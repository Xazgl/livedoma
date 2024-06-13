"use client";

import React, { useState, useEffect } from "react";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SignpostIcon from "@mui/icons-material/Signpost";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FilterInparseOptions,
  FilterInparseProps,
  FilterUserOptions,
} from "../../../../../@types/dto";
import { InparseObjects } from "@prisma/client";

export function ParserFind() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPages, setAllPages] = useState("");
  const [countObjects, setCountObjects] = useState("");
  const [filteredHouse, setFilteredHouse] = useState<InparseObjects[]>();

  const changeFilter = (filter: FilterUserOptions) => {
    setCurrentFilter((prevFilterState) => {
      return { ...prevFilterState, ...filter };
    });
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  //Конкретные выбранные фильтры
  const [currentFilter, setCurrentFilter] = useState<FilterInparseOptions>({
    street: [],
  });

  //Конкретные выбранные фильтры
  const [filteblackProps, setFilteblackProps] = useState<FilterInparseProps>({
    streets: [],
  } as {
    streets: string[];
  });

  useEffect(() => {
    const params = new URLSearchParams();
    //параметры запроса к api для фильтра
    if (currentFilter.street) {
      currentFilter.street.forEach((street) => {
        params.append("street", street);
      });
    }
    if (currentPage) {
      params.append("page", String(currentPage));
    }
    window.history.replaceState(null, "", `${pathname}?${params}`);

    fetch("/api/inparseobjects/?" + params)
      .then((res) => res.json())
      .then((el) => {
        setCountObjects(el.countObjects);
        setAllPages(el.totalPages);
        setFilteredHouse(el.allObjects);
        setFilteblackProps((prevFilterState) => {
          return {
            ...prevFilterState,
            streets: el.filter.street,
          };
        });
      });
    console.log(filteblackProps);
  }, [currentFilter, currentPage]);

  const filterOptions = ( options: string[],{ inputValue }: { inputValue: string }) => {
    return options.filter(
      (option) =>
        option.toLowerCase().includes(inputValue.toLowerCase()) && inputValue.length >= 3
    );
  };

  const getOptionLabel = (option: string) => option;

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      label={
        <span className="text-black">
          {" "}
          <SignpostIcon /> Адрес{" "}
        </span>
      }
    />
  );

  const handleChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setCurrentFilter((prevFilterState) => ({
      ...prevFilterState,
      street: value ? [value] : undefined,
    }));
  };

  // useEffect(() => {
  //   setFilteredHouse(
  //     objects.filter((object) => {
  //       return (
  //         categoryFilter(object, currentFilter) &&
  //         operationTypeFilter(object, currentFilter) &&
  //         stateFilter(object, currentFilter) &&
  //         cityFilter(object, currentFilter) &&
  //         streetFilter(object, currentFilter) &&
  //         priceFilter(object, currentFilter) &&
  //         companyNameFilter(object, currentFilter) &&
  //         passengerElevatorFilter(object, currentFilter) &&
  //         freightElevatorFilter(object, currentFilter) &&
  //         ceilingHeightFilter(object, currentFilter) &&
  //         renovationFilter(object, currentFilter) &&
  //         roomsFilter(object, currentFilter) &&
  //         squareFilter(object, currentFilter) &&
  //         floorsFilter(object, currentFilter) &&
  //         floorFilter(object, currentFilter) &&
  //         wallsTypeFilter(object, currentFilter)
  //       );
  //     })
  //   );
  // }, [currentFilter]);

  return (
    <section className="flex flex-col w-full h-[100vh]">
      <div className="flex flex-col mt-[10px] w-full items-center sm:items-start">
        <Autocomplete
          sx={{ width: "100%", background: "white", border: "none" }}
          id="street-autocomplete"
          options={filteblackProps.streets || []}
          value={currentFilter.street ? currentFilter.street[0] : null}
          onChange={handleChange}
          renderInput={renderInput}
          filterOptions={filterOptions}
          isOptionEqualToValue={(option, value) =>
            option.toLowerCase() === (value || "").toLowerCase()
          }
          getOptionLabel={getOptionLabel}
          noOptionsText={
            currentFilter.street && currentFilter.street.length === 0
              ? "внесите адрес"
              : "Нет вариантов"
          }
        />
      </div>
    </section>
  );
}
