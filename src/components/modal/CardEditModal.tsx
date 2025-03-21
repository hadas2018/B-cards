import React, { useState, useEffect } from "react";
import { Card } from "../../interfaces/cards/Cards";

interface CardEditModalProps {
  isOpen: boolean;
  card: Card | null;
  onClose: () => void;
  onSave: (card: Card) => void;
}

const CardEditModal: React.FC<CardEditModalProps> = ({
  isOpen,
  card,
  onClose,
  onSave,
}) => {
  const [editableCard, setEditableCard] = useState<Card | null>(null);

  // עדכון המצב כאשר הכרטיס לעריכה משתנה
  useEffect(() => {
    setEditableCard(card ? { ...card } : null);
  }, [card]);

  // אין מה להציג אם אין כרטיס לעריכה או המודל סגור
  if (!editableCard || !isOpen) {
    return null;
  }

  // טיפול בשמירת השינויים
  const handleSave = () => {
    if (editableCard) {
      onSave(editableCard);
    }
  };

  // עדכון שדה בודד בכרטיס
  const updateCardField = <K extends keyof Card>(field: K, value: Card[K]) => {
    if (editableCard) {
      setEditableCard({ ...editableCard, [field]: value });
    }
  };

  // עדכון שדות בתוך אובייקט הכתובת
  const updateAddressField = (field: string, value: string) => {
    if (editableCard) {
      setEditableCard({
        ...editableCard,
        address: {
          ...editableCard.address,
          [field]: value,
        },
      });
    }
  };

  // עדכון שדות בתוך אובייקט התמונה
  const updateImageField = (field: string, value: string) => {
    if (editableCard) {
      setEditableCard({
        ...editableCard,
        image: {
          ...editableCard.image,
          [field]: value,
        },
      });
    }
  };

  return (
    <>
      {/* Modal Backdrop - עם אפקט טשטוש */}
      <div
        className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
        style={{
          display: isOpen ? "block" : "none",
          opacity: 0.8, // הגדלת האטימות (0-1)
          backdropFilter: "blur(5px)", // אפקט הטשטוש
        }}
      ></div>

      {/* Modal */}
      <div
        className={`modal fade ${isOpen ? "show" : ""}`}
        tabIndex={-1}
        role="dialog"
        style={{ display: isOpen ? "block" : "none" }}
        data-bs-theme="auto"
      >
        <div
          className="modal-dialog modal-xl"
          role="document"
          style={{
            borderRadius: "15px",
            // boxShadow: "0 10px 30px rgb(254, 254, 254)",
          }}
        >
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Edit Card</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={editableCard.title}
                  onChange={(e) => updateCardField("title", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="subtitle" className="form-label">
                  Subtitle
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="subtitle"
                  value={editableCard.subtitle}
                  onChange={(e) => updateCardField("subtitle", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows={3}
                  value={editableCard.description}
                  onChange={(e) =>
                    updateCardField("description", e.target.value)
                  }
                  required
                ></textarea>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={editableCard.phone}
                    onChange={(e) => updateCardField("phone", e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={editableCard.email}
                    onChange={(e) => updateCardField("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="web" className="form-label">
                  Web
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="web"
                  value={editableCard.web}
                  onChange={(e) => updateCardField("web", e.target.value)}
                />
              </div>

              <h5 className="mt-4 mb-3">Image</h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="url" className="form-label">
                    Image URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="url"
                    value={
                      editableCard.image?.url || editableCard.imageUrl || ""
                    }
                    onChange={(e) => {
                      updateImageField("url", e.target.value);
                      // לשמירת תאימות עם השדה הישן
                      updateCardField("imageUrl", e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="alt" className="form-label">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="alt"
                    value={
                      editableCard.image?.alt || editableCard.imageAlt || ""
                    }
                    onChange={(e) => {
                      updateImageField("alt", e.target.value);
                      // לשמירת תאימות עם השדה הישן
                      updateCardField("imageAlt", e.target.value);
                    }}
                  />
                </div>
              </div>

              <h5 className="mt-4 mb-3">Address</h5>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    value={editableCard.address?.state || ""}
                    onChange={(e) =>
                      updateAddressField("state", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    value={editableCard.address?.country || ""}
                    onChange={(e) =>
                      updateAddressField("country", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    value={editableCard.address?.city || ""}
                    onChange={(e) => updateAddressField("city", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="street" className="form-label">
                    Street
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    value={editableCard.address?.street || ""}
                    onChange={(e) =>
                      updateAddressField("street", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="houseNumber" className="form-label">
                    House Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="houseNumber"
                    value={editableCard.address?.houseNumber || ""}
                    onChange={(e) =>
                      updateAddressField("houseNumber", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    value={editableCard.address?.zip || ""}
                    onChange={(e) => updateAddressField("zip", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* שדה נוסף עבור bizNumber אם קיים */}
              {editableCard.bizNumber !== undefined && (
                <div className="mb-3">
                  <label htmlFor="bizNumber" className="form-label">
                    Business Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="bizNumber"
                    value={editableCard.bizNumber || ""}
                    onChange={(e) =>
                      updateCardField(
                        "bizNumber",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    readOnly
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardEditModal;
