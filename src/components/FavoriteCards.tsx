import { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFavoriteCards, deleteCard } from "../services/cardsService";
import { errorMessage, sucessMassage } from "../services/feedbackService";
import { Card } from "../interfaces/cards/Cards";
import { useAuth } from "./context/AuthContext";
import { useSearch } from "./context/SearchContext";
import { useDeleteConfirmation } from "../hooks/useDeleteConfirmation"; // ייבוא ההוק
import Bcard from "./cards/Bcard";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // ייבוא קומפוננטת המודל

interface FavoriteCardsProps {}

const FavoriteCards: FunctionComponent<FavoriteCardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();
  const { searchTerm } = useSearch();
  const navigate = useNavigate();

  // פונקציית המחיקה עצמה שתועבר להוק
  const deleteHandler = async (id: string, type: "card" | "user" | "item") => {
    try {
      if (type === "card") {
        // בדיקת הרשאות מחיקה
        const card = cards.find((c) => c._id === id);
        if (!card) throw new Error("הכרטיס לא נמצא");

        // בדיקה שהמשתמש הוא בעל הכרטיס או מנהל
        if (user && (user._id === card.user_id || user.isAdmin)) {
          await deleteCard(id);
          setCards((prev) => prev.filter((c) => c._id !== id));
          sucessMassage("הכרטיס נמחק בהצלחה");
        } else {
          errorMessage("אין לך הרשאה למחוק כרטיס זה");
          throw new Error("אין הרשאות מחיקה");
        }
      }
    } catch (err) {
      console.error("שגיאה במחיקת הכרטיס:", err);
      errorMessage("אירעה שגיאה במחיקת הכרטיס");
      throw err;
    }
  };

  // שימוש בהוק המשודרג
  const { handleDeleteClick, deleteModalProps } =
    useDeleteConfirmation(deleteHandler);

  useEffect(() => {
    if (!isLoggedIn) {
      errorMessage("עליך להתחבר כדי לצפות בכרטיסים המועדפים");
      navigate("/login");
      return;
    }

    loadFavoriteCards();
  }, [isLoggedIn, navigate]);

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

  const loadFavoriteCards = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const res = await getFavoriteCards(true);
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
          <button
            onClick={() => loadFavoriteCards(true)}
            className="btn btn-outline-danger"
          >
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
          <button
            onClick={() => loadFavoriteCards(true)}
            className="btn btn-outline-secondary mx-2"
          >
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
          <Link to="/" className="btn btn-primary">
            חזור לדף הבית
          </Link>
        </div>
      </div>

      {/* הצגת הודעה כאשר מסננים ואין תוצאות */}
      {searchTerm && filteredCards.length === 0 && (
        <div className="alert alert-info">
          <h5>לא נמצאו תוצאות לחיפוש "{searchTerm}"</h5>
          <p className="mb-0">נסה לחפש עם מילות מפתח אחרות או בדוק את האיות</p>
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
              isMyCard={user && user._id === card.user_id}
              onLikeChange={handleLikeChange}
              onDelete={(id) => handleDeleteClick(id, "card")} // שימוש בפונקציה מההוק
              refreshCards={() => loadFavoriteCards(true)}
            />
          </div>
        ))}
      </div>

      {/* מודל אישור המחיקה */}
      <DeleteConfirmationModal {...deleteModalProps} />
    </div>
  );
};

export default FavoriteCards;
