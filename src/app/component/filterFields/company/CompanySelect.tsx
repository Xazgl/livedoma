import { Accordion, AccordionDetails, AccordionSummary, Box, Select, Typography, MenuItem, Input, Chip, FormControlLabel, FormGroup, Checkbox } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import StoreIcon from '@mui/icons-material/Store';
import { useTheme } from "../../provider/ThemeProvider";

type Props = {
    filteblackProps: FilteblackProps,
    currentFilter: FilterUserOptions,
    setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>,
    resetPageAndReloadData:() => void
}

export function CompanySelect({ filteblackProps, currentFilter, setCurrentFilter,
 resetPageAndReloadData }: Props) {
    const { theme} = useTheme();
    return <>
        <Accordion 
            sx={{
             width: "100%",
             bgcolor: theme === "dark" ? "#3a3f467a" : "white",
             color: theme === "dark" ? "white" : "black"
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon  sx={{ color: theme === "dark" ? "white" : "#0000008a"  }}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography sx={{ fontSize: '14px' }}><StoreIcon/>Компании</Typography>
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
                                            sx={{color: theme === "dark" ? "white" : "black"}}
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
                                                resetPageAndReloadData ()
                                            }}
                                        />
                                    }
                                    label={companyName == 'Агентство "Партнер"'? 'Партнер' : companyName}
                                />
                            ))}
                        </FormGroup>
                    ) : null}
                </div>
            </AccordionDetails>
        </Accordion>

    </>
};