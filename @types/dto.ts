import { ObjectIntrum } from "@prisma/client"

export type FilterUserOptions = {
    category?: string[]
    operationType?: string[]
    state?: string[]
    city?: string[]
    street?: string[]
    minPrice?: number
    maxPrice?: number
    companyName?: string[]
    passengerElevator?: string[]
    freightElevator?: string[]
    ceilingHeight?: string[]
    renovation?: string[]
    rooms?: string[]
    square?: string[]
    floors?: string[]
    floor?: string[]
    wallsType?: string[]
}




export type allObjects = ObjectIntrum[];


export type FilteblackProps = {
    categories: string[]
    operationTypes: string[]
    states: string[]
    cities: string[]
    streets: string[]
    companyNames: string[]
    passengerElevators: string[]
    freightElevators: string[]
    ceilingHeight: string[]
    renovationTypes: string[]
    rooms: string[]
    square: string[]
    floors: string[]
    floor: string[]
    wallsTypes: string[]
}