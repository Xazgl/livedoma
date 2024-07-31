"use client";
import React from "react";
import { useTheme } from "../provider/ThemeProvider";
import { CommentsProviderProps } from "../../../../@types/dto";
import styles from "./page.module.css";

export const BodyComp = ({ children }: CommentsProviderProps) => {
  const { theme } = useTheme();

  return (
    <div
      style={{ transition: "all 0.5s" }}
      className={`${styles.background} ${
        theme === "dark" ? styles.darkBackground : styles.lightBackground
      }`}
    >
      <div
        style={{ transition: "all 0.5s" }}
        className={`${styles.content} ${
          theme === "dark" ? styles.darkContent : styles.lightContent
        }`}
      >
        {children}
      </div>
    </div>
  );
};
