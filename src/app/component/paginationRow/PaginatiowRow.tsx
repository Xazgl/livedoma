"use client";
import React from 'react';
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { useTheme } from '../provider/ThemeProvider';


type Props = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

export function PaginationRow({ currentPage, totalPages, handlePageChange }: Props) {
  const { theme } = useTheme();
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    handlePageChange(value);
  };

  const renderItem = (item: any) => {
    if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
      return null;
    }
    return (
      <PaginationItem
        {...item}
      />
    );
  };

  return (
    <div className="flex w-full h-[40px] justify-center mt-[20px]">
      <Stack spacing={24}>
        <Pagination
          page={currentPage}
          count={totalPages}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          renderItem={renderItem}
          siblingCount={1}
          boundaryCount={1}
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              transition: 'all 1s',
              '&:hover': {
                backgroundColor: '#55529fbd',
                color: 'white',
                opacity: 1,
              },
              '&.Mui-selected': {
                backgroundColor: '#55529fbd',
                color: 'white',
              },
              '&:not(.Mui-selected):not(:hover)': {
                backgroundColor: theme === 'dark' ? 'transition' :  'black',
                color: theme === 'dark' ?  'white' : 'white',
                opacity: 1,
                borderColor:theme === 'dark' ?  'white' : 'transparent'
              },
              '@media (max-width: 540px)': {
                minWidth: '28px',
                height: '35px',
                fontSize: '0.80rem',
                marginTop: '10px'
              },
              '@media (max-width: 420px)': {
                minWidth: '35px',
                height: '25px',
                fontSize: '0.75rem',
              },
              '@media (max-width: 370px)': {
                minWidth: '25px',
                height: '20px'
              },
            },
          }}
        />
      </Stack>
    </div>
  );
}
