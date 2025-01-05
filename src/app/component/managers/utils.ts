import { ActiveManagers } from "@prisma/client";
import axios from "axios";

export const fetchManagers = async (
  setManagers: React.Dispatch<React.SetStateAction<ActiveManagers[]>>
) => {
  try {
    const response = await axios.get(`/api/managers`);
    setManagers(response.data.managers);
  } catch (error) {
    console.error("Error fetching managers", error);
  }
};

export const statusChange = async (managerId: string, newStatus: boolean) => {
  try {
    return await axios.put(`/api/managers-active`, {
      managerId,
      company_JDD_active: newStatus,
    });
  } catch (error) {
    console.error("Error updating manager status", error);
  }
};

export const errorMessage = (error: any): string => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Произошла неизвестная ошибка"
  );
};


export const customLocaleText = {
  columnMenuSortAsc: "Сортировать по возрастанию",
  columnMenuSortDesc: "Сортировать по убыванию",
  columnMenuFilter: "Фильтр",
  columnMenuHideColumn: "Скрыть колонку",
  columnMenuUnsort: "Сбросить сортировку",
};
