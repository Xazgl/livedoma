"use client";

import { useState } from "react";
import axios from "axios";
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import { extractPhonesFromFile } from "./utils"; 
import { useTheme } from "../../provider/ThemeProvider";
import { ToastState } from "../../../../../@types/dto";

export default function UsersForMailingUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message: string, severity: ToastState["severity"]) =>
    setToast({ open: true, message, severity });
  const { theme } = useTheme();

  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = /\.(xlsx|xls|csv)$/i.test(file.name);
    if (!valid) {
      showToast("Поддерживаются файлы .xlsx / .xls / .csv", "error");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("Прикрепите файл.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const phonesWithType = await extractPhonesFromFile(selectedFile);
      const response = await axios.post("/api/import-users", {
        phones: phonesWithType,
      });
      const created = response.data?.inserted ?? 0;
      const updated = response.data?.updated ?? 0;
      showToast(`Импорт завершён: добавлено ${created}`, "success");
      setSelectedFile(null);
      const input = document.getElementById(
        "users-file"
      ) as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при валидации/импорте файла.";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack spacing={2} alignItems="flex-start" style={{ marginTop: "10%" }}>
        <Typography
          component="h1"
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            color: theme === "dark" ? "#fff" : "#000",
            textShadow:
              theme === "dark" ? "0 0 10px rgba(255,255,255,0.8)" : "none",
            lineHeight: 1.2,
          }}
        >
          Импорт получателей (Excel → phone/телефон)
        </Typography>

        <Button
          variant="contained"
          component="label"
          disabled={isLoading}
          sx={{
            backgroundColor:
              theme === "dark" ? "rgba(85,82,159,0.74)" : "#000000e8",
            color: "white",
            "&:hover": {
              backgroundColor:
                theme === "dark" ? "rgba(85,82,159,0.9)" : "#000000d0",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(105,105,105,0.7)",
              color: "white",
              opacity: 0.7,
            },
          }}
          startIcon={
            isLoading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "white",
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
                }}
              />
            ) : selectedFile ? (
              <DescriptionIcon
                sx={{
                  color: "white",
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
                }}
              />
            ) : (
              <FileUploadIcon
                sx={{
                  color: "white",
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
                }}
              />
            )
          }
        >
          <span
            style={{
              color: "white",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
              display: "flex",
            }}
          >
            {selectedFile
              ? selectedFile.name.length > 14
                ? `${selectedFile.name.substring(0, 11)}...`
                : selectedFile.name
              : "Выбрать Excel/CSV"}
          </span>
          <input
            id="users-file"
            type="file"
            accept=".xlsx, .xls, .csv"
            hidden
            onChange={handleFileSelect}
          />
        </Button>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress
                size={20}
                sx={{
                  color: "white",
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
                }}
              />
            ) : (
              <UploadFileIcon
                sx={{
                  color: "white",
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
                }}
              />
            )
          }
          sx={{
            mt: 1,
            backgroundColor:
              !selectedFile || isLoading
                ? "rgba(105,105,105,0.7)"
                : theme === "dark"
                ? "rgba(85,82,159,0.74)"
                : "#000000e8",
            color: "white",
            opacity: !selectedFile || isLoading ? 0.7 : 1,
            "&.Mui-disabled": {
              backgroundColor: "rgba(105,105,105,0.7)",
              color: "white",
            },
            "&:hover": {
              backgroundColor:
                !selectedFile || isLoading
                  ? "rgba(105,105,105,0.7)"
                  : theme === "dark"
                  ? "rgba(85,82,159,0.9)"
                  : "#000000d0",
            },
          }}
        >
          <span
            style={{
              color: "white",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
              display: "flex",
            }}
          >
            {isLoading ? "Обработка..." : "Отправить"}
          </span>
        </Button>
      </Stack>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast}>
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
