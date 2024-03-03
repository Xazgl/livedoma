"use client"

import { useReducer } from "react";

const ActionTypes = {
    first: 'first/edit',
    second: 'second/edit',
    third: 'third/edit',
}

//action creator => action
const editFirst = (payload: string) => ({
    type: ActionTypes.first,
    payload
})

const editSecond = (payload: string) => ({
    type: ActionTypes.second,
    payload
})

const editThird = (payload: string) => ({
    type: ActionTypes.third,
    payload
})

export function Test() {
    
    const [state, dispatch] = useReducer(
        //reducer функция
        (state, action) => {
            switch (action.type) {
                case ActionTypes.first:
                    return { ...state, first: action.payload }
                case ActionTypes.second:
                    return { ...state, second: action.payload }
                case ActionTypes.third:
                    return { ...state, third: action.payload }
            }
        },
        //начальные state
        {
            first: '',
            second: '',
            third: '',
        })

    return (
        <>
            <form >
                <input className="border-[black] border-[solid] border-[2px] text-[black]"
                    value={state.first}
                    onChange={(event) => {
                        dispatch(editFirst(event.target.value))
                    }}
                >
                </input>

                <input
                    className="border-[black] border-[solid] border-[2px] text-[black]"
                    value={state.second}
                    onChange={(event) => {
                        dispatch(editSecond(event.target.value))
                    }}>
                </input>

                <input
                    className="border-[black] border-[solid] border-[2px] text-[black]"
                    value={state.third}
                    onChange={(event) => {
                        dispatch(editThird(event.target.value))
                    }}>
                </input>

                <button type="submit" className="border-[black] border-[solid] border-[2px] text-[black]">Send</button>
            </form>

        </>
    )

}