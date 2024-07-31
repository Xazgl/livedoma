"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { CommentsProviderProps,ThemeContextProps } from "../../../../@types/dto";

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: CommentsProviderProps) => {
  const [theme, setTheme] = useState<string>("");

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Определение начальной темы
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDarkScheme ? "dark" : "light");
    }
    setIsLoaded(true); // Устанавливаем состояние как загруженное
  }, []);

  // Сохранение темы в локальном хранилище
  useEffect(() => {
    if (theme !== '') {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
     <div className={isLoaded ? "" : "hidden"}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
