import { FunctionComponent, useState } from "react";
import { toggleCardLike } from "../../services/cardsService";
import { errorMessage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import UniversalImageLink from "./UniversalImageLink";
import ActionButtons from "./ActionButtons";

interface BcardProps {
  card: Card;
  isMyCard?: boolean;
  onLikeChange?: () => void;
  onDelete?: (id: string) => void;
  refreshCards?: () => void;
}

const Bcard: FunctionComponent<BcardProps> = ({
  card,
  onDelete,
  onLikeChange,
  refreshCards,
}) => {
  const { user, isLoggedIn } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(
    isLoggedIn && user && card.likes ? card.likes.includes(user._id) : false
  );

  // בדיקה אם המשתמש הוא הבעלים של הכרטיס
  const isOwner = () => {
    return isLoggedIn && user && (user._id === card.user_id || user.isAdmin);
  };

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      errorMessage("עליך להתחבר כדי לסמן לייק");
      return;
    }

    try {
      if (!card._id) return;
      await toggleCardLike(card._id);
      setIsLiked(!isLiked);
      if (onLikeChange) onLikeChange();
      if (refreshCards) refreshCards();
    } catch (error) {
      console.error("שגיאה בהוספת/הסרת לייק:", error);
      errorMessage("אירעה שגיאה בסימון הלייק");
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // הסר תווים שאינם ספרות
    const cleaned = phone.replace(/\D/g, "");

    // בדוק אם זה מספר ישראלי שמתחיל ב-0
    if (cleaned.startsWith("0")) {
      return "+972" + cleaned.substring(1);
    }

    return cleaned;
  };

  return (
    <>
      <div
        className="card m-3 shadow-sm"
        style={{
          width: "18rem",
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        {/* תמונת הכרטיס */}
        {card._id && (
          <UniversalImageLink
            cardId={card._id}
            imageUrl={card.image?.url}
            imageAlt={card.image?.alt}
            title={card.title}
          />
        )}
        <div className="card-body">
          <h5 className="card-title fw-bold">{card.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{card.subtitle}</h6>

          <hr className="my-2" />

          <div className="small mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 256 256"
              className="me-2 text-primary"
            >
              <path
                d="M222.37,158.46,175.26,137a12,12,0,0,0-13.65,2.52l-16.28,16.68a76.43,76.43,0,0,1-33.83-33.83L128.18,106a12,12,0,0,0,2.53-13.64L109.54,45.22a12,12,0,0,0-13.73-6.71l-46.7,11.8A12,12,0,0,0,40,61.87,180.29,180.29,0,0,0,220.13,242a12,12,0,0,0,11.56-9.11l11.8-46.7A12,12,0,0,0,222.37,158.46Z"
                fill="currentColor"
              />
            </svg>
            {card.phone}
          </div>

          <div className="small mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 256 256"
              className="me-2 text-primary"
            >
              <path
                d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"
                fill="currentColor"
              />
            </svg>
            {`${card.address.street} ${card.address.houseNumber}, ${card.address.city}`}
          </div>
        </div>

        {/* שורת האייקונים */}
        <div className="card-footer d-flex justify-content-center align-items-center">
          {/* שימוש בקומפוננטת ActionButtons עם כל הכפתורים */}
          <ActionButtons
            card={card}
            isLoggedIn={isLoggedIn}
            isLiked={isLiked}
            handleLikeClick={handleLikeClick}
            formatPhoneNumber={formatPhoneNumber}
            styleClass="action-icon"
            isOwner={isOwner()}
            onDelete={onDelete}
            displayMode="all"
          />
          
        </div>
      </div>
      

      <style>{`
        .action-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          padding: 0;
          transition: all 0.2s;
        }
        .action-icon:hover {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default Bcard;
