import { del } from "@/helpers/request";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const deleteReq = async (id: string, endpoint: string) => {
  if (id) {
    return del(endpoint + id);
  }
};

const useDelete = (
  endpoint: string,
  onSuccess: (success: boolean, id: string) => void,
) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { isLoading, mutate } = useMutation({
    mutationFn: (id: string) => deleteReq(id, endpoint),
    onSuccess: (data) => {
      if (data && deleteId) {
        onSuccess(data.success, deleteId);
        setDeleteId(null);
      }
    },
  });

  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (deleteId) {
      mutate(deleteId);
      setShowDeleteModal(false);
    }
  };

  return {
    showDeleteModal,
    isLoading,
    deleteId,
    deleteData,
    openDeleteModal,
    closeDeleteModal,
  };
};

export default useDelete;
