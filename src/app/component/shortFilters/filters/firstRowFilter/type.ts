import { FilteblackProps, FilterUserOptions } from "../../../../../../@types/dto";

export type FilterConfigProps = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: React.Dispatch<React.SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData: () => void;
};
