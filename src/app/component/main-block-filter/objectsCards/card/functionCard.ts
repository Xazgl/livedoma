// import jd from "/public/images/logo/jd.png"
// import metr from "/public/images/logo/metr.png"
// import part from "/public/images/logo/part.png"
// import vladis from "/public/images/logo/vladis.webp"


import jd from "/public/images/cardLogo/card_jd.png"
import metr from "/public/images/cardLogo/card_metrs.png"
import part from "/public/images/cardLogo/card_partner.png"
import vladis from "/public/images/cardLogo/card_vladis.png"
import sansara from "/public/images/cardLogo/sansara.png"



export type LogoArr = {
    name: string
    img: string,
}

export const LogoList: LogoArr[] = [
    {
        name: 'Живем дома',
        img: `${jd.src}`,
    },	
    {
        name: 'Агентство "Партнер"',
        img: `${part.src}`
    },
    {
        name: 'Партнер',
        img: `${part.src}`
    },
    {
        name: 'Партнер Недвижимость',
        img: `${part.src}`
    },
    {
        name: 'Метры',
        img: `${metr.src}`
    },
    {
        name: 'Метры Недвижимость' ,
        img: `${metr.src}`
    },
    {
        name: 'Владис',
        img: `${vladis.src}`
    },
    {
        name: 'ЖК Сансара',
        img: `${sansara.src}`
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

export function getRoomsEnding(roomsStr: string ): string {

    const rooms:number = parseInt(roomsStr, 10); // Преобразование строки в число
    if (isNaN(rooms)) {
        return '';
    }
    // Последняя цифра числа комнат
    const lastDigit = rooms % 10;
    
    // Предпоследняя цифра числа комнат
    const penultimateDigit = Math.floor(rooms / 10) % 10;
  
    // Правила для окончаний
    const endings: { [key: number]: string } = {
      1: 'комната',
      2: 'комнаты',
      3: 'комнаты',
      4: 'комнаты',
      5: 'комнат',
      6: 'комнат',
      7: 'комнат',
      8: 'комнат',
      9: 'комнат',
      0: 'комнат'
    };
  
    // Особое правило для чисел, оканчивающихся на 11-19
    if (penultimateDigit === 1) {
      return 'комнат';
    }
  
    // Возвращаем правильное окончание
    return endings[lastDigit];
}


