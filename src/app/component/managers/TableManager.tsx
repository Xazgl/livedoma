"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { ActiveManagers } from "@prisma/client";
import axios from "axios";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  customLocaleText,
  errorMessage,
  fetchManagers,
  statusChange,
} from "./utils";
import { getColumns } from "./columns/columns";
import { DeleteConfirmationDialog } from "./modals/DeleteModal";
import AddManagerDialog from "./modals/AddManager";
import ToastNotification from "./toast/Toast";
import { styleForTableManager } from "./tableStylesForManager";
import { useTheme } from "../provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";

type Props = {
  managersAll: ActiveManagers[];
};

export type NewManager = {
  manager_id: string;
  name: string;
  company_JDD_active: boolean;
};

export default function TableManager({ managersAll }: Props) {
  const { theme } = useTheme();
  const [toast, setToast] = React.useState({
    open: false,
    message: "",
    status: "",
  });
  const [managers, setManagers] = useState<ActiveManagers[]>(managersAll);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newManager, setNewManager] = useState<NewManager>({
    manager_id: "",
    name: "",
    company_JDD_active: true,
  });
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(
    null
  );

  const resetForm = () => {
    setNewManager({
      manager_id: "",
      name: "",
      company_JDD_active: true,
    });
  };

  const openDeleteConfirmation = (managerId: string) => {
    setSelectedManagerId(managerId);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
    setSelectedManagerId(null);
  };

  const handleStatusChange = async (managerId: string, newStatus: boolean) => {
    try {
      const res = await statusChange(managerId, newStatus);
      if (res?.data.success) {
        setToast({ open: true, message: res.data.message, status: "success" });
        fetchManagers(setManagers);
      }
    } catch (error) {
      setToast({ open: true, message: errorMessage(error), status: "error" });
    }
  };

  const handleDelete = async () => {
    if (selectedManagerId) {
      try {
        setLoading(true);
        const res = await axios.delete("/api/managers-delete", {
          data: { managerId: selectedManagerId },
        });
        if (res.data.success) {
          fetchManagers(setManagers);
          setLoading(false);
          closeDeleteConfirmation();
          setToast({
            open: true,
            message: res.data.message,
            status: "success",
          });
        }
      } catch (error) {
        setToast({ open: true, message: errorMessage(error), status: "error" });
        closeDeleteConfirmation();
        setLoading(false);
      }
    }
  };

  const handleAddManager = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/managers-add", newManager);
      if (res.data.success) {
        fetchManagers(setManagers);
        setLoading(false);
        setOpenAddDialog(false);
        resetForm();
        setToast({ open: true, message: res.data.message, status: "success" });
      }
    } catch (error) {
      setToast({ open: true, message: errorMessage(error), status: "error" });
    }
  };

  const columns = getColumns({ handleStatusChange, openDeleteConfirmation });

  const existingManagerIds = useMemo(
    () => managers.map((manager) => Number(manager.manager_id)),
    [managers]
  );

  const closeToast = () => setToast({ open: false, message: "", status: "" });

  return (
    <section className="flex flex-col w-[100%]  h-full">
      <div className="flex w-full  mt-5  justify-between items-center px-5">
        <h3
          className={`flex items-center h-[60px] text-[20px] p-[0px] ${checkTheme(theme, "text-white", "text-dark")} `}
        >
          Прием заявок ЖДД
        </h3>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Добавить
        </Button>
      </div>

      <div
        className={`flex flex-col w-full h-full ${
          checkTheme(theme, "bg-[transparent]", "bg-white")}`}
      >
        <DataGrid
          sx={styleForTableManager(theme).root}
          rows={managers || []}
          columns={columns}
          localeText={customLocaleText}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[managers?.length]}
          disableColumnResize
        />
      </div>

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={closeDeleteConfirmation}
        onDelete={handleDelete}
      />

      <AddManagerDialog
        loading={loading}
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={handleAddManager}
        newManager={newManager}
        setNewManager={setNewManager}
        existingManagerIds={existingManagerIds}
      />

      <ToastNotification
        open={toast.open}
        message={toast.message}
        status={toast.status}
        onClose={closeToast}
      />
    </section>
  );
}
