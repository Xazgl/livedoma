import jd from "/public/images/logo/jd.png"
import metr from "/public/images/logo/metr.png"
import part from "/public/images/logo/part.png"
import vladis from "/public/images/logo/vladis.webp"



export type LogoArr = {
    name: string
    img: string,
}

export const LogoList: LogoArr[] = [
    {
        name: 'АН Живем дома',
        img: `${jd.src}`
    },
    {
        name: 'Агенство "Партнер"',
        img: `${part.src}`
    },
    {
        name: 'Агенство "Метры"',
        img: `${metr.src}`
    },
    {
        name: 'Владис',
        img: `${vladis.src}`
    },

]


export function logoFind(str:string) {
    if (LogoList.find(logo => logo.name.toLowerCase() === str.toLowerCase() )) {
        const imgLogo = LogoList.find(logo => logo.name.toLowerCase() === str.toLowerCase()) ?.img
        return imgLogo !== undefined ? imgLogo : ''
    }
}



export function numberWithSpaces(x:number | string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


