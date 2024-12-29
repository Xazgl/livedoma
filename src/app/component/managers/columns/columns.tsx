"use client";

import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Checkbox, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ColumnProps {
  handleStatusChange: (managerId: string, newStatus: boolean) => void;
  openDeleteConfirmation: (managerId: string) => void;
}

export const getColumns = ({
  handleStatusChange,
  openDeleteConfirmation,
}: ColumnProps): GridColDef[] => [
  { field: "manager_id", headerName: "ID Intrum",  flex: 1 },
  { field: "name", headerName: "ФИО",flex: 1  },
  {
    field: "company_JDD_active",
    headerName: "Заявки ЖДД",
    flex: 1,
    renderCell: (params) => (
      <Checkbox
        checked={params.row.company_JDD_active}
        onChange={(e) => handleStatusChange(params.row.id, e.target.checked)}
      />
    ),
  },
  {
    field: "delete",
    headerName: "Удалить",

    headerAlign: "right", 
    align: "right",
    renderCell: (params) => (
      <IconButton
        onClick={() => openDeleteConfirmation(params.row.id)}
        color="error"
        sx={{ "&:hover": { backgroundColor: "#f44336", color: "white" } }}
      >
        <DeleteIcon />
      </IconButton>
    ),
  },
];
