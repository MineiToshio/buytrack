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
      <div className="flex gap-x-2 justify-end">
        <Button onClick={onConfirm}>
          {confirmText}
        </Button>
        <Button className="bg-muted hover:bg-gray-500" onClick={onCancel}>
          {cancelText}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
