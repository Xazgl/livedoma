"use client"

import Link from "next/link";
import Image from "next/image";
import { NavEl, logoArr } from "../header/navEl";
import * as React from "react";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
import TuneIcon from '@mui/icons-material/Tune';
import { IconButton, Menu, MenuItem } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';


export function MobileHeader({}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="w-[100%] md:hidden h-[50px] ">
      <div style={{  backgroundColor: '#000000d1',
         color: 'white', margin: '1px', width: '100%', height: '100%', 
         display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius:'5px'}}>
        <div className="flex  gap-4 items-center pl-[20px] ">
          {logoArr.map((el, index) => (
            <React.Fragment key={el.key}>
              <Image src={el.img} width={45} height={45} sizes="100vh" alt={el.img} className="flex" />
              {index !== logoArr.length - 1 && (
                <div className="flex w-[2px] h-[34px] border-l-[1px] border-solid border-white border-opacity-20" />
              )}
            </React.Fragment>
          ))}
        </div>
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          sx={{ color: 'white', width: '40px' }}
        >
          <MenuIcon  />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                backgroundColor: '#000000d1',
                color: 'white',
                display: 'flex',
                flexDirection: 'row-reverse',
              }
            }
          }}
        >
          {NavEl.map((item, index) => (
            <MenuItem key={index} onClick={handleClose}>
              <Link href={item.src} passHref>
              <span className="text-[white]">{item.title}</span>
                {/* <a style={{ color: 'white', textDecoration: 'none' }}>{item.title}</a> */}
              </Link>
            </MenuItem>
          ))}
          <MenuItem>
            <a href="tel:+78442520505" className="flex w-[auto] mt-1">
              <button
                type="button"
                style={{ transition: 'all 1s' }}
                className="text-white border-[2px] border-[#563D82] hover:bg-[#3d295f] focus:ring-4 focus:outline-none focus:ring-purple-300 font-bold rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 dark:border-bg-[#563D82] dark:hover:bg-[#563D82] dark:focus:ring-bg-[#563D82]"
              >
                8 (8442) 52-05-05
              </button>
            </a>
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}