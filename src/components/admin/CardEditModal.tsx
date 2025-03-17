import React, { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Textarea } from 'flowbite-react';
import { Card } from '../interfaces/cards/Cards';


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

  // אין מה להציג אם אין כרטיס לעריכה
  if (!editableCard) {
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
          [field]: value
        }
      });
    }
  };

  return (
    <Modal show={isOpen} size="xl" onClose={onClose}>
      <Modal.Header>Edit Card</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="cardTitle" value="Title" />
            </div>
            <TextInput
              id="cardTitle"
              value={editableCard.title}
              onChange={(e) => updateCardField('title', e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="cardDescription" value="Description" />
            </div>
            <Textarea
              id="cardDescription"
              value={editableCard.description}
              onChange={(e) => updateCardField('description', e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardImageUrl" value="Image URL" />
              </div>
              <TextInput
                id="cardImageUrl"
                value={editableCard.imageUrl}
                onChange={(e) => updateCardField('imageUrl', e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardImageAlt" value="Image Alt Text" />
              </div>
              <TextInput
                id="cardImageAlt"
                value={editableCard.imageAlt}
                onChange={(e) => updateCardField('imageAlt', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardPhone" value="Phone" />
              </div>
              <TextInput
                id="cardPhone"
                value={editableCard.phone}
                onChange={(e) => updateCardField('phone', e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardBizNumber" value="Business Number" />
              </div>
              <TextInput
                id="cardBizNumber"
                type="number"
                value={editableCard.bizNumber || ''}
                onChange={(e) => updateCardField('bizNumber', parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>
          <h4 className="font-medium">Address</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardStreet" value="Street" />
              </div>
              <TextInput
                id="cardStreet"
                value={editableCard.address.street}
                onChange={(e) => updateAddressField('street', e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardHouseNumber" value="House Number" />
              </div>
              <TextInput
                id="cardHouseNumber"
                value={editableCard.address.houseNumber}
                onChange={(e) => updateAddressField('houseNumber', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardCity" value="City" />
              </div>
              <TextInput
                id="cardCity"
                value={editableCard.address.city}
                onChange={(e) => updateAddressField('city', e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardCountry" value="Country" />
              </div>
              <TextInput
                id="cardCountry"
                value={editableCard.address.country}
                onChange={(e) => updateAddressField('country', e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardZip" value="Zip Code" />
              </div>
              <TextInput
                id="cardZip"
                value={editableCard.address.zip}
                onChange={(e) => updateAddressField('zip', e.target.value)}
                required
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

export default CardEditModal;