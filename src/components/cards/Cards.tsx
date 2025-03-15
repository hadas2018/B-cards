import { FunctionComponent, useEffect, useState } from "react";
import { getAllCards, deleteCard, CARDS_UPDATED_EVENT } from "../../services/cardsService";
import { errorMessage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import Bcard from "./Bcard";

interface CardsProps {}

const Cards: FunctionComponent<CardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

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

  const loadCards = async (silent: boolean = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getAllCards(silent);
      setCards(res.data);
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

  const handleDelete = async (id: string) => {
    // הוספת דיאלוג אישור לפני המחיקה
    const isConfirmed = window.confirm("האם את בטוחה שברצונך למחוק כרטיס זה?");
    
    // אם המשתמש ביטל, צא מהפונקציה
    if (!isConfirmed) {
      return;
    }
    
    try {
      await deleteCard(id);
      // לאחר מחיקה מוצלחת, טען מחדש את הכרטיסים
      loadCards(true);
    } catch (error) {
      console.error("שגיאה במחיקת כרטיס:", error);
      errorMessage("אירעה שגיאה במחיקת הכרטיס");
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

      <div className="row">
        {cards.map((card) => (
          <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
            <Bcard 
              card={card} 
              isMyCard={user && user._id === card.user_id}
              onDelete={handleDelete}
              refreshCards={() => loadCards(true)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;