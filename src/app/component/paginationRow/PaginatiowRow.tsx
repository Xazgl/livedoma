import React from 'react';
import { Pagination, PaginationItem, Stack } from "@mui/material";

type Props = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

export function PaginationRow({ currentPage, totalPages, handlePageChange }: Props) {
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
        sx={{
          color: 'black',
          backgroundColor: 'black',
          transition: 'all 1s',
          '&:hover': {
            backgroundColor: '#55529fbd',
            color: 'white',
          },
          '&.Mui-selected': {
            backgroundColor: '#55529fbd',
            color: 'white',
          },
          '@media (max-width: 540px)': {
            minWidth: '28px',
            height: '28px',
            fontSize: '0.75rem',
            marginTop: '10px'
          },
          '@media (max-width: 420px)': {
            minWidth: '25px',
            height: '25px',
            fontSize: '0.70rem',
          },
          '@media (max-width: 370px)': {
            minWidth: '20px',
            height: '20px'
          },
        }}
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
                backgroundColor: 'black',
                color: 'white',
                opacity: 1,
              },
              '@media (max-width: 540px)': {
                minWidth: '28px',
                height: '28px',
                fontSize: '0.75rem',
                marginTop: '10px'
              },
              '@media (max-width: 420px)': {
                minWidth: '25px',
                height: '25px',
                fontSize: '0.70rem',
              },
              '@media (max-width: 370px)': {
                minWidth: '20px',
                height: '20px'
              },
            },
          }}
        />
      </Stack>
    </div>
  );
}
