import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import { useTheme } from "../../provider/ThemeProvider";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
};

export function Floor({ filteblackProps, currentFilter, setCurrentFilter }: Props) {
  const { theme } = useTheme();

  // Функция сортировки с учетом чисел и текста
  const sortOptions = (options: string[]) => {
    const numeric = options.filter((item) => !isNaN(Number(item))).sort((a, b) => Number(a) - Number(b));
    const text = options.filter((item) => isNaN(Number(item))).sort();
    return [...numeric, ...text];
  };

  // Подготовка данных
  const floorOptions = sortOptions(
    filteblackProps.floor.map((floor) => (floor.trim() === "" ? "Не указан" : floor.trim()))
  );

  const floorsOptions = sortOptions(
    filteblackProps.floors.map((floors) => (floors.trim() === "" ? "Не указан" : floors.trim()))
  );

  // Разделение на два столбца
  const splitIntoColumns = (array: string[], columns: number) => {
    const result: string[][] = Array.from({ length: columns }, () => []);
    array.forEach((item, index) => {
      result[index % columns].push(item);
    });
    return result;
  };

  const floorsColumns = splitIntoColumns(floorsOptions, 2);
  const floorColumns = splitIntoColumns(floorOptions, 2);

  return (
    <div className="flex flex-col w-full gap-[5px]">
      <Accordion
        sx={{
          width: "100%",
          bgcolor: theme === "dark" ? "#3a3f467a" : "white",
          color: theme === "dark" ? "white" : "black",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: theme === "dark" ? "white" : "#0000008a" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ fontSize: "14px" }}>
            <MapsHomeWorkIcon /> 
            {" "}
          {currentFilter.floors?.length
            ? currentFilter.floor?.length? `Этажей: ${currentFilter.floors.join(", ")}, Этаж:${currentFilter.floor.join(", ")}` : `Этажей: ${currentFilter.floors.join(", ")}`
            : "Этаж"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Фильтр: Этажей всего */}
          <Typography
            sx={{
              color: theme === "dark" ? "white" : "black",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Этажей всего
          </Typography>
          <Grid container spacing={2} justifyContent="space-between">
            {floorsColumns.map((column, colIndex) => (
              <Grid
                item
                xs={6}
                key={`column-${colIndex}`}
                sx={colIndex === 1 ? { textAlign: "right" } : {}}
              >
                <FormGroup>
                  {column.map((floors) => (
                    <FormControlLabel
                      key={floors}
                      control={
                        <Checkbox
                          sx={{ color: theme === "dark" ? "white" : "black" }}
                          checked={currentFilter.floors?.includes(floors) || false}
                          onChange={() => {
                            setCurrentFilter((prevFilterState) => {
                              const updatedFloors = prevFilterState.floors?.includes(floors)
                                ? prevFilterState.floors.filter((flr) => flr !== floors)
                                : [...(prevFilterState.floors ?? []), floors];
                              return { ...prevFilterState, floors: updatedFloors };
                            });
                          }}
                        />
                      }
                      // label={floors}
                      label={
                        <Typography
                          sx={{
                            whiteSpace: "nowrap", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                          }}
                        >
                          {floors}
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>
              </Grid>
            ))}
          </Grid>

          {/* Фильтр: Конкретный этаж */}
          {currentFilter.floors &&
            currentFilter.floors.length > 0 &&
            currentFilter.category &&
            currentFilter.category[0] !== "Дома, дачи, коттеджи" && (
              <>
                <Typography
                  sx={{
                    color: theme === "dark" ? "white" : "black",
                    marginTop: "16px",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Этаж
                </Typography>
                <Grid container spacing={2} justifyContent="space-between">
                  {floorColumns.map((column, colIndex) => (
                    <Grid
                      item
                      xs={6}
                      key={`floor-column-${colIndex}`}
                      sx={colIndex === 1 ? { textAlign: "right" } : {}}
                    >
                      <FormGroup>
                        {column.map((floor) => (
                          <FormControlLabel
                            key={floor}
                            control={
                              <Checkbox
                                sx={{ color: theme === "dark" ? "white" : "black" }}
                                checked={currentFilter.floor?.includes(floor) || false}
                                onChange={() => {
                                  setCurrentFilter((prevFilterState) => {
                                    const updatedFloor = prevFilterState.floor?.includes(floor)
                                      ? prevFilterState.floor.filter((flr) => flr !== floor)
                                      : [...(prevFilterState.floor ?? []), floor];
                                    return { ...prevFilterState, floor: updatedFloor };
                                  });
                                }}
                              />
                            }
                            // label={floor}
                            label={
                              <Typography
                                sx={{
                                  whiteSpace: "nowrap", 
                                  overflow: "hidden", 
                                  textOverflow: "ellipsis", 
                                }}
                              >
                                {floor}
                              </Typography>
                            }
                          />
                        ))}
                      </FormGroup>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
