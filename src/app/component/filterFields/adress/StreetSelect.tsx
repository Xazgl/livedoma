import { Autocomplete, TextField, AutocompleteRenderInputParams, } from "@mui/material";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import SignpostIcon from '@mui/icons-material/Signpost';

type Props = {
    filteblackProps: FilteblackProps;
    currentFilter: FilterUserOptions;
    setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
};

export function StreetSelect({ filteblackProps, currentFilter, setCurrentFilter, }: Props) {

    const handleChange = (
        event: React.ChangeEvent<{}>,
        value: string | null
    ) => {
        setCurrentFilter((prevFilterState) => ({
            ...prevFilterState,
            street: value ? [value] : undefined,
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
        <TextField {...params} label={<span className="text-black"> <SignpostIcon/> Адрес </span>} />
    );

    return (
        <Autocomplete
            sx={{ width: "100%", background:'white', border:'none'}}
            id="street-autocomplete"
            options={filteblackProps.streets}
            value={currentFilter.street ? currentFilter.street[0] : null}
            onChange={handleChange}
            renderInput={renderInput}
            filterOptions={filterOptions}
            isOptionEqualToValue={(option, value) =>
                option.toLowerCase() === (value || "").toLowerCase()
            }
            getOptionLabel={getOptionLabel}
            noOptionsText={currentFilter.street && currentFilter.street.length === 0 ? "Вводите" : "Нет вариантов"}
        />

    );
}
