"use client"


import React, { useState } from 'react'

type ContObj = {
    count: number,
}


export const Counter = () => {

    console.log('render')
    const [answer, setAnswer] = useState<ContObj>({ count: 0 })
    const [redner, setRender] = useState(false)


    function count() {
        // answer.count++
        setAnswer({ count: answer.count + 1 }) // shallow equality
    }

    function renderFunc() {
        setRender(!redner)
    }

    return (
        <>
            <span className="border-[black] border-[solid] border-[2px] text-[black]">{answer.count}</span>
            <button onClick={count} className="border-[black] border-[solid] border-[2px] text-[black]">+1</button>
            <button onClick={renderFunc} className="border-[black] border-[solid] border-[2px] text-[black]">render</button>
        </>
    )
}