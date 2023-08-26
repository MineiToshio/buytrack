import { FC } from "react";
import Modal from "./Modal";
import Typography from "../core/Typography";
import Button from "../core/Button";
import { LucideIcon } from "lucide-react";
import Icons from "../core/Icons";

type ConfirmModalProps = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  ConfirmIcon?: LucideIcon;
  CancelIcon?: LucideIcon;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  ConfirmIcon = Icons.Check,
  CancelIcon = Icons.Cancel,
  open,
  onConfirm,
  onCancel,
}) => (
  <Modal open={open} onClose={onCancel}>
    <div className="flex flex-col gap-y-4 p-4">
      <Typography>{message}</Typography>
      <div className="flex justify-end gap-x-2">
        <Button onClick={onConfirm} StartIcon={ConfirmIcon}>
          {confirmText}
        </Button>
        <Button
          color="muted"
          onClick={onCancel}
          variant="outline"
          StartIcon={CancelIcon}
        >
          {cancelText}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
