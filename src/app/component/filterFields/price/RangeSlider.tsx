import { InputAdornment,TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { numberWithSpaces } from "../../main-block-filter/objectsCards/card/functionCard";
import { useTheme } from "../../provider/ThemeProvider";
import useDeb from "@/lib/hooks"; 
import CurrencyRubleIcon from "@mui/icons-material/CurrencyRuble";


type Props = {
  minPrice: number;
  maxPrice: number;
  setMinPrice: Dispatch<SetStateAction<number>>;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  valueSliderPrice: [number, number];
  setValueSliderPrice: React.Dispatch<React.SetStateAction<[number, number]>>;
  resetPageAndReloadData: () => void;
};


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

const useStylesMy = (theme: string) => ({
  textField: {
    width: "100%",
    paddingRight: "2px",
    paddingLeft: "2px",
    "& .MuiInputBase-input": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiInputLabel-root": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .Mui-focused": {
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
  },
  currencyIcon: {
    fontSize: "14px",
    color: theme === "dark" ? "white" : "black",
  },
});

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
  const myStyles = useStylesMy(theme);

  const [value, setValue] = React.useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [inputMin, setInputMin] = React.useState<string>(String(minPrice));
  const [inputMax, setInputMax] = React.useState<string>(String(maxPrice));

  const debouncedMinPrice = useDeb(inputMin);
  const debouncedMaxPrice = useDeb(inputMax);

  const handleInputChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/\s/g, "");
    if (isNaN(Number(newValue))) return; 
    setInputMin(newValue);
    if (newValue === "" || Number(newValue) <= value[1]) {
      setValue([newValue === "" ? 0 : Number(newValue), value[1]]);
    }
  };

  const handleInputChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/\s/g, "");
    if (isNaN(Number(newValue))) return;
    setInputMax(newValue); 
    if (newValue === "" || Number(newValue) >= value[0]) {
      setValue([value[0], newValue === "" ? maxPrice : Number(newValue)]);
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
        setValue([Number(debouncedMinPrice.replace(/\s/g, "")), value[1]]);
      }
    });
  }, [debouncedMinPrice]);

  useEffect(() => {
    debounceHandler(() => {
      if (debouncedMaxPrice === "") {
        setValue([value[0], maxPrice]);
      } else if (Number(debouncedMaxPrice.replace(/\s/g, "")) < value[0]) {
        setValue([value[0], value[0] + 1]);
      } else {
        setValue([value[0], Number(debouncedMaxPrice.replace(/\s/g, ""))]);
      }
    });
  }, [debouncedMaxPrice]);

  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <TextField
          id="standard-basic"
          size="medium"
          sx={myStyles.textField}
          label="От"
          variant="standard"
          value={numberWithSpaces(inputMin)}
          onChange={handleInputChangeMin}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CurrencyRubleIcon
                  sx={{
                    fontSize: "14px",
                    color: theme === "dark" ? "white" : "black",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          id="standard-basic"
          size="medium"
          sx={myStyles.textField}
          label="До"
          variant="standard"
          value={numberWithSpaces(inputMax)} 
          onChange={handleInputChangeMax}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CurrencyRubleIcon
                  sx={{
                    fontSize: "14px",
                    color: theme === "dark" ? "white" : "black",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </>
  );
}