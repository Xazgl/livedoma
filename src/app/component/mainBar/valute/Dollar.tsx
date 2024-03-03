'use client'
import { useEffect, useState } from "react";

export function Dollar({ }) {
    const [valuteObj, setValuteObj] = useState('');

    useEffect(() => {
        async function start() {
            const id = 'R01235'
            const res = await fetch('/api/valute/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (res.ok) {
                let valueObj = await res.json()
                let stringValue = valueObj.valute.value;
                let numberValue = parseFloat(stringValue.replace(',', '.'));
                let roundedNumber = numberValue.toFixed(2);
                setValuteObj(roundedNumber)
            }
        }
        start()
    }, []);
    return <>{valuteObj}</>
}