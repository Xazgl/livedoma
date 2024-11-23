import { Dispatch, SetStateAction } from "react";
import {
  FilteblackProps,
  FilterUserOptions,
} from "../../../../../../@types/dto";

export type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData: () => void;
};
