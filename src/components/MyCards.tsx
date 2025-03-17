import { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCards, deleteCard } from "../services/cardsService";
import { errorMessage, sucessMassage } from "../services/feedbackService";
import { Card } from "../interfaces/cards/Cards";
import { useAuth } from "./context/AuthContext";
import { useSearch } from "./context/SearchContext";
import { useDeleteConfirmation } from "../hooks/useDeleteConfirmation";
import Bcard from "./cards/Bcard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface MyCardsProps {}

const MyCards: FunctionComponent<MyCardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn } = useAuth();
  const { searchTerm } = useSearch();

  // פונקציית המחיקה עצמה שתועבר להוק
  const deleteHandler = async (id: string, type: "card" | "user" | "item") => {
    try {
      if (type === "card") {
        await deleteCard(id);
        setCards((prev) => prev.filter((card) => card._id !== id));
        sucessMassage("הכרטיס נמחק בהצלחה");
      }
    } catch (err) {
      console.error("שגיאה במחיקת הכרטיס:", err);
      errorMessage("אירעה שגיאה במחיקת הכרטיס");
      throw err; // להעביר את השגיאה להוק לטיפול
    }
  };

  // שימוש בהוק המשודרג
  const { handleDeleteClick, deleteModalProps } =
    useDeleteConfirmation(deleteHandler);

  useEffect(() => {
    // וודא שהמשתמש מחובר
    if (!isLoggedIn || !user) {
      errorMessage("עליך להתחבר כדי לצפות בכרטיסים שלך");
      return;
    }

    // טען את הכרטיסים של המשתמש
    loadCards();
  }, [isLoggedIn, user]);

  // סינון הכרטיסים לפי מושג החיפוש
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCards(cards);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = cards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchTermLower) ||
        card.description.toLowerCase().includes(searchTermLower) ||
        (card.address &&
          ((card.address.city &&
            card.address.city.toLowerCase().includes(searchTermLower)) ||
            (card.address.street &&
              card.address.street.toLowerCase().includes(searchTermLower)) ||
            (card.address.country &&
              card.address.country.toLowerCase().includes(searchTermLower))))
    );

    setFilteredCards(filtered);
  }, [searchTerm, cards]);

  const loadCards = () => {
    setLoading(true);
    getMyCards()
      .then((res) => {
        setCards(res.data);
      })
      .catch((err) => {
        console.error("שגיאה בטעינת הכרטיסים:", err);
        errorMessage("אירעה שגיאה בטעינת הכרטיסים");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">טוען...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="text-center my-5">
        <h2>אינך מחובר</h2>
        <p>עליך להתחבר כדי לצפות בכרטיסים שלך</p>
        <Link to="/login" className="btn btn-primary">
          התחברות
        </Link>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>אין לך כרטיסים</h2>
        {(user.isBusiness || user.isAdmin) && (
          <div className="mt-3">
            <p>רוצה ליצור כרטיס עסק חדש?</p>
            <Link to="/new-card" className="btn btn-primary">
              יצירת כרטיס חדש
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">הכרטיסים שלי</h1>

      {/* הצגת הודעה כאשר מסננים ואין תוצאות */}
      {searchTerm && filteredCards.length === 0 && (
        <div className="alert alert-info">
          <h5>לא נמצאו תוצאות לחיפוש "{searchTerm}"</h5>
          <p className="mb-0">נסה לחפש עם מילות מפתח אחרות או בדוק את האיות</p>
        </div>
      )}

      {/* הצגת מספר התוצאות כאשר מסננים ויש תוצאות */}
      {searchTerm && filteredCards.length > 0 && (
        <p className="alert alert-info mb-4">
          נמצאו {filteredCards.length} תוצאות לחיפוש "{searchTerm}"
        </p>
      )}

      <div className="row">
        {filteredCards.map((card) => (
          <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
            <Bcard
              card={card}
              isMyCard={true}
              onDelete={(id) => handleDeleteClick(id, "card")}
            />
          </div>
        ))}
      </div>

      {/* מודל אישור המחיקה */}
      <DeleteConfirmationModal {...deleteModalProps} />
    </div>
  );
};

export default MyCards;
