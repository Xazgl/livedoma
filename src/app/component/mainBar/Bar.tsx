
import "server-only"
import { useEffect, useState } from "react";
import styles from "./bar.module.css";
import { DateBar } from "./dateBar/DateBar";
import { Dollar } from "./valute/Dollar";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export function Bar({ }) {



  // const id = 'R01235'
  // const valuteObj  = await (await fetch(process.env.HOST + '/api/valute/' + id , {method: 'GET'})).json()




  return <header className={styles.bar}>


    {/* левый компонент   */}
    <div className={styles.logo}>ЛОГО</div>

    {/* средние 4  компонента  */}
    <div className="hidden lg:flex w-full items-center sm:gap-4  sm:h-25 lg:gap-20 lg:h-36" >

      {/* Дата*/}
      <div className={styles.inputDiv}>
        <div className={styles.inputDivDisc}>
          <div className={styles.valuteSymbol}>
            <CalendarTodayIcon />
          </div>
        </div>

        <div className={styles.inputDesc}>
          <DateBar />
        </div>
      </div>


      {/* $ */}
      <div className={styles.inputDiv} id={styles.firstInputDiv}>
        <div className={styles.inputDivDisc}>
          <div className={styles.valuteSymbol}>
            $
          </div>
        </div>
        <div className={styles.inputDesc}><Dollar /></div>
      </div>

      {/* евро */}
      <div className={styles.inputDiv}>
        <div className={styles.inputDivDisc}>
          <div className={styles.valuteSymbol}>
            €
          </div>
        </div>
        <div className={styles.inputDesc}>104.61</div>
      </div>

      {/*  B */}
      <div className={styles.inputDiv}>
        <div className={styles.inputDivDisc}>
          <div className={styles.valuteSymbol}>
            ₿
          </div>
        </div>
        <div className={styles.inputDesc}>25.725</div>
      </div>
    </div>


    {/* правые 2компонента  */}
    <div className="flex items-center gap-3">

      <div className="w-9 h-9 relative bg-black rounded-full overflow-hidden cursor-pointer">
        <div className="flex items-center justify-center h-full">
          <svg className="w-6 h-6 text-white" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>

      <div className="w-9 h-9 relative bg-black rounded-full overflow-hidden cursor-pointer">
        <div className="flex items-center justify-center h-full">
          <svg className="w-6 h-6 text-white" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.0749 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>

    </div>

  </header >
}