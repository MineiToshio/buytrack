import Button from "@/core/Button";
import Icons from "@/core/Icons";
import Input from "@/core/Input";
import Typography from "@/core/Typography";
import { CREATE_ORDER_NOTE, DELETE_ORDER_NOTE } from "@/helpers/apiUrls";
import { del, post } from "@/helpers/request";
import { formatDatetime } from "@/helpers/utils";
import ConfirmModal from "@/modules/ConfirmModal";
import { cn } from "@/styles/utils";
import { OrderNote } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { format, register } from "timeago.js";
import esLocale from "timeago.js/lib/lang/es";

register("es", esLocale);

type OrderNotesProps = {
  orderId: string;
  notes: OrderNote[];
};

type Form = {
  text: string;
};

const createNoteReq = async (data: Form, orderId: string) =>
  post<OrderNote>(CREATE_ORDER_NOTE, { note: data.text, orderId });

const deleteNoteReq = async (orderNoteId: string | null) => {
  if (orderNoteId) {
    return del(DELETE_ORDER_NOTE + orderNoteId);
  }
};

const OrderNotes: FC<OrderNotesProps> = ({ orderId, notes }) => {
  const [currentNotes, setCurrentNotes] = useState<OrderNote[]>(notes);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<Form>();

  const { isLoading: isLoadingNewNote, mutate: createNoteMutate } = useMutation(
    {
      mutationFn: (data: Form) => createNoteReq(data, orderId),
      onSuccess: (orderNote) => {
        if (orderNote) {
          setCurrentNotes((n) => [orderNote, ...n]);
          resetField("text");
        }
      },
    },
  );

  const { isLoading: isLoadingDeleteNote, mutate: deleteNoteMutate } =
    useMutation({
      mutationFn: () => deleteNoteReq(deleteNoteId),
      onSuccess: (res) => {
        setDeleteNoteId(null);
        if (res && res?.success) {
          setCurrentNotes((curNotes) =>
            curNotes.filter((n) => n.id !== deleteNoteId),
          );
        }
      },
    });

  const submitNewNote = (data: Form) => createNoteMutate(data);

  const closeDeleteModal = () => {
    setDeleteNoteId(null);
    setShowDeleteModal(false);
  };
  const openDeleteModal = (noteId: string) => {
    setDeleteNoteId(noteId);
    setShowDeleteModal(true);
  };

  const deleteNote = () => {
    deleteNoteMutate();
    setShowDeleteModal(false);
  };

  return (
    <>
      <ConfirmModal
        message="¿Deseas eliminar esta nota?"
        confirmText="Eliminar"
        open={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={deleteNote}
      />
      <div className="flex h-full w-full flex-col">
        <Typography color="muted" className="mb-2">
          Notas
        </Typography>
        <div className="flex h-full w-full flex-col overflow-y-auto rounded-md border p-2">
          {currentNotes && currentNotes.length > 0 ? (
            <>
              {currentNotes.map((note, i) => (
                <div
                  key={note.id}
                  className={cn("flex flex-col py-1", {
                    "border-b": i < currentNotes.length - 1,
                  })}
                >
                  <div className="flex w-full items-center justify-between">
                    <Typography
                      size="2xs"
                      className="text-muted"
                      title={formatDatetime(note.createdDate)}
                    >
                      {format(note.createdDate, "es")}
                    </Typography>
                    <Button
                      color="muted"
                      variant="icon"
                      isLoading={
                        isLoadingDeleteNote && note.id === deleteNoteId
                      }
                      onClick={() => openDeleteModal(note.id)}
                    >
                      <Icons.Delete size="16" />
                    </Button>
                  </div>
                  <Typography>{note.note}</Typography>
                </div>
              ))}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Typography>No hay notas registradas.</Typography>
            </div>
          )}
        </div>
        <form
          className="mt-2 flex items-center gap-x-2"
          onSubmit={handleSubmit(submitNewNote)}
        >
          <Input
            autoComplete="off"
            variant="standard"
            placeholder="Agrega una nueva nota"
            {...register("text", { required: true })}
            className={cn({
              "border-error": !!errors.text,
            })}
          />
          <Button
            type="submit"
            variant="icon"
            title="Enviar"
            isLoading={isLoadingNewNote}
          >
            <Icons.Send />
          </Button>
        </form>
      </div>
    </>
  );
};

export default OrderNotes;
