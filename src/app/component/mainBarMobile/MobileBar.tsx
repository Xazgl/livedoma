"use client";
import Link from "next/link";
import Image from "next/image";
import { NavEl, logoArr } from "../header/navEl";
import * as React from "react";
import {
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "../provider/ThemeProvider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export function MobileHeader({}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { theme, toggleTheme } = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="w-[100%] md:hidden h-[50px] ">
      <div
        style={{
          backgroundColor: theme === "dark" ? "#3a3f4635" : "#000000d1",
          color: "white",
          margin: "1px",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "5px",
        }}
      >
        <div className="flex  gap-4 items-center pl-[20px] ">
          {logoArr.map((el, index) => (
            <React.Fragment key={el.key}>
              <Image
                src={el.img}
                width={45}
                height={45}
                sizes="100vh"
                alt={el.img}
                className="flex"
              />
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
          sx={{ color: "white", width: "40px" }}
        >
          <MenuIcon />
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
                backgroundColor: "#000000d1",
                color: "white",
                display: "flex",
                flexDirection: "row-reverse",
              },
            },
          }}
        >
          {NavEl.map((item, index) => (
            <MenuItem key={index} onClick={handleClose}>
              <Link href={item.src} passHref>
                <span className="text-[white]">{item.title}</span>
              </Link>
            </MenuItem>
          ))}
          <MenuItem>
            <a href="tel:+78442520505" className="flex w-[auto] mt-1">
              <button
                type="button"
                style={{ transition: "all 1s" }}
                className="text-white border-[2px] border-[#563D82] hover:bg-[#3d295f] focus:ring-4 focus:outline-none focus:ring-purple-300 font-bold rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 dark:border-bg-[#563D82] dark:hover:bg-[#563D82] dark:focus:ring-bg-[#563D82]"
              >
                8 (8442) 52-05-05
              </button>
            </a>
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              sx={{ fontSize: "16px" }}
              control={
                <Switch
                  onChange={toggleTheme}
                  color="secondary"
                  sx={{
                    "& .MuiSwitch-switchBase:hover": {
                      backgroundColor: "transparent",
                    },
                    "& .MuiSwitch-switchBase:active": {
                      backgroundColor: "transparent",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#54529F",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: "white",
                    },
                    "& .MuiSwitch-thumb": {
                      backgroundColor: "white",
                    },
                  }}
                />
              }
              label={
                <div className="flex items-center">
                  {theme === "light" ? (
                     <LightModeIcon
                     sx={{
                       color: "#e9e979",
                       filter: "drop-shadow(0 0 10px rgba(255, 223, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 223, 0, 0.6))",
                     }}
                   />
                 ) : (
                   <DarkModeIcon
                     sx={{
                       color: "white",
                       filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
                     }}
                   />
                  )}
                </div>
              }
            />
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}
