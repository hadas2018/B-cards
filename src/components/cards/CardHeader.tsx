import { FunctionComponent } from "react";
import { Card } from "../../interfaces/cards/Cards";
import UniversalImageLink from "./UniversalImageLink";

interface CardHeaderProps {
  card: Card;
  placeholderImage: string;
}

const CardHeader: FunctionComponent<CardHeaderProps> = ({
  card,
  placeholderImage,
}) => {
  // בדיקה אם יש כתובת אתר לעסק
  const hasWebsite = !!card.web;

  return (
    <div className="card-header-container position-relative">
      <UniversalImageLink
        externalUrl={hasWebsite ? card.web : undefined}
        imageUrl={card.image?.url}
        imageAlt={card.image?.alt}
        title={card.title}
        height="300px"
        // openInNewTab={hasWebsite}
      />

      {/* אינדיקטור שהתמונה מקשרת לאתר - מוצג רק אם יש אתר */}
      {/* {hasWebsite && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            zIndex: 1
          }}
        >
          <svg width="16" height="16" viewBox="0 0 256 256">
            <path
              d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"
              fill="currentColor"
            />
          </svg>
          לאתר העסק
        </div>
      )} */}
    </div>
  );
};

export default CardHeader;
