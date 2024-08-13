import { IconButton, InputAdornment, Slider, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { numberWithSpaces } from "../../main-block-filter/objectsCards/functionCard";
import { useTheme } from "../../provider/ThemeProvider";
import useDeb from "@/lib/hooks"; // Подключаем твой хук
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';

type Props = {
  minPrice: number;
  maxPrice: number;
  setMinPrice: Dispatch<SetStateAction<number>>;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  valueSliderPrice: [number, number];
  setValueSliderPrice: React.Dispatch<React.SetStateAction<[number, number]>>;
  resetPageAndReloadData: () => void;
};

interface SliderChangeHandler {
  (event: Event, value: number | number[], activeThumb: number): void;
}

function valuetext(value: number) {
  return `${value}₽`;
}

function debounce(wait: number) {
  let timeout: any;
  return function (func: Function) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      func();
    }, wait);
  };
}

let debounceHandler = debounce(800);

export default function RangeSlider({
  minPrice,
  maxPrice,
  valueSliderPrice,
  setValueSliderPrice,
  setMinPrice,
  setMaxPrice,
  resetPageAndReloadData,
}: Props) {

  const { theme } = useTheme();
  const [value, setValue] = React.useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [inputMin, setInputMin] = React.useState<string>(String(minPrice));
  const [inputMax, setInputMax] = React.useState<string>(String(maxPrice));

  const debouncedMinPrice = useDeb(inputMin);
  const debouncedMaxPrice = useDeb(inputMax);

  const handleChange: SliderChangeHandler = (event, newValue) => {
    setValue(newValue as [number, number]);
    setInputMin(String((newValue as [number, number])[0]));
    setInputMax(String((newValue as [number, number])[1]));
    resetPageAndReloadData();
  };

  const handleInputChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputMin(newValue);
    if (newValue === "" || Number(newValue.replace(/\D/g, "")) <= value[1]) {
      setValue([newValue === "" ? 0 : Number(newValue.replace(/\D/g, "")), value[1]]);
    }
  };

  const handleInputChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputMax(newValue);
    if (newValue === "" || Number(newValue.replace(/\D/g, "")) >= value[0]) {
      setValue([value[0], newValue === "" ? maxPrice : Number(newValue.replace(/\D/g, ""))]);
    }
  };

  useEffect(() => {
    debounceHandler(() => {
      setValueSliderPrice(value);
    });
  }, [value]);

  useEffect(() => {
    debounceHandler(() => {
      if (debouncedMinPrice === "") {
        setValue([0, value[1]]);
      } else {
        setValue([Number(debouncedMinPrice.replace(/\D/g, "")), value[1]]);
      }
    });
  }, [debouncedMinPrice]);

  useEffect(() => {
    debounceHandler(() => {
      if (debouncedMaxPrice === "") {
        setValue([value[0], maxPrice]);
      } else if (Number(debouncedMaxPrice.replace(/\D/g, "")) < value[0]) {
        setValue([value[0], value[0] + 1]);
      } else {
        setValue([value[0], Number(debouncedMaxPrice.replace(/\D/g, ""))]);
      }
    });
  }, [debouncedMaxPrice]);

  return (
    <>
      <TextField
        id="standard-basic"
        size="small"
        sx={{
          width: "50%",
          paddingRight:'2px',
          paddingLeft:'2px',
          "& .MuiInputBase-input": {
            color: theme === "dark" ? "white" : "black",
          },
          "& .MuiInputLabel-root": {
            color: theme === "dark" ? "white" : "black",
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: theme === "dark" ? "white" : "black",
            borderBottomWidth: 1,
          },
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: theme === "dark" ? "white" : "black",
            borderBottomWidth: 1,
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: theme === "dark" ? "white" : "black",
            borderBottomWidth: 1,
          },
          "& .MuiInput-underline.Mui-focused:after": {
            borderBottomColor: theme === "dark" ? "white" : "black",
            borderBottomWidth: 1,
          },
        }}
        label="Минимальная"
        variant="standard"
        value={inputMin}
        onChange={handleInputChangeMin}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CurrencyRubleIcon sx={{fontSize:'14px',color:theme === "dark" ? "white" : "black"}}/>
            </InputAdornment>
          ),
        }}      
      />

      <TextField
        id="standard-basic"
        size="small"
        sx={{
          width: "50%",
          paddingRight:'2px',
          paddingLeft:'2px',
          "& .MuiInputBase-input": {
            color: theme === "dark" ? "white" : "black",
          },
          "& .MuiInputLabel-root": {
            color: theme === "dark" ? "white" : "black",
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: theme === "dark" ? "white" : "black",
            borderBottomWidth: 1,
          },
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: theme === "dark" ? "white" : "black",
            borderBottomWidth: 1,
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: theme === "dark" ? "white" : "black",
            borderBottomWidth: 1,
          },
          "& .MuiInput-underline.Mui-focused:after": {
            borderBottomColor: theme === "dark" ? "white" : "black",
            borderBottomWidth: 1,
          },
        }}
        label="Максимальная"
        variant="standard"
        value={inputMax}
        onChange={handleInputChangeMax}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CurrencyRubleIcon sx={{fontSize:'14px',color:theme === "dark" ? "white" : "black"}}/>
            </InputAdornment>
          ),
        }} 
      />
      <div className="flex w-full justify-center mt-[5px]">
        <Slider
          sx={{
            width: "85%",
            color: theme === "dark" ? "white" : "black",
            "& .MuiSlider-thumb": {
              color: theme === "dark" ? "white" : "black",
            },
            "& .MuiSlider-track": {
              color: theme === "dark" ? "white" : "black",
            },
            "& .MuiSlider-rail": {
              color: theme === "dark" ? "#bfbfbf" : "#e0e0e0",
            },
          }}
          getAriaLabel={() => "Price range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          step={300000}
          min={minPrice}
          max={maxPrice}
        />
      </div>
    </>
  );
}


// import { Slider, TextField } from "@mui/material";
// import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { useTheme } from "../../provider/ThemeProvider";
// import useDeb from "@/lib/hooks";

// type Props = {
//   minPrice: number;
//   maxPrice: number;
//   setMinPrice: Dispatch<SetStateAction<number>>;
//   setMaxPrice: Dispatch<SetStateAction<number>>;
//   valueSliderPrice: [number, number];
//   setValueSliderPrice: React.Dispatch<React.SetStateAction<[number, number]>>;
//   resetPageAndReloadData: () => void;
// };

// interface SliderChangeHandler {
//   (event: Event, value: number | number[], activeThumb: number): void;
// }

// function valuetext(value: number) {
//   return `${value}₽`;
// }

// export default function RangeSlider({
//   minPrice,
//   maxPrice,
//   valueSliderPrice,
//   setValueSliderPrice,
//   setMinPrice,
//   setMaxPrice,
//   resetPageAndReloadData,
// }: Props) {
//   const { theme } = useTheme();
//   const sliderMin = 0; // Фиксированное минимальное значение для слайдера
//   const sliderMax = maxPrice; // Фиксированное максимальное значение для слайдера
//   const [value, setValue] = useState<[number, number]>([minPrice, maxPrice]);
//   const [inputMin, setInputMin] = useState<number | "">(minPrice);
//   const [inputMax, setInputMax] = useState<number | "">(maxPrice);

//   const debouncedMin = useDeb(inputMin.toString());
//   const debouncedMax = useDeb(inputMax.toString());

//   useEffect(() => {
//     console.log("valueSliderPrice updated:", valueSliderPrice);
//     setValue(valueSliderPrice);
//     setInputMin(valueSliderPrice[0]);
//     setInputMax(valueSliderPrice[1]);
//   }, [valueSliderPrice]);

//   useEffect(() => {
//     const newMin = debouncedMin === "" ? sliderMin : Number(debouncedMin);
//     const newMax = debouncedMax === "" ? sliderMax : Number(debouncedMax);

//     console.log("Debounced values:", { newMin, newMax });

//     if (!isNaN(newMin) && newMin <= value[1]) {
//       console.log("Setting new minPrice:", newMin);
//       setMinPrice(newMin);
//       setValueSliderPrice([newMin, value[1]]);
//       resetPageAndReloadData();
//     }

//     if (!isNaN(newMax) && newMax >= value[0]) {
//       console.log("Setting new maxPrice:", newMax);
//       setMaxPrice(newMax);
//       setValueSliderPrice([value[0], newMax]);
//       resetPageAndReloadData();
//     }
//   }, [debouncedMin, debouncedMax]);

//   const handleChange: SliderChangeHandler = (event, newValue) => {
//     if (Array.isArray(newValue)) {
//       console.log("Slider changed:", newValue);
//       setValue(newValue as [number, number]);
//       setInputMin(newValue[0]);
//       setInputMax(newValue[1]);
//     }
//   };

//   const handleInputChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.value === "" ? "" : Number(event.target.value.replace(/\D/g, ""));
//     console.log("Input min changed:", newValue);
//     setInputMin(newValue);
//     if (newValue === "" || newValue <= value[1]) {
//       setValue([newValue === "" ? 0 : newValue, value[1]]);
//     }
//   };

//   const handleInputChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.value === "" ? "" : Number(event.target.value.replace(/\D/g, ""));
//     console.log("Input max changed:", newValue);
//     setInputMax(newValue);
//     if (newValue === "" || newValue >= value[0]) {
//       setValue([value[0], newValue === "" ? sliderMax : newValue]);
//     }
//   };

//   return (
//     <>
//       <TextField
//         id="standard-basic"
//         size="small"
//         sx={{
//           width: "50%",
//           "& .MuiInputBase-input": {
//             color: theme === "dark" ? "white" : "black",
//           },
//           "& .MuiInputLabel-root": {
//             color: theme === "dark" ? "white" : "black",
//           },
//           "& .MuiInput-underline:before": {
//             borderBottomColor: theme === "dark" ? "white" : "black",
//             borderBottomWidth: 1,
//           },
//           "& .MuiInput-underline:hover:before": {
//             borderBottomColor: theme === "dark" ? "white" : "black",
//             borderBottomWidth: 1,
//           },
//           "& .MuiInput-underline:after": {
//             borderBottomColor: theme === "dark" ? "white" : "black",
//             borderBottomWidth: 1,
//           },
//           "& .MuiInput-underline.Mui-focused:after": {
//             borderBottomColor: theme === "dark" ? "white" : "black",
//             borderBottomWidth: 1,
//           },
//         }}
//         label="Минимальная"
//         variant="standard"
//         value={inputMin}
//         onChange={handleInputChangeMin}
//       />

//       <TextField
//         id="standard-basic"
//         size="small"
//         sx={{
//           width: "50%",
//           "& .MuiInputBase-input": {
//             color: theme === "dark" ? "white" : "black",
//           },
//           "& .MuiInputLabel-root": {
//             color: theme === "dark" ? "white" : "black",
//           },
//           "& .MuiInput-underline:before": {
//             borderBottomColor: theme === "dark" ? "white" : "black",
//             borderBottomWidth: 1,
//           },
//           "& .MuiInput-underline:hover:before": {
//             borderBottomColor: theme === "dark" ? "white" : "black",
//             borderBottomWidth: 1,
//           },
//           "& .MuiInput-underline:after": {
//             borderBottomColor: theme === "dark" ? "white" : "black",
//             borderBottomWidth: 1,
//           },
//           "& .MuiInput-underline.Mui-focused:after": {
//             borderBottomColor: theme === "dark" ? "white" : "black",
//             borderBottomWidth: 1,
//           },
//         }}
//         label="Максимальная"
//         variant="standard"
//         value={inputMax}
//         onChange={handleInputChangeMax}
//       />

//       <div className="flex w-full justify-center mt-[5px]">
//         <Slider
//           sx={{
//             width: "85%",
//             color: theme === "dark" ? "white" : "black",
//             "& .MuiSlider-thumb": {
//               color: theme === "dark" ? "white" : "black",
//             },
//             "& .MuiSlider-track": {
//               color: theme === "dark" ? "white" : "black",
//             },
//             "& .MuiSlider-rail": {
//               color: theme === "dark" ? "#bfbfbf" : "#e0e0e0",
//             },
//           }}
//           getAriaLabel={() => "Price range"}
//           value={value}
//           onChange={handleChange}
//           onChangeCommitted={() => {
//             console.log("Slider committed:", value);
//             setValueSliderPrice(value);
//             resetPageAndReloadData();
//           }}
//           valueLabelDisplay="auto"
//           getAriaValueText={valuetext}
//           step={50000}
//           min={sliderMin}
//           max={sliderMax}
//         />
//       </div>
//     </>
//   );
// }
