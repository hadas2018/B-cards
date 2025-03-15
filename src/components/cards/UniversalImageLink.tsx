import { FunctionComponent, useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ImageLinkProps {
  // אופציה א: קישור לכרטיס פנימי
  cardId?: string;
  
  // אופציה ב: קישור חיצוני
  externalUrl?: string;
  
  // מאפייני תמונה
  imageUrl?: string;
  imageAlt?: string;
  title: string;
  className?: string;
  height?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  
  // אפשרויות נוספות
  openInNewTab?: boolean;
  onClick?: () => void;
}

// תמונת placeholder סטטית
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Crect width='300' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' font-weight='bold' fill='%23555555'%3E%D7%AA%D7%9E%D7%95%D7%A0%D7%94 %D7%9C%D7%90 %D7%96%D7%9E%D7%99%D7%A0%D7%94%3C/text%3E%3C/svg%3E";

const UniversalImageLink: FunctionComponent<ImageLinkProps> = ({
  cardId,
  externalUrl,
  imageUrl,
  imageAlt,
  title,
  className = "card-img-top",
  height = "180px",
  objectFit = "cover",
  openInNewTab = false,
  onClick
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  
  // איפוס מצב השגיאה כאשר ה-URL משתנה
  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  // פונקציה לטיפול בשגיאת טעינת תמונה
  const handleImageError = () => {
    setImageError(true);
  };

  // קביעת תמונת המקור
  const imageSrc = imageError || !imageUrl ? PLACEHOLDER_IMAGE : imageUrl;
  
  // היגיון להחלטה על סוג הקישור
  const isExternalLink = !!externalUrl;
  const linkTarget = openInNewTab || isExternalLink ? "_blank" : undefined;
  const linkRel = openInNewTab || isExternalLink ? "noopener noreferrer" : undefined;

  // רכיב התמונה - זהה לשני סוגי הקישורים
  const imageComponent = (
    <div 
      style={{ 
        height,
        width: "100%", 
        backgroundColor: "#f8f9fa",
        position: "relative",
        overflow: "hidden",
        borderTopLeftRadius: "0.375rem",
        borderTopRightRadius: "0.375rem"
      }}
    >
      <img
        className={className}
        src={imageSrc}
        alt={imageAlt || title}
        style={{ 
          height: "100%", 
          width: "100%", 
          objectFit
        }}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );

  // החלטה איזה סוג קישור להציג
  if (isExternalLink) {
    return (
      <a 
        href={externalUrl} 
        target={linkTarget} 
        rel={linkRel} 
        onClick={onClick}
      >
        {imageComponent}
      </a>
    );
  }
  
  if (cardId) {
    return (
      <Link 
        to={`/cards/${cardId}`} 
        target={linkTarget} 
        onClick={onClick}
      >
        {imageComponent}
      </Link>
    );
  }
  
  // במקרה שאין קישור כלל - למשל רק לטיפול ב-onClick
  return (
    <div onClick={onClick}>
      {imageComponent}
    </div>
  );
};

export default UniversalImageLink;