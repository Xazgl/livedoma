"use client"

import { useTheme } from "./provider/ThemeProvider";

export function Test() {
//   const [theme, setTheme] = useState("light");

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

   const { theme,toggleTheme } = useTheme();
  return (
    <>
    <button onClick={toggleTheme} className="p-2 m-4 bg-blue-500 text-white rounded">
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
      <div
        className={`${
          theme === "dark" ? "bg-theme-dark-bg" : "bg-theme-light-bg"
        } p-4`}
      >
        <button
          id="dropdownDividerButton"
          data-dropdown-toggle="dropdownDivider"
          className={`text-white ${
            theme === "dark"
              ? "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-200"
          } font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center`}
          type="button"
        >
          Dropdown divider
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <div
          id="dropdownDivider"
          className={`z-10 hidden ${
            theme === "dark"
              ? "bg-gray-700 divide-gray-600"
              : "bg-white divide-gray-100"
          } rounded-lg shadow w-44`}
        >
          <ul
            className={`py-2 text-sm ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
            aria-labelledby="dropdownDividerButton"
          >
            <li>
              <a
                href="#"
                className={`block px-4 py-2 ${
                  theme === "dark"
                    ? "hover:bg-gray-600 dark:hover:text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`block px-4 py-2 ${
                  theme === "dark"
                    ? "hover:bg-gray-600 dark:hover:text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`block px-4 py-2 ${
                  theme === "dark"
                    ? "hover:bg-gray-600 dark:hover:text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Earnings
              </a>
            </li>
          </ul>
          <div className="py-2">
            <a
              href="#"
              className={`block px-4 py-2 text-sm ${
                theme === "dark"
                  ? "text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Separated link
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
