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
import {  FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import HouseIcon from "@mui/icons-material/House";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
};

export function CategoriesCheckbox({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
}: Props) {
  return (
    <Accordion defaultExpanded={false} sx={{ width: "100%" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontSize: "14px" }}>
          <HouseIcon /> Категория{" "}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        
        <div className="flex  flex-col  w-full  justify-start ">
          {filteblackProps.categories.map((category) => (
            category !=='' ?
            <FormControlLabel
              key={category}
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
                    checked={currentFilter.category?.includes(category)}
                  />
                  {/* <Avatar
                                                        sx={{ width: '60px', marginLeft: '10px' }}
                                                        aria-label="brand"
                                                        src={modelPhotoFind(ModelPhotoList, model)}
                                                    /> */}
                </Box>
              }
              label={ 
                category === "Гаражи и машиноместа" ?
                "Гаражи" 
                :
               (category === "Коммерческая недвижимость" ? "Коммерческая" : category) 
              }
              onClick={() => {
                setCurrentFilter((prevFilterState) => {
                  return {
                    ...prevFilterState,
                    category: prevFilterState?.category
                      ? prevFilterState.category.includes(category)
                        ? prevFilterState.category.filter(
                            (el) => el !== category
                          )
                        : [...(prevFilterState.category ?? []), category]
                      : [category],
                  };
                });

                // setCurrentFilter(prevFilterState => {
                //     if (prevFilterState.category ? prevFilterState.category.includes(category) : null) {
                //         return {
                //             ...prevFilterState,
                //             category:
                //                 prevFilterState.category ? prevFilterState.category.filter(el => el !== category) : []
                //         };
                //     }
                //     return { ...prevFilterState, category: [...prevFilterState.category ? prevFilterState.category : [], category] };
                // });
              }}
            />
            : null 

          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );

  // logoFind(object.companyName)
}
