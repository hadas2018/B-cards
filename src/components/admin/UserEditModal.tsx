import React, { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput } from 'flowbite-react';
import { User } from '../../interfaces/users/User';
// import { User } from '../interfaces/users/User';
// import { User } from '../../interfaces/types';

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

  // אין מה להציג אם אין משתמש לעריכה
  if (!editableUser) {
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
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Edit User</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="firstName" value="First Name" />
            </div>
            <TextInput
              id="firstName"
              value={editableUser.name?.first || ''}
              onChange={(e) => updateNestedField('name', 'first', e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="lastName" value="Last Name" />
            </div>
            <TextInput
              id="lastName"
              value={editableUser.name?.last || ''}
              onChange={(e) => updateNestedField('name', 'last', e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              type="email"
              value={editableUser.email || ''}
              onChange={(e) => updateUserField('email', e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="phone" value="Phone" />
            </div>
            <TextInput
              id="phone"
              value={editableUser.phone || ''}
              onChange={(e) => updateUserField('phone', e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <Label htmlFor="isBusiness" className="mr-2">Business User</Label>
              <input
                id="isBusiness"
                type="checkbox"
                checked={editableUser.isBusiness || false}
                onChange={(e) => updateUserField('isBusiness', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="isAdmin" className="mr-2">Admin User</Label>
              <input
                id="isAdmin"
                type="checkbox"
                checked={editableUser.isAdmin || false}
                onChange={(e) => updateUserField('isAdmin', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>Save Changes</Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserEditModal;