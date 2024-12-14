import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import { useTheme } from "../../provider/ThemeProvider";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
};

export function Renovation({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
}: Props) {
  const { theme } = useTheme();

  const renovationOptions = filteblackProps.renovationTypes
    .map((renovation) =>
      renovation.trim() === "" ? "Не указан" : renovation.trim()
    )
    .sort((a, b) => {
      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));

      if (isANumber && isBNumber) {
        return Number(a) - Number(b);
      } else if (isANumber) {
        return -1;
      } else if (isBNumber) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });

  return (
    <Accordion
      sx={{
        width: "100%",
        bgcolor: theme === "dark" ? "#3a3f467a" : "white",
        color: theme === "dark" ? "white" : "black",
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{ color: theme === "dark" ? "white" : "#0000008a" }}
          />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontSize: "14px" }}>
          <FormatPaintIcon />  {" "}
          {currentFilter.renovation?.length
            ? `Ремонт: ${currentFilter.renovation.join(", ")}`
            : "Ремонт"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex flex-col w-full justify-start">
          {renovationOptions.length > 0 ? (
            <FormGroup>
              {renovationOptions.map((renovation) => (
                <FormControlLabel
                  key={renovation}
                  control={
                    <Checkbox
                      sx={{ color: theme === "dark" ? "white" : "black" }}
                      color="default"
                      checked={
                        currentFilter.renovation?.includes(renovation) || false
                      }
                      onChange={() => {
                        setCurrentFilter((prevFilterState) => {
                          const updatedRenovations = prevFilterState?.renovation
                            ? prevFilterState.renovation.includes(renovation)
                              ? prevFilterState.renovation.filter(
                                  (el) => el !== renovation
                                )
                              : [
                                  ...(prevFilterState.renovation ?? []),
                                  renovation,
                                ]
                            : [renovation];
                          return {
                            ...prevFilterState,
                            renovation: updatedRenovations,
                          };
                        });
                      }}
                    />
                  }
                  label={renovation}
                />
              ))}
            </FormGroup>
          ) : (
            <Typography sx={{ color: theme === "dark" ? "white" : "black" }}>
              Нет доступных вариантов ремонта
            </Typography>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
