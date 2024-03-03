
'use client'

import { useEffect, useState } from "react";

export function DateBar({ }) {

    const [currentDate, setCurrentDate] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // Обновляем каждую секунду

        return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
    }, []);

    const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()]; // Получаем день недели

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    
    return <>
        {dayOfWeek}, {day < 10 ? '0' + day : day}.{month < 10 ? '0' + month : month}.{year}
    </>
}  