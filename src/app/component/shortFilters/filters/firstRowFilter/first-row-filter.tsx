"use client";
import CityFilter from "../../../filterFields/adress/new/CitySelect";
import FilterCategories from "../../../filterFields/categories/new/CategoriesCheckbox";
import FilterRooms from "../../../filterFields/rooms/new/Rooms";
import React from "react";
import { FilterConfigProps } from "./type";
import OperationTypeSelectDesktop from "@/app/component/filterFields/operationType/new/OperationTypeSelectDesktop";
import FilterCompany from "@/app/component/filterFields/company/new/FilterCompany";

export const getFilterConfig = ({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: FilterConfigProps) => {
  return [
    {
      key: "operationType",
      component: (
        <OperationTypeSelectDesktop
          key={"operationType"}
          filteblackProps={filteblackProps}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          resetPageAndReloadData={resetPageAndReloadData}
        />
      ),
      isVisible:
        filteblackProps.operationTypes?.filter((type) => type.trim() !== "")
          .length > 0,
    },
    {
      key: "city",
      component: (
        <CityFilter
          key={"city"}
          filteblackProps={filteblackProps}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          resetPageAndReloadData={resetPageAndReloadData}
        />
      ),
      isVisible:
        filteblackProps.cities?.filter((cit) => cit.trim() !== "").length > 0,
    },
    {
      key: "category",
      component: (
        <FilterCategories
          key={"category"}
          filteblackProps={filteblackProps}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          resetPageAndReloadData={resetPageAndReloadData}
        />
      ),
      isVisible:
        filteblackProps.categories?.filter((categor) => categor.trim() !== "")
          .length > 0,
    },
    {
      key: "rooms",
      component: (
        <FilterRooms
          key={"rooms"}
          filteblackProps={filteblackProps}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          resetPageAndReloadData={resetPageAndReloadData}
        />
      ),
      isVisible:
        filteblackProps.rooms?.filter((room) => room.trim() !== "").length > 0,
    },
    {
      key: "company",
      component: (
        <FilterCompany
          filteblackProps={filteblackProps}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          resetPageAndReloadData={resetPageAndReloadData}
        />
      ),
      isVisible:
        filteblackProps.companyNames?.filter((company) => company.trim() !== "").length > 0,
    },
  ];
};
