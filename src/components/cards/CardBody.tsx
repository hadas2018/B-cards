import { FunctionComponent } from "react";
import { Card } from "../../interfaces/cards/Cards";
import ActionButtons from "./ActionButtons"; // ייבוא הקומפוננטה החדשה

interface CardBodyProps {
  card: Card;
  isLoggedIn: boolean;
  isLiked: boolean;
  handleLikeClick: () => Promise<void>;
  formatPhoneNumber: (phone: string) => string;
  isOwner?: boolean; // הוספת prop חדש לבדיקה אם המשתמש הוא הבעלים
}

const CardBody: FunctionComponent<CardBodyProps> = ({
  card,
  isLoggedIn,
  isLiked,
  handleLikeClick,
  formatPhoneNumber,
  isOwner = false, // ערך ברירת מחדל
}) => {
  // פונקציית דמה ריקה שלא עושה כלום - כדי למנוע שגיאות
  const handleDeleteCard = async (id: string) => {
    console.log("פונקציית מחיקה לא מיושמת בCardBody", id);
    // בקומפוננטה זו אין באמת מחיקת כרטיסים, אז אנחנו רק מדפיסים לקונסול
  };

  return (
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 className="card-title display-5 fw-bold">{card.title}</h1>
          <h3 className="card-subtitle text-muted">{card.subtitle}</h3>
        </div>

        {/* שימוש בקומפוננטת ActionButtons במצב בסיסי */}
        <ActionButtons
          card={card}
          isLoggedIn={isLoggedIn}
          isLiked={isLiked}
          handleLikeClick={handleLikeClick}
          formatPhoneNumber={formatPhoneNumber}
          styleClass="rounded-circle p-2"
          iconSize={24}
          isOwner={isOwner}
          onDelete={handleDeleteCard} // העברת פונקציית המחיקה הריקה
          displayMode="basic" // שינוי מצב התצוגה כדי שלא יהיו כפתורי עריכה/מחיקה
        />
      </div>

      {/* תיאור */}
      <div className="mb-4">
        <h4 className="mb-2">תיאור העסק</h4>
        <p className="lead">{card.description}</p>
      </div>

      <hr className="my-4" />

      {/* פרטי קשר */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h4 className="mb-3">פרטי קשר</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex align-items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 256 256"
                className="me-3 text-primary"
              >
                <path
                  d="M222.37,158.46,175.26,137a12,12,0,0,0-13.65,2.52l-16.28,16.68a76.43,76.43,0,0,1-33.83-33.83L128.18,106a12,12,0,0,0,2.53-13.64L109.54,45.22a12,12,0,0,0-13.73-6.71l-46.7,11.8A12,12,0,0,0,40,61.87,180.29,180.29,0,0,0,220.13,242a12,12,0,0,0,11.56-9.11l11.8-46.7A12,12,0,0,0,222.37,158.46Z"
                  fill="currentColor"
                />
              </svg>
              <span>{card.phone}</span>
            </li>
            <li className="list-group-item d-flex align-items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 256 256"
                className="me-3 text-primary"
              >
                <path
                  d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"
                  fill="currentColor"
                />
              </svg>
              <span>{card.email}</span>
            </li>
            {card.web && (
              <li className="list-group-item d-flex align-items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 256 256"
                  className="me-3 text-primary"
                >
                  <path
                    d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM173.66,82.34a56,56,0,0,0-91.32,0,8,8,0,1,0,13.32,8.92,40,40,0,0,1,64.68,0,8,8,0,0,0,13.32-8.92ZM128,120a16,16,0,1,0,16,16A16,16,0,0,0,128,120Z"
                    fill="currentColor"
                  />
                </svg>
                <a
                  href={card.web}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card.web}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="col-md-6">
          <h4 className="mb-3">כתובת</h4>
          <address className="mb-0">
            <div className="d-flex align-items-center mb-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 256 256"
                className="me-3 text-primary"
              >
                <path
                  d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"
                  fill="currentColor"
                />
              </svg>
              <div>
                <div>
                  {card.address.street}{" "}
                  {card.address.houseNumber}
                </div>
                <div>
                  {card.address.city}
                  {/* {card.address.state} */}
                </div>
                <div>{card.address.country}</div>
              </div>
            </div>
          </address>
        </div>
      </div>
    </div>
  );
};

export default CardBody;