"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Checkbox,
  CircularProgress,
  debounce,
} from "@mui/material";
import { validateManagerId, validateManagerName, validateNewManager } from "./utils";

interface AddManagerDialogProps {
  open: boolean;
  loading: boolean;
  existingManagerIds: number[];
  onClose: () => void;
  onAdd: () => void;
  newManager: {
    manager_id: string;
    name: string;
    company_JDD_active: boolean;
  };
  setNewManager: React.Dispatch<
    React.SetStateAction<{
      manager_id: string;
      name: string;
      company_JDD_active: boolean;
    }>
  >;
}

export const AddManagerDialog: React.FC<AddManagerDialogProps> = ({
  open,
  onClose,
  onAdd,
  newManager,
  setNewManager,
  existingManagerIds,
  loading,
}) => {
  const [errors, setErrors] = useState<{ manager_id?: string; name?: string }>(
    {}
  );

  const debouncedValidateManagerId = useCallback(
    debounce((value: string) => {
      setErrors((prev) => ({
        ...prev,
        manager_id: validateManagerId(value, existingManagerIds),
      }));
    }, 400),
    [existingManagerIds]
  );

  const debouncedValidateManagerName = useCallback(
    debounce((value: string) => {
      setErrors((prev) => ({
        ...prev,
        name: validateManagerName(value),
      }));
    }, 400),
    []
  );

  const handleInputChange = (field: string, value: string) => {
    setNewManager((prev) => ({ ...prev, [field]: value }));

    if (field === "manager_id") {
      debouncedValidateManagerId(value);
    }

    if (field === "name") {
      debouncedValidateManagerName(value);
    }
  };

  const handleAdd = () => {
    const validationErrors = validateNewManager(newManager, existingManagerIds);
    setErrors(validationErrors);
    if (
      !Object.keys(validationErrors).some(
        (key) => validationErrors[key as keyof typeof validationErrors]
      )
    ) {
      onAdd();
    }
  };

  const valideSave = loading || !!errors.manager_id || !!errors.name || !newManager.name

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "500px",
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle>Добавить нового менеджера</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="ID Менеджера"
          margin="normal"
          value={newManager.manager_id}
          onChange={(e) => handleInputChange("manager_id", e.target.value)}
          error={!!errors.manager_id}
          helperText={errors.manager_id}
        />
        <TextField
          fullWidth
          label="Имя"
          margin="normal"
          value={newManager.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <div className="flex items-center mt-3">
          <Checkbox
            checked={newManager.company_JDD_active}
            onChange={(e) =>
              setNewManager({
                ...newManager,
                company_JDD_active: e.target.checked,
              })
            }
          />
          <span>Активен</span>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Отмена
        </Button>
        <Button
          onClick={handleAdd}
          color="primary"
          disabled={valideSave}
        >
          {loading ? <CircularProgress size={24} /> : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
