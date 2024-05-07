import { Slider, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { numberWithSpaces } from "../../main-block-filter/objectsCards/functionCard";

type Props = {
  minPrice: number;
  maxPrice: number;
  setMinPrice: Dispatch<SetStateAction<number>>;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  valueSliderPrice: [number, number];
  setValueSliderPrice: React.Dispatch<React.SetStateAction<[number, number]>>;
  resetPageAndReloadData:() => void;
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

export default function RangeSlider({minPrice,maxPrice,valueSliderPrice,setValueSliderPrice ,
 setMinPrice, setMaxPrice, resetPageAndReloadData}: Props) {

  const [value, setValue] = React.useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const handleChange: SliderChangeHandler = (event, newValue) => {
    setValue(newValue as [number, number]);
    resetPageAndReloadData()
  };

  useEffect(() => {
    debounceHandler(() => {
      // debugger
      console.log("debounceHandler");
      setValueSliderPrice(value);
    });
  }, [value]);

  return (
    <>
      <TextField
        id="standard-basic"
        size="small"
        sx={{ width: "50%" }}
        label="Минимальная"
        variant="standard"
        value={`${numberWithSpaces(valueSliderPrice[0])} ₽`}
        // onChange={(e)=>setMinPrice(e)}
      />
      <TextField
        id="standard-basic"
        size="small"
        sx={{ width: "50%" }}
        label="Максимальная"
        variant="standard"
        value={`${numberWithSpaces(valueSliderPrice[1])} ₽`}
      />
      <div className="flex w-full justify-center mt-[5px]">
        <Slider
          sx={{ width: "85%", color: "black" }}
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          step={100000}
          min={minPrice}
          max={maxPrice}
        />
      </div>
    </>
  );
}
