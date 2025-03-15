import { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFavoriteCards, deleteCard } from "../services/cardsService"; // הוספת ייבוא של deleteCard
import { errorMessage, sucessMassage } from "../services/feedbackService"; // הוספת ייבוא של sucessMassage
import { Card } from "../interfaces/cards/Cards";
import { useAuth } from "./context/AuthContext";
import Bcard from "./cards/Bcard";

interface FavoriteCardsProps {}

const FavoriteCards: FunctionComponent<FavoriteCardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      errorMessage("עליך להתחבר כדי לצפות בכרטיסים המועדפים");
      navigate("/login");
      return;
    }

    loadFavoriteCards();
  }, [isLoggedIn, navigate]);

  const loadFavoriteCards = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      const res = await getFavoriteCards(true); // תמיד נאלץ רענון מרחוק
      setCards(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת הכרטיסים המועדפים:", err);
      setError("אירעה שגיאה בטעינת הכרטיסים המועדפים");
      errorMessage("אירעה שגיאה בטעינת הכרטיסים המועדפים");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // כשמשתמש מסיר לייק, הכרטיס צריך להיעלם מהרשימה
  const handleLikeChange = () => {
    // פשוט טוען מחדש את כל הכרטיסים המועדפים
    loadFavoriteCards(true);
  };

  // פונקציית מחיקת כרטיס
  const handleDeleteCard = (cardId: string) => {
    // רק המשתמש שיצר את הכרטיס או מנהל יכולים למחוק אותו
    const card = cards.find(c => c._id === cardId);
    if (!card) return;

    // בדיקה שהמשתמש הוא בעל הכרטיס או מנהל
    if (user && (user._id === card.user_id || user.isAdmin)) {
      if (window.confirm("האם אתה בטוח שברצונך למחוק כרטיס זה?")) {
        deleteCard(cardId)
          .then(() => {
            setCards(cards.filter((c) => c._id !== cardId));
            sucessMassage("הכרטיס נמחק בהצלחה");
          })
          .catch((err) => {
            console.error("שגיאה במחיקת הכרטיס:", err);
            errorMessage("אירעה שגיאה במחיקת הכרטיס");
          });
      }
    } else {
      errorMessage("אין לך הרשאה למחוק כרטיס זה");
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

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        <h4 className="alert-heading">שגיאה בטעינת הנתונים</h4>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-between">
          <button onClick={() => loadFavoriteCards(true)} className="btn btn-outline-danger">
            נסה שוב
          </button>
          <Link to="/" className="btn btn-primary">
            חזור לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>אין כרטיסים מועדפים</h2>
        <p>לא סימנת שום כרטיס כמועדף עדיין.</p>
        <p>תוכל לסמן כרטיסים כמועדפים בלחיצה על אייקון הלב בכרטיסים.</p>
        <div className="mt-4">
          <Link to="/" className="btn btn-primary mx-2">
            חזור לדף הבית וגלה כרטיסים
          </Link>
          <button onClick={() => loadFavoriteCards(true)} className="btn btn-outline-secondary mx-2">
            רענן רשימה
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>הכרטיסים המועדפים שלי</h1>
        <div>
          <button 
            onClick={() => loadFavoriteCards(true)} 
            className="btn btn-outline-primary me-2"
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                מרענן...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                רענן רשימה
              </>
            )}
          </button>
          <Link to="/" className="btn btn-primary">
            חזור לדף הבית
          </Link>
        </div>
      </div>
      
      <div className="row">
        {cards.map((card) => (
          <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
            <Bcard 
              card={card} 
              isMyCard={user && user._id === card.user_id}
              onLikeChange={handleLikeChange} // מעבירים את הפונקציה לטיפול בשינוי לייק
              onDelete={handleDeleteCard} // הוספת הפונקציה למחיקת כרטיס
              refreshCards={() => loadFavoriteCards(true)} // קולבק לרענון הרשימה
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteCards;