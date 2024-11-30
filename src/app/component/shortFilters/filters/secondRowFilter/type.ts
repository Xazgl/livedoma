import { Dispatch, SetStateAction } from "react";


export type Props = {
    loading: boolean;
    minPrice: number;
    maxPrice: number;
    setMinPrice: Dispatch<SetStateAction<number>>;
    setMaxPrice: Dispatch<SetStateAction<number>>;
    resetPageAndReloadData: () => void;
    filteblackProps: any;
    currentFilter: any;
    setCurrentFilter: (filter: any) => void;
    valueSliderPrice: [number, number];
    setValueSliderPrice: Dispatch<SetStateAction<[number, number]>>;
};
