import { useTheme } from "../../provider/ThemeProvider";

export const NoObjects: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="flex w-full h-[40vh] justify-center items-center">
      <h2
        className={`
          font-semibold
          text-sm    
          sm:text-base   
          md:text-xl   
          xl:text-2xl    
          ${theme === "dark" ? "text-white" : "text-black"}
        `}
      >
        По&nbsp;вашему запросу ничего не&nbsp;найдено
      </h2>
    </div>
  );
};
