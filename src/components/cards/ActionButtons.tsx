import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../interfaces/cards/Cards";

interface ActionButtonsProps {
  card: Card;
  isLoggedIn: boolean;
  isLiked: boolean;
  handleLikeClick: () => Promise<void>;
  formatPhoneNumber: (phone: string) => string;
  styleClass?: string; // לאפשר גמישות בסגנון הכפתורים
  iconSize?: number; // גודל האייקון
  isOwner?: boolean; // האם המשתמש הוא הבעלים של הכרטיס
  onDelete?: (id: string) => void; // פונקציה למחיקת כרטיס
  displayMode?: 'all' | 'basic' | 'edit' | 'delete'; // מצב תצוגה - כל הכפתורים או מצבים ספציפיים
}

const ActionButtons: FunctionComponent<ActionButtonsProps> = ({
  card,
  isLoggedIn,
  isLiked,
  handleLikeClick,
  formatPhoneNumber,
  styleClass = "btn-outline",
  iconSize = 20,
  isOwner = false,
  onDelete,
  displayMode = 'all',
}) => {
  // בדיקה אם יש כתובת אתר לעסק
  const hasWebsite = !!card.web;
  
  return (
    <div className="d-flex gap-2">
      {/* אייקון טלפון */}
      <a
        href={`tel:${card.phone}`}
        className={`btn btn-outline-primary ${styleClass}`}
        title="התקשר"
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 256 256">
          <path
            d="M222.37,158.46,175.26,137a12,12,0,0,0-13.65,2.52l-16.28,16.68a76.43,76.43,0,0,1-33.83-33.83L128.18,106a12,12,0,0,0,2.53-13.64L109.54,45.22a12,12,0,0,0-13.73-6.71l-46.7,11.8A12,12,0,0,0,40,61.87,180.29,180.29,0,0,0,220.13,242a12,12,0,0,0,11.56-9.11l11.8-46.7A12,12,0,0,0,222.37,158.46Z"
            fill="currentColor"
          />
        </svg>
      </a>

      {/* אייקון וואטסאפ */}
      <a
        href={`https://wa.me/${formatPhoneNumber(card.phone)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-outline-success ${styleClass}`}
        title="שלח הודעת וואטסאפ"
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 256 256">
          <path
            d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84Z"
            fill="currentColor"
          />
          <path
            d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"
            fill="currentColor"
          />
        </svg>
      </a>

      {/* אייקון לאתר - מופיע רק אם יש אתר */}
      {hasWebsite && (
        <a
          href={card.web}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-outline-info ${styleClass}`}
          title="בקר באתר"
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 256 256">
            <path
              d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"
              fill="currentColor"
            />
          </svg>
        </a>
      )}

      {/* אייקון לייק - רק למשתמשים מחוברים */}
      {isLoggedIn && (
        <button
          className={`btn ${
            isLiked ? "btn-danger" : "btn-outline-danger"
          } ${styleClass}`}
          onClick={handleLikeClick}
          title={isLiked ? "הסר לייק" : "הוסף לייק"}
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 256 256">
            <path
              d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
          </svg>
        </button>
      )}

      {/* כפתורי עריכה ומחיקה - מופרדים כדי לאפשר גמישות */}
      {/* כפתור עריכה - רק למשתמשים בעלים */}
      {isOwner && (displayMode === 'all' || displayMode === 'edit') && (
        <Link
          to={`/edit-card/${card._id}`}
          className={`btn btn-outline-warning ${styleClass}`}
          title="ערוך כרטיס"
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 256 256">
            <path
              d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.32,64l24-24L216,84.69Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      )}

      {/* כפתור מחיקה - רק למשתמשים בעלים */}
      {isOwner && (displayMode === 'all' || displayMode === 'delete') && card._id && (
        <button
          className={`btn btn-outline-danger ${styleClass}`}
          onClick={() => {
            try {
              if (onDelete) {
                onDelete(card._id as string);
              } else {
                console.warn("פונקציית מחיקה לא הוגדרה");
              }
            } catch (err) {
              console.error("שגיאה בהפעלת פונקציית המחיקה:", err);
            }
          }}
          title="מחק כרטיס"
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 256 256">
            <path
              d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;