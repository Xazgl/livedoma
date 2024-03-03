"use client"
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import { useSelector, useDispatch, Provider, TypedUseSelectorHook } from 'react-redux'

const counterSlice = createSlice({
    // actions types: 'counter/inc', 'counter/dec', 'counter/incByAmount'
    name: 'counter',
    initialState: {
        value: 0
    },
    reducers: {
        inc: state => {
            // Immer.js
            state.value += 1
        },
        dec: state => {
            state.value -= 1
        },
        incByAmount(state, action: PayloadAction<number>) {
            state.value += action.payload
        }
    }
})

const { dec, inc, incByAmount } = counterSlice.actions

const store = configureStore({
    reducer: {
        counter: counterSlice.reducer
    }
})

// TS
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
const useAppDispatch: () => AppDispatch = useDispatch

function Child() {
    const count = useAppSelector((state) => state.counter)
    const dispatch = useAppDispatch()
    return (
        <>
            <div className="border-[black] border-[solid] border-[2px] text-[black]">{count.value}</div>
            <button onClick={() => dispatch(inc())} className="border-[black] border-[solid] border-[2px] text-[black]">+</button>
            <button onClick={() => dispatch(dec())} className="border-[black] border-[solid] border-[2px] text-[black]">-</button>
            <button onClick={() => dispatch(incByAmount(10))} className="border-[black] border-[solid] border-[2px] text-[black]">10</button>
            {/* <form >
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
            </form> */}
        </>
    )
}

export function TestReduxNew() {
    return (
        <Provider store={store}>
            <Child />
        </Provider>
    )
}

