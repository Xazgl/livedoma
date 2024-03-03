"use client"

import { useEffect, useReducer, useState } from "react"
import { createStore, combineReducers } from 'redux'
import { useSelector, useDispatch, Provider } from 'react-redux'

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
//начальные state
const initialState = {
    first: '',
    second: '',
    third: '',
}
//reducer функция - clear function
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.first:
            return { ...state, first: action.payload }
        case ActionTypes.second:
            return { ...state, second: action.payload }
        case ActionTypes.third:
            return { ...state, third: action.payload }
        default:
            return state
    }
}

const store = createStore(combineReducers({
    input: reducer
}))

function Form() {
    // const state = useSelector((state) => state)
    // const dispatch = useDispatch()
    // event drive dev (+redis)
    const [, rerender] = useState(0)
    useEffect(() => {
      const un = store.subscribe(() => {
        console.log('subscribe');        
        rerender(_ => _ + 1)
      })
      return () => un()
    }, [])
    
    const dispatch = (action) => {
        store.dispatch(action)        
    }
    const state = store.getState()
    
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

export function TestRedux() {
    return (
        <Provider store={store}>
            <Form />
        </Provider>
    )
}

