import React, { useState, useEffect } from 'react';
import { User } from '../../interfaces/users/User';

interface UserEditModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  const [editableUser, setEditableUser] = useState<User | null>(null);

  // עדכון המצב כאשר המשתמש לעריכה משתנה
  useEffect(() => {
    setEditableUser(user ? { ...user } : null);
  }, [user]);

  // אין מה להציג אם אין משתמש לעריכה או המודל סגור
  if (!editableUser || !isOpen) {
    return null;
  }

  // טיפול בשמירת השינויים
  const handleSave = () => {
    if (editableUser) {
      onSave(editableUser);
    }
  };

  // עדכון שדה בודד במשתמש
  const updateUserField = <K extends keyof User>(field: K, value: User[K]) => {
    if (editableUser) {
      setEditableUser({ ...editableUser, [field]: value });
    }
  };

  // עדכון שדות בתוך אובייקט המשתמש
  const updateNestedField = (
    parentField: 'name' | 'image', 
    nestedField: string, 
    value: string
  ) => {
    if (editableUser && editableUser[parentField]) {
      setEditableUser({
        ...editableUser,
        [parentField]: {
          ...editableUser[parentField],
          [nestedField]: value
        }
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
        className={`modal fade ${isOpen ? 'show' : ''}`} 
        tabIndex={-1}
        role="dialog"
        style={{ display: isOpen ? 'block' : 'none' }}
        data-bs-theme="auto" // התאמה אוטומטית לדארק מוד של המערכת
      >
        <div className="modal-dialog" role="document"
          style={{
            borderRadius: "15px",
            // boxShadow: "0 10px 30px rgb(254, 254, 254)",
          }}>
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
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
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={editableUser.name?.first || ''}
                  onChange={(e) => updateNestedField('name', 'first', e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={editableUser.name?.last || ''}
                  onChange={(e) => updateNestedField('name', 'last', e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={editableUser.email || ''}
                  onChange={(e) => updateUserField('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  value={editableUser.phone || ''}
                  onChange={(e) => updateUserField('phone', e.target.value)}
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isBusiness"
                      checked={editableUser.isBusiness || false}
                      onChange={(e) => updateUserField('isBusiness', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isBusiness">
                      Business User
                    </label>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isAdmin"
                      checked={editableUser.isAdmin || false}
                      onChange={(e) => updateUserField('isAdmin', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isAdmin">
                      Admin User
                    </label>
                  </div>
                </div>
              </div>
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

export default UserEditModal;