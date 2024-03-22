import { Accordion, AccordionDetails, AccordionSummary, Box, Select, Typography, MenuItem, Input, Chip, FormControlLabel, FormGroup, Checkbox } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import StoreIcon from '@mui/icons-material/Store';

type Props = {
    filteblackProps: FilteblackProps,
    currentFilter: FilterUserOptions,
    setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>,
}

export function CompanySelect({ filteblackProps, currentFilter, setCurrentFilter }: Props) {

    return <>
        <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography sx={{ fontSize: '14px' }}><StoreIcon/> База собственников</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div className="flex flex-col w-full justify-start">
                    {filteblackProps.companyNames ? (
                        <FormGroup>
                            {filteblackProps.companyNames.map((companyName) => (
                                <FormControlLabel
                                    key={companyName}
                                    control={
                                        <Checkbox
                                            color="default"
                                            checked={currentFilter.companyName?.includes(companyName) || false}
                                            onChange={() => {
                                                setCurrentFilter((prevFilterState) => {
                                                    const updatedCompanies = prevFilterState?.companyName
                                                        ? prevFilterState.companyName.includes(companyName)
                                                            ? prevFilterState.companyName.filter((el) => el !== companyName)
                                                            : [...(prevFilterState.companyName ?? []), companyName]
                                                        : [companyName];
                                                    return { ...prevFilterState, companyName: updatedCompanies };
                                                });
                                            }}
                                        />
                                    }
                                    label={companyName}
                                />
                            ))}
                        </FormGroup>
                    ) : null}
                </div>
            </AccordionDetails>
        </Accordion>

    </>
};