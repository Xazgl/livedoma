import { checkTheme } from "@/shared/utils";
import { useCallback, useEffect } from "react";

export function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  onOutsideClick: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onOutsideClick]);
}

/**
 * Возвращает мемоизированную функцию переключения состояния аккордеона.
 * @param setIsExpanded - функция для обновления состояния аккордеона.
 */
/**
 * Хук для создания мемоизированной функции переключения состояния аккордеона.
 * @param setIsExpanded - функция для обновления состояния аккордеона.
 * @returns Меморизированная функция переключения.
 */
export const useToggleAccordion = (
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, [setIsExpanded]);
};

export const accordionContentStyles = (theme: string) => ({
  position: "absolute",
  zIndex: 1000,
  padding: 0,
  maxHeight: "150px",
  minWidth: "100%",
  overflowY: "auto",
  bgcolor: checkTheme(theme, "#3a3f46c9", "rgba(255, 255, 255, .7)"),
  color: checkTheme(theme, "white", "black"),
  marginTop: "5px",
});


export const accordionContainerStyles = (theme: string) => ({
  position: "relative",
  width: "100%",
  bgcolor: checkTheme(theme, "#3a3f46c9", "rgba(255, 255, 255, .7)"),
  color: checkTheme(theme, "white", "black"),
  borderRadius: "8px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  overflow: "visible",
});


export const accordionHeaderStyles = (isExpanded: boolean) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 16px",
  cursor: "pointer",
  borderBottom: isExpanded ? "1px solid rgba(0, 0, 0, 0.1)" : "none",
});
