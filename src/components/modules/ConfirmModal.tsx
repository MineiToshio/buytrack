import { FC } from "react";
import Modal from "./Modal";
import Typography from "../core/Typography";
import Button from "../core/Button";

type ConfirmModalProps = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  open,
  onConfirm,
  onCancel,
}) => (
  <Modal open={open} onClose={onCancel}>
    <div className="flex flex-col gap-y-4 p-4">
      <Typography>{message}</Typography>
      <div className="flex justify-end gap-x-2">
        <Button onClick={onConfirm}>{confirmText}</Button>
        <Button color="muted" onClick={onCancel} variant="outline">
          {cancelText}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
