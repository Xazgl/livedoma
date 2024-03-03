import { ObjectIntrum } from "@prisma/client"
import { FilterUserOptions } from "../../../../../@types/dto"
//тут будут функции где мы проверям внутри объекта фильтро, кокретное поле [] на его длинну



export function categoryFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.category?.length) {
        return currentFilter.category.includes(object.category)
    }
    return true
}

export function operationTypeFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.operationType?.length) {
        return currentFilter.operationType.includes(object.operationType)
    }
    return true
}

export function stateFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.state?.length) {
        return currentFilter.state.includes(object.state? object.state : '' )
    }
    return true
}


export function cityFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.city?.length) {
        return currentFilter.city.includes(object.city? object.city: '' )
    }
    return true
}


export function streetFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.street?.length) {
        return currentFilter.street.includes(object.street? object.street: '' )
    }
    return true
}



export function priceFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    const price = object.price ? Number(object.price) : 0;

    if (currentFilter.minPrice !== undefined && currentFilter.maxPrice !== undefined) {
        return price >= currentFilter.minPrice && price <= currentFilter.maxPrice;
    }

    if (currentFilter.minPrice !== undefined) {
        return price >= currentFilter.minPrice;
    }

    if (currentFilter.maxPrice !== undefined) {
        return price <= currentFilter.maxPrice;
    }

    return true;
}


export function companyNameFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.companyName?.length) {
        return currentFilter.companyName.includes(object.companyName? object.companyName: '' )
    }
    return true
}

export function passengerElevatorFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.passengerElevator?.length) {
        return currentFilter.passengerElevator.includes(object.passengerElevator? object.passengerElevator: '' )
    }
    return true
}


export function freightElevatorFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.freightElevator?.length) {
        return currentFilter.freightElevator.includes(object.freightElevator? object.freightElevator: '' )
    }
    return true
}

export function ceilingHeightFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.ceilingHeight?.length) {
        return currentFilter.ceilingHeight.includes(object.ceilingHeight? object.ceilingHeight: '' )
    }
    return true
}

export function renovationFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.renovation?.length) {
        return currentFilter.renovation.includes(object.renovation? object.renovation: '' )
    }
    return true
}

export function roomsFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.rooms?.length) {
        return currentFilter.rooms.includes(object.rooms? object.rooms: '' )
    }
    return true
}


export function squareFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.square?.length) {
        return currentFilter.square.includes(object.square? object.square: '' )
    }
    return true
}


export function floorsFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.floors?.length) {
        return currentFilter.floors.includes(object.floors? object.floors: '' )
    }
    return true
}


export function floorFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.floor?.length) {
        return currentFilter.floor.includes(object.floor? object.floor: '' )
    }
    return true
}


export function wallsTypeFilter(object: ObjectIntrum, currentFilter: FilterUserOptions) {
    if (currentFilter.wallsType?.length) {
        return currentFilter.wallsType.includes(object.wallsType? object.wallsType: '' )
    }
    return true
}






