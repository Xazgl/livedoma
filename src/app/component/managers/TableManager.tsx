"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { ActiveManagers } from "@prisma/client";
import axios from "axios";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchManagers, statusChange } from "./utils";
import { getColumns } from "./columns/columns";
import { DeleteConfirmationDialog } from "./modals/DeleteModal";
import { AddManagerDialog } from "./modals/AddManager";

type Props = {
  managersAll: ActiveManagers[];
};

export default function TableManager({ managersAll }: Props) {
  const [managers, setManagers] = useState<ActiveManagers[]>(managersAll);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newManager, setNewManager] = useState({
    manager_id: "",
    name: "",
    company_JDD_active: true,
  });
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(
    null
  );

  const openDeleteConfirmation = (managerId: string) => {
    setSelectedManagerId(managerId);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
    setSelectedManagerId(null);
  };

  const handleStatusChange = async (managerId: string, newStatus: boolean) => {
    const res = await statusChange(managerId, newStatus);
    if (res?.data.success) {
      fetchManagers(setManagers);
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
        }
        closeDeleteConfirmation();
        setLoading(false);
      } catch (error) {
        console.error("Error deleting manager:", error);
      }
    }
  };

  const handleAddManager = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/managers-add", newManager);
      if (res.data.success) {
        fetchManagers(setManagers);
      }
      setOpenAddDialog(false);
      setLoading(false);
    } catch (error) {
      console.error("Error adding new manager:", error);
    }
  };

  const columns = getColumns({ handleStatusChange, openDeleteConfirmation });

  const existingManagerIds = useMemo(
    () => managers.map((manager) => Number(manager.manager_id)),
    [managers]
  );

  return (
    <section className="flex flex-col w-[100%] h-full">
      <div className="flex w-full bg-white mt-5 text-black justify-between items-center px-4">
        <h3 className="text-[16px] p-[0px]">Менеджеры</h3>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Добавить
        </Button>
      </div>

      <div className="flex flex-col w-full bg-white h-full mt-[10px] md:mt-[5px]">
        {loading ? (
          <div className="flex w-full h-[100vh] items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <DataGrid
            sx={{ height: "100%" }}
            rows={managers || []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[managers?.length]}
          />
        )}
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
    </section>
  );
}
