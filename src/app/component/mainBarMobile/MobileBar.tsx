import Link from "next/link";
import Image from "next/image";
import { NavEl, logoArr } from "../header/navEl";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TuneIcon from '@mui/icons-material/Tune';


export function MobileHeader({}) {
  return (
    <header className="w-[100%]  md:hidden">
      <Accordion
        sx={{
          backgroundColor: "#54529F",
          color: "white",
          margin: "1px",
          width: "100%",
          height: "100%",
        }}
      >
        <AccordionSummary
          expandIcon={<TuneIcon sx={{ color: "white", width: "40px" }} />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="hidden sm:flex  gap-4  w-[100%] h-[30px] md:h-[60px] items-center ">
            {logoArr.map((el, index) => (
              <>
                <Image
                  key={el.key}
                  src={el.img}
                  width={60}
                  height={60}
                  sizes="100vh"
                  alt={el.img}
                  className="flex "
                />
                {index !== logoArr.length - 1 && (
                  <div className="flex w-[2px] h-[34px]  border-l-[2px] border-solid border-white border-opacity-20" />
                )}
              </>
            ))}
          </div>

          <div className="flex sm:hidden gap-2  w-[100%] h-[30px] md:h-[50px] items-center ">
            {logoArr.map((el, index) => (
              <>
                <Image
                  key={el.key}
                  src={el.img}
                  width={40}
                  height={40}
                  sizes="100vh"
                  alt={el.img}
                  className="flex "
                />
                {index !== logoArr.length - 1 && (
                  <div className="flex w-[2px] h-[34px]  border-l-[2px] border-solid border-white border-opacity-20" />
                )}
              </>
            ))}
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ width: "100%" }}>
          <nav className="flex flex-col  w-[100%] ">
            <ul className="flex flex-col gap-1">
              {NavEl.map((item, index) => (
                <Link key={index} href={item.src}>
                  <li key={index}>{item.title}</li>
                </Link>
              ))}
            </ul>

            <a href="tel:+78442520505" className="flex w-[auto] mt-1">
              <button className="bg-[#F15281] rounded-lg h-[28px] px-[11px] py-[3px] text-white  text-[14px]">
                8 (8442) 52-05-05
              </button>
            </a>
          </nav>
        </AccordionDetails>
      </Accordion>
    </header>
  );
}
