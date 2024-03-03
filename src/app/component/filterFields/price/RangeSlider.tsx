import { Slider, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { numberWithSpaces } from '../../main-block-filter/objectsCards/functionCard';

type Props = {
    minPrice: number;
    maxPrice: number;
    valueSliderPrice: [number, number];
    setValueSliderPrice: React.Dispatch<React.SetStateAction<[number, number]>>;
}


function valuetext(value: number) {
    return `${value}₽`;
}

function debounce(wait: number) {
    let timeout;
    return function(func: Function) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            func()
        }, wait);
    }
}

let debounceHandler = debounce(800)

export default function RangeSlider({ minPrice, maxPrice, valueSliderPrice, setValueSliderPrice }: Props) {
    const [value, setValue] = React.useState<[number, number]>([minPrice, maxPrice]);



    const handleChange = (event: Event, newValue: [number, number]) => {
       setValue(newValue)
    };


    useEffect(() => {
        debounceHandler(() => {
            // debugger
            console.log('debounceHandler');
            setValueSliderPrice(value);
        })

    }, [value])

    return (
        <>

            <TextField id="standard-basic"
                size='small'
                sx={{ width: '50%' }}
                label="Минимальная" variant="standard" value={`${numberWithSpaces(valueSliderPrice[0])} ₽`} />
            <TextField id="standard-basic"
                size='small'
                sx={{ width: '50%' }}
                label="Максимальная" variant="standard" value={`${numberWithSpaces(valueSliderPrice[1])} ₽`} />
            <Slider
              sx={{ color: 'black' }}
                getAriaLabel={() => 'Temperature range'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                step={100000}
                min={minPrice}
                max={maxPrice}
            />
        </>
    );
}

