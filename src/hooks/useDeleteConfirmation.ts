// src/hooks/useDeleteConfirmation.ts
import { useState } from 'react';

type ItemType = 'user' | 'card' | 'item';

interface DeleteHandler {
  (id: string, type: ItemType): Promise<void>;
}

export function useDeleteConfirmation(deleteHandler: DeleteHandler) {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: ItemType;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // פונקציה לפתיחת המודל ושמירת פרטי הפריט למחיקה
  const handleDeleteClick = (id: string, type: ItemType) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  // פונקציה לסגירת המודל
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // פונקציית המחיקה האמיתית
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // הפעלת פונקציית המחיקה שהועברה כפרמטר
      await deleteHandler(itemToDelete.id, itemToDelete.type);
      
      // סגירת המודל לאחר מחיקה מוצלחת
      closeDeleteModal();
    } catch (err) {
      console.error(`Error deleting ${itemToDelete.type}:`, err);
      setDeleteError(`Failed to delete ${itemToDelete.type}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  // מחזירים את כל המידע והפונקציות הנדרשות
  return {
    showDeleteModal,
    itemToDelete,
    isDeleting,
    deleteError,
    handleDeleteClick,
    closeDeleteModal,
    handleConfirmDelete,
    // אובייקט מוכן עם כל ה-props עבור DeleteConfirmationModal
    deleteModalProps: {
      isOpen: showDeleteModal,
      itemType: itemToDelete?.type || 'item',
      onClose: closeDeleteModal,
      onConfirm: handleConfirmDelete,
      isLoading: isDeleting
    }
  };
}