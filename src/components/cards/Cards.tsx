import { FunctionComponent, useEffect, useState } from "react";
import {
  getAllCards,
  deleteCard,
  CARDS_UPDATED_EVENT,
} from "../../services/cardsService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation"; // ייבוא ההוק
import Bcard from "./Bcard";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";
// import DeleteConfirmationModal from "../DeleteConfirmationModal"; // ייבוא קומפוננטת המודל

interface CardsProps {}

const Cards: FunctionComponent<CardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { searchTerm } = useSearch();

  // פונקציית המחיקה עצמה שתועבר להוק
  const deleteHandler = async (id: string, type: "card" | "user" | "item") => {
    try {
      if (type === "card") {
        // בדיקת הרשאות גישה (אופציונלי, כי Bcard אמור לבדוק זאת)
        const card = cards.find((c) => c._id === id);
        if (!card) throw new Error("הכרטיס לא נמצא");

        // ביצוע המחיקה
        await deleteCard(id);

        // טעינה מחדש של הכרטיסים
        loadCards(true);
        sucessMassage("הכרטיס נמחק בהצלחה");
      }
    } catch (err) {
      console.error("שגיאה במחיקת כרטיס:", err);
      errorMessage("אירעה שגיאה במחיקת הכרטיס");
      throw err;
    }
  };

  // שימוש בהוק המשודרג
  const { handleDeleteClick, deleteModalProps } =
    useDeleteConfirmation(deleteHandler);

  useEffect(() => {
    loadCards();

    // האזנה לאירועי עדכון כרטיסים
    const handleCardsUpdated = () => {
      console.log("Cards updated event received in Cards");
      loadCards(true);
    };

    window.addEventListener(CARDS_UPDATED_EVENT, handleCardsUpdated);

    // ניקוי האזנה בעת פירוק הקומפוננטה
    return () => {
      window.removeEventListener(CARDS_UPDATED_EVENT, handleCardsUpdated);
    };
  }, []);

  // סינון הכרטיסים כאשר מושג החיפוש משתנה
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

  const loadCards = async (silent: boolean = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getAllCards(silent);
      setCards(res.data || []);
      // כאן לא מגדירים את filteredCards, כי useEffect ידאג לכך
    } catch (err) {
      console.error("שגיאה בטעינת הכרטיסים:", err);
      if (!silent) {
        errorMessage("אירעה שגיאה בטעינת הכרטיסים");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  if (cards.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>אין כרטיסים להצגה</h2>
        <p>נסה לחזור מאוחר יותר או ליצור כרטיסים חדשים</p>
        <button
          onClick={() => loadCards()}
          className="btn btn-outline-primary mt-3"
          disabled={refreshing}
        >
          {refreshing ? "מרענן..." : "רענן רשימה"}
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>כרטיסי עסק</h1>
        <button
          onClick={() => loadCards(true)}
          className="btn btn-outline-primary"
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              מרענן...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                fill="currentColor"
                className="me-1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
              רענן רשימה
            </>
          )}
        </button>
      </div>

      {/* הצגת הודעה כאשר מסננים ואין תוצאות */}
      {searchTerm && filteredCards.length === 0 && (
        <div className="text-center my-5">
          <h3>לא נמצאו תוצאות לחיפוש "{searchTerm}"</h3>
          <p>נסה לחפש עם מילות מפתח אחרות או בדוק את האיות</p>
        </div>
      )}

      {/* הצגת מספר התוצאות כאשר מסננים ויש תוצאות */}
      {searchTerm && filteredCards.length > 0 && (
        <div className="alert alert-info mb-4">
          נמצאו {filteredCards.length} תוצאות לחיפוש "{searchTerm}"
        </div>
      )}

      <div className="row">
        {filteredCards.map((card) => (
          <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
            <Bcard
              card={card}
              // isMyCard={user && user._id === card.user_id}
              isMyCard={Boolean(user && user._id === card.user_id)}
              onDelete={(id) => handleDeleteClick(id, "card")} // שימוש בפונקציה מההוק
              refreshCards={() => loadCards(true)}
            />
          </div>
        ))}
      </div>

      {/* מודל אישור המחיקה */}
      <DeleteConfirmationModal {...deleteModalProps} />
    </div>
  );
};

export default Cards;
