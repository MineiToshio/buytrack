import Typography from "@/core/Typography";
import Button from "@/core/Button";
import Icons from "@/core/Icons";
import Input from "@/core/Input";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { OrderNote } from "@prisma/client";
import { cn } from "@/styles/utils";
import { post } from "@/helpers/request";
import { CREATE_ORDER_NOTE } from "@/helpers/apiUrls";
import { useMutation } from "@tanstack/react-query";
import { format, register } from "timeago.js";
import esLocale from "timeago.js/lib/lang/es";
import { formatDatetime } from "@/helpers/utils";

register("es", esLocale);

type OrderNotesProps = {
  orderId: string;
  notes: OrderNote[];
};

type Form = {
  text: string;
};

const createNote = async (data: Form, orderId: string) =>
  post<OrderNote>(CREATE_ORDER_NOTE, { note: data.text, orderId });

const OrderNotes: FC<OrderNotesProps> = ({ orderId, notes }) => {
  const [currentNotes, setCurrentNotes] = useState<OrderNote[]>(notes);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<Form>();

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: Form) => createNote(data, orderId),
    onSuccess: (orderNote) => {
      if (orderNote) {
        setCurrentNotes((n) => [orderNote, ...n]);
        resetField("text");
      }
    },
  });

  const submit = (data: Form) => mutate(data);

  return (
    <div className="flex h-full w-full flex-col">
      <Typography color="muted" className="mb-2">
        Notas
      </Typography>
      <div className="flex h-full w-full flex-col overflow-y-auto rounded-md border p-2">
        {currentNotes && currentNotes.length > 1 ? (
          <>
            {currentNotes.map((note, i) => (
              <div
                key={note.id}
                className={cn("flex flex-col", {
                  "border-b py-1": i < currentNotes.length - 1,
                })}
              >
                <Typography
                  size="2xs"
                  className="text-muted"
                  title={formatDatetime(note.createdDate)}
                >
                  {format(note.createdDate, "es")}
                </Typography>
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
      <form className="mt-2 flex items-center" onSubmit={handleSubmit(submit)}>
        <Input
          autoComplete="off"
          variant="standard"
          {...register("text", { required: true })}
          className={cn({
            "border-error": !!errors.text,
          })}
        />
        <Button
          type="submit"
          variant="icon"
          title="Enviar"
          isLoading={isLoading}
        >
          <Icons.Send />
        </Button>
      </form>
    </div>
  );
};

export default OrderNotes;
