"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { useTheme } from "../../provider/ThemeProvider";
import { operationTypeNormalize } from "./utils";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData: () => void;
};

export function OperationTypeSelect({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();
  return (
    <Accordion
      defaultExpanded={false}
      slotProps={{ transition: { timeout: 0 } }}
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
          <WysiwygIcon />{" "}
          {currentFilter.operationType?.length
            ? operationTypeNormalize(currentFilter.operationType[0])
            : "Тип объявления"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex  flex-col  w-full  justify-start ">
          {Array.from(
            new Set(
              filteblackProps.operationTypes?.filter((type) => type !== "")
            )
          ).map((type) =>
            type !== "" ? (
              <FormControlLabel
                key={type}
                control={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      color="default"
                      sx={{ color: theme === "dark" ? "white" : "black" }}
                      checked={currentFilter.operationType?.includes(type)}
                    />
                  </Box>
                }
                label={operationTypeNormalize(type)}
                onClick={() => {
                  setCurrentFilter((prevFilterState) => {
                    return {
                      ...prevFilterState,
                      operationType: prevFilterState?.operationType
                        ? prevFilterState.operationType.includes(type)
                          ? prevFilterState.operationType.filter(
                              (el) => el !== type
                            )
                          : [...(prevFilterState.operationType ?? []), type]
                        : [type],
                    };
                  });
                  resetPageAndReloadData();
                }}
              />
            ) : null
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
