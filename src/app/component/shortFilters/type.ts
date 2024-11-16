import { Dispatch, SetStateAction } from "react";
import { FilteblackProps, FilterUserOptions,    allObjects,} from "../../../../@types/dto";
import { ObjectIntrum } from "../../../../prisma";

export type Props = {
  objects: allObjects;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  setFilteredHouse: Dispatch<SetStateAction<ObjectIntrum[]>>;
  filteredHouse: ObjectIntrum[];
  maxPrice: number;
  minPrice: number;
  setMinPrice: Dispatch<SetStateAction<number>>;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  filteblackProps: FilteblackProps;
  valueSliderPrice: [number, number];
  setValueSliderPrice: Dispatch<SetStateAction<[number, number]>>;
  countObjects: number;
  resetPageAndReloadData: () => void;
  isVisibleFilter: boolean;
  setIsVisibleFilter: Dispatch<SetStateAction<boolean>>;
};
