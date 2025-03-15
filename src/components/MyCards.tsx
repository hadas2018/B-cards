import { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { Card } from "../interfaces/cards/Card";
// import { useAuth } from "../context/AuthContext";
import { getMyCards, deleteCard } from "../services/cardsService";
import { errorMessage, sucessMassage } from "../services/feedbackService";
import { Card } from "../interfaces/cards/Cards";
import { useAuth } from "./context/AuthContext";
import Bcard from "./cards/Bcard";
// import Bcard from "./common/Bcard";

interface MyCardsProps {}

const MyCards: FunctionComponent<MyCardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    // וודא שהמשתמש מחובר
    if (!isLoggedIn || !user) {
      errorMessage("עליך להתחבר כדי לצפות בכרטיסים שלך");
      return;
    }

    // טען את הכרטיסים של המשתמש
    loadCards();
  }, [isLoggedIn, user]);

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

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק כרטיס זה?")) {
      deleteCard(cardId)
        .then(() => {
          setCards(cards.filter((card) => card._id !== cardId));
          sucessMassage("הכרטיס נמחק בהצלחה");
        })
        .catch((err) => {
          console.error("שגיאה במחיקת הכרטיס:", err);
          errorMessage("אירעה שגיאה במחיקת הכרטיס");
        });
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
      
      <div className="row">
        {cards.map((card) => (
          <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
            <Bcard 
              card={card} 
              isMyCard={true} 
              onDelete={handleDeleteCard} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCards;
