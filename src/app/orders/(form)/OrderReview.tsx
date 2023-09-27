import Button from "@/core/Button";
import Icons from "@/core/Icons";
import TextArea from "@/core/TextArea";
import Typography from "@/core/Typography";
import { CREATE_STORE_REVIEW, UPDATE_STORE_REVIEW } from "@/helpers/apiUrls";
import { post, put } from "@/helpers/request";
import Modal from "@/modules/Modal";
import ReviewStars from "@/modules/ReviewStars";
import { StoreReview } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, FormEvent, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormType = {
  rating: number;
  comment: string;
};

type OrderReviewProps = {
  storeId: string;
  orderId: string;
  review?: StoreReview;
};

type CurrentReview = FormType & {
  id: string;
};

const createStoreReview = (data: FormType, storeId: string, orderId: string) =>
  post<StoreReview>(CREATE_STORE_REVIEW, { storeId, orderId, ...data });

const updateStoreReview = (data: FormType, storeReviewId: string) =>
  put<StoreReview>(UPDATE_STORE_REVIEW, { storeReviewId, ...data });

const getReviewData = <T extends CurrentReview>(data: T | undefined) => {
  if (data) {
    return {
      id: data.id,
      rating: data.rating,
      comment: data.comment,
    };
  }
};

const OrderReview: FC<OrderReviewProps> = ({ storeId, orderId, review }) => {
  const [currentReview, setCurrentReview] = useState<CurrentReview | undefined>(
    getReviewData(review),
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleOpen = () => setIsModalOpen((o) => !o);

  const { isLoading: isReviewing, mutate: createOrderReviewMutate } =
    useMutation({
      mutationFn: (data: FormType) => {
        if (currentReview) {
          return updateStoreReview(data, currentReview.id);
        } else {
          return createStoreReview(data, storeId, orderId);
        }
      },
      onSuccess: (review) => {
        setCurrentReview(getReviewData(review));
        toggleOpen();
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormType>();

  const openModal = () => {
    toggleOpen();
    setValue("comment", currentReview?.comment ?? "");
    setValue("rating", currentReview?.rating ?? 0);
  };

  const onSubmit: SubmitHandler<FormType> = (data) => {
    createOrderReviewMutate(data);
  };

  const onBeforeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    return handleSubmit(onSubmit)(e);
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={toggleOpen}
        className="w-full max-w-lg"
      >
        <form className="p-4" onSubmit={onBeforeSubmit}>
          <Typography className="mb-4 font-semibold" size="lg">
            Califica tu pedido
          </Typography>
          <div className="w-full flex flex-col items-center mb-2">
            <Controller
              name="rating"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReviewStars
                  stars={field.value}
                  onChange={field.onChange}
                  showLegend
                />
              )}
            />
            {errors.rating && (
              <div className="w-full flex justify-center">
                <Typography className="mt-1 text-error" size="xs">
                  Selecciona el rating
                </Typography>
              </div>
            )}
          </div>
          <TextArea
            variant="standard"
            placeholder="Mi pedido me estuvo..."
            className="h-28"
            {...register("comment", { required: true })}
          />
          {errors.comment && (
            <Typography className="mt-1 text-error" size="xs">
              Escribe tu opinión del pedido
            </Typography>
          )}
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              color="error"
              className="mr-2"
              onClick={toggleOpen}
              StartIcon={Icons.Cancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              StartIcon={Icons.Save}
              isLoading={isReviewing}
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
      {currentReview ? (
        <div className="pb-4 flex items-center">
          <ReviewStars stars={currentReview.rating} />
          <Button variant="text" color="secondary" onClick={openModal}>
            Editar opinión
          </Button>
        </div>
      ) : (
        <div className="flex pb-8">
          <Button
            variant="text"
            color="secondary"
            onClick={openModal}
            className="p-0 border-dashed border-secondary border w-full bg-sky-50"
          >
            Califica tu pedido
          </Button>
        </div>
      )}
    </>
  );
};

export default OrderReview;
