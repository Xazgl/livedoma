import { Pagination, Stack } from "@mui/material";
// import { useEffect, useState } from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
//   handlePageChangeNew: (event: React.ChangeEvent<unknown>, value: number) => void;
};

export function PaginationRow({ currentPage,totalPages, handlePageChange,}: Props) {

//   const [arrPages, setArrPages] = useState<number[]>([1, 2, 3, totalPages]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    handlePageChange(value)
  };

//   useEffect(() => {
//       async function start() {
//           if (totalPages > 5) {
//               if (currentPage > 1) {
//                   const newPages = [currentPage - 1, currentPage, currentPage + 1, totalPages];
//                   setArrPages(newPages)
//               }
//           } else {
//               const newPagesMini = [];
//               for (let i = 1; i < totalPages - 3; i++) {
//                   if (i >= 1 && i < totalPages) {
//                       newPagesMini.push(i);
//                   }
//               }
//               setArrPages(newPagesMini)
//           }
//       }

//       if (totalPages !== currentPage &&  totalPages - 1 !== currentPage) {
//           start()
//       } else {
//           if (totalPages == currentPage) {
//               const newPagesMini = [currentPage - 1, currentPage,];
//               setArrPages(newPagesMini)
//           } else {
//               const newPagesMini = [currentPage - 2,currentPage - 1, currentPage, currentPage + 1];
//               setArrPages(newPagesMini)
//           }
//       }

//   }, [currentPage || totalPages])

  const style = `flex  rounded w-[40px] h-[40px] justify-center  items-center text-white
     bg-[#F15281]   transition  duration-150  ease-out  cursor-pointer
     hover:ease-in  hover:bg-[black] `

  const styleArrow = `hidden sm:flex  rounded w-[90px] h-[40px] justify-center  items-center text-white
     bg-[#F15281]   transition  duration-150  ease-out  cursor-pointer
     hover:ease-in  hover:bg-[black]  text-xs  gap-[5px]`

  const styleCurrent = `flex  relative rounded w-[40px] h-[40px] justify-center  items-center
      text-white  bg-[black]
      after:absolute  after:w-[100%]  after:h-[1px]  after:bg-[black]  after:bottom-[-5px;]
      after:ease-in-out   after:duration-300   after:delay-0  `

  return (
    <>
      <div className="flex  w-full  h-[40px]  justify-center  mt-[20px]">
        {/* <div className="flex   h-full  gap-[15px]">
                {currentPage > 1 &&
                    <button
                        className={styleArrow}
                        onClick={() => handlePageChange(currentPage - 2)}
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.94976 2.74989C1.94976 2.44613 2.196 2.19989 2.49976 2.19989C2.80351 2.19989 3.04976 2.44613 3.04976 2.74989V7.2825C3.0954 7.18802 3.17046 7.10851 3.26662 7.05776L12.2666 2.30776C12.4216 2.22596 12.6081 2.23127 12.7582 2.32176C12.9083 2.41225 13 2.57471 13 2.74995V12.25C13 12.4252 12.9083 12.5877 12.7582 12.6781C12.6081 12.7686 12.4216 12.7739 12.2666 12.6921L3.26662 7.94214C3.17046 7.89139 3.0954 7.81188 3.04976 7.7174V12.2499C3.04976 12.5536 2.80351 12.7999 2.49976 12.7999C2.196 12.7999 1.94976 12.5536 1.94976 12.2499V2.74989ZM4.57122 7.49995L12 11.4207V3.5792L4.57122 7.49995Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                        Назад
                    </button>
                }
                {arrPages.map(el =>
                    <button
                        className={el == currentPage ? styleCurrent : style}
                        onClick={() => handlePageChange(el)}
                        key={el}
                    >
                        {el}
                    </button>
                )}

                {totalPages - 2 !== currentPage  &&  totalPages !== currentPage && totalPages - 1 !== currentPage  &&
                    <button
                        className={styleArrow}
                        onClick={() => handlePageChange(currentPage + 2)}
                    >
                        Далее
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.0502 2.74989C13.0502 2.44613 12.804 2.19989 12.5002 2.19989C12.1965 2.19989 11.9502 2.44613 11.9502 2.74989V7.2825C11.9046 7.18802 11.8295 7.10851 11.7334 7.05776L2.73338 2.30776C2.5784 2.22596 2.3919 2.23127 2.24182 2.32176C2.09175 2.41225 2 2.57471 2 2.74995V12.25C2 12.4252 2.09175 12.5877 2.24182 12.6781C2.3919 12.7686 2.5784 12.7739 2.73338 12.6921L11.7334 7.94214C11.8295 7.89139 11.9046 7.81188 11.9502 7.7174V12.2499C11.9502 12.5536 12.1965 12.7999 12.5002 12.7999C12.804 12.7999 13.0502 12.5536 13.0502 12.2499V2.74989ZM3 11.4207V3.5792L10.4288 7.49995L3 11.4207Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>

                    </button>
                }
            </div> */}
        <Stack spacing={24} >
          <Pagination
            page={currentPage}
            count={totalPages}
            onChange={handleChangePage}
          />
        </Stack>
      </div>
    </>
  );
}
