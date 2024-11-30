import { Box, Typography, Checkbox, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FilteblackProps,
  FilterUserOptions,
} from "../../../../../../@types/dto";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import StoreIcon from "@mui/icons-material/Store";
import { useTheme } from "../../../provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";
import React from "react";
import {
  accordionContainerStyles,
  accordionContentStyles,
  accordionHeaderStyles,
  useOutsideClick,
  useToggleAccordion,
} from "@/app/component/shortFilters/filters/utils";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData: () => void;
};

function FilterCompany({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = useToggleAccordion(setIsExpanded);

  const handleCompanyToggle = (companyName: string) => {
    setCurrentFilter((prev) => {
      const isSelected = prev.companyName?.includes(companyName);
      const updatedCompanies = isSelected
        ? prev.companyName?.filter((name) => name !== companyName)
        : [...(prev.companyName || []), companyName];
      return { ...prev, companyName: updatedCompanies };
    });
    toggleAccordion();
  };

  const selectedCompanies = useMemo(() => {
    const selected = currentFilter.companyName || [];
    return selected.length > 0 ? selected.join(", ") : "Компании";
  }, [currentFilter.companyName]);

  useOutsideClick(accordionRef, () => setIsExpanded(false));

  return (
    <Box ref={accordionRef} sx={accordionContainerStyles(theme)}>
      {/* Заголовок аккордеона */}
      <Box onClick={toggleAccordion} sx={accordionHeaderStyles(isExpanded)}>
        <Typography
          sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
        >
          <StoreIcon sx={{ marginRight: "8px", fontSize: "19px" }} />
          {selectedCompanies}
        </Typography>
        <ExpandMoreIcon
          sx={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
            transition: "0.3s",
          }}
        />
      </Box>

      {/* Контент аккордеона */}
      {isExpanded && (
        <AccordionDetails sx={accordionContentStyles(theme)}>
          <div className="flex flex-col w-full justify-start">
            {filteblackProps.companyNames?.map((companyName) => (
              <Box
                key={companyName}
                onClick={() => handleCompanyToggle(companyName)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2px 16px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: checkTheme(theme, "#4a4f567a", "#f0f0f0"),
                  },
                }}
              >
                <Checkbox
                  color="default"
                  checked={currentFilter.companyName?.includes(companyName)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: "14px" },
                    color: checkTheme(theme, "white", "black"),
                  }}
                />
                <Typography sx={{ marginLeft: "8px", fontSize: "0.875rem" }}>
                  {companyName === 'Агентство "Партнер"'
                    ? "Партнер"
                    : companyName}
                </Typography>
              </Box>
            ))}
          </div>
        </AccordionDetails>
      )}
    </Box>
  );
}

export default React.memo(FilterCompany);
