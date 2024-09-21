import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  bottom: "0", 
  right: "0", 
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "transparent",
  boxShadow: 24,
  border: "2px solid #2da928b5",
  color:'white',
  p: 4,
};

const styleError = {
    position: "absolute" as "absolute",
    bottom: "0", 
    right: "0", 
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#ff000094",
    color:'white',
    border: "2px solid #ff000075",
    boxShadow: 24,
    p: 4,
    transition:'all 0.3s'
  };

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  statusMessage: string;
};

export default function BasicModal({ setOpen, open, statusMessage }: Props) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {statusMessage == "success" ? (
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Рассылка успешно завершена
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Результаты рассылки можете посмотреть в ответном Excel файле
            </Typography>
          </Box>
        ) : (
          <Box sx={styleError}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Произошла ошибка
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {statusMessage}
            </Typography>
          </Box>
        )}
      </Modal>
    </div>
  );
}
