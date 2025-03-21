import React from 'react';
// נייבא את אייקון ההתראה מאותה ספריה
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemType: 'user' | 'card' | 'item';
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  itemType,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop - עם אפקט טשטוש */}
      <div
        className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
        style={{ 
          display: isOpen ? "block" : "none",
          opacity: 0.7,
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)" // תמיכה בספארי
        }}
      ></div>
      
      {/* Modal */}
      <div 
        className={`modal fade ${isOpen ? "show" : ""}`} 
        tabIndex={-1}
        role="dialog"
        style={{ display: isOpen ? "block" : "none" }}
        data-bs-theme="auto" // התאמה אוטומטית לדארק מוד
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div 
            className="modal-content"
            style={{
              border: '4px solid #dc3545', // מסגרת אדומה לאזהרה
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* לא צריך כותרת למודל מחיקה */}
            
            {/* Modal Body */}
            <div className="modal-body text-center p-5">
              <div className="d-flex justify-content-center">
                <HiOutlineExclamationCircle 
                  className="mb-4 text-danger" 
                  size={70} // גודל האייקון מוגדל
                />
              </div>
              
              <h3 className="mb-4 fw-bold">
                Delete Confirmation
              </h3>
              
              <p className="mb-5 fs-5 text-secondary">
                Are you sure you want to delete this {itemType}?
              </p>
              
              <div className="d-flex justify-content-center gap-3">
                <button
                  type="button"
                  className="btn btn-danger px-4 py-2"
                  onClick={onConfirm}
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary px-4 py-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
     