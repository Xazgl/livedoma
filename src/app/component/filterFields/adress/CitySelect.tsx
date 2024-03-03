import {  Autocomplete, TextField, AutocompleteRenderInputParams, } from "@mui/material";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";

type Props = {
    filteblackProps: FilteblackProps;
    currentFilter: FilterUserOptions;
    setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
};

export function CitySelect({ filteblackProps, currentFilter, setCurrentFilter, }: Props) {

    const handleChange = (
        event: React.ChangeEvent<{}>,
        value: string | null
    ) => {
        setCurrentFilter((prevFilterState) => ({
            ...prevFilterState,
            city: value ? [value] : undefined,
        }));
    };

    const filterOptions = (
        options: string[],
        { inputValue }: { inputValue: string }
    ) => {
        return options.filter(
            (option) =>
                option.toLowerCase().includes(inputValue.toLowerCase()) &&
                inputValue.length >= 3
        );
    };


    const getOptionLabel = (option: string) => option;

    const renderInput = (params: AutocompleteRenderInputParams) => (
        <TextField {...params} label="Выберите город" />
    );

    return (
        <Autocomplete
            sx={{ width: "100%" }}
            id="street-autocomplete"
            options={filteblackProps.cities}
            value={currentFilter.city ? currentFilter.city[0] : null}
            onChange={handleChange}
            renderInput={renderInput}
            filterOptions={filterOptions}
            isOptionEqualToValue={(option, value) =>
                option.toLowerCase() === (value || "").toLowerCase()
            }
            getOptionLabel={getOptionLabel}
            noOptionsText={currentFilter.city && currentFilter.city.length === 0 ? "Введите город" : "Нет вариантов"}
        />
    );
}
