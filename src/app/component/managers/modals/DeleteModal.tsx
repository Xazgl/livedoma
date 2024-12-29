"use client";

import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Подтверждение удаления</DialogTitle>
      <DialogContent>
        Вы уверены, что хотите удалить этого менеджера?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Отмена
        </Button>
        <Button onClick={onDelete} color="error">
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
