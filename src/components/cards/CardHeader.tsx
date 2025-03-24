import { FunctionComponent } from "react";
import { Card } from "../../interfaces/cards/Cards";
import UniversalImageLink from "./UniversalImageLink";

interface CardHeaderProps {
  card: Card;
}

const CardHeader: FunctionComponent<CardHeaderProps> = ({ card }) => {
  return (
    <div className="card-header-container position-relative">
      <UniversalImageLink
        externalUrl={card.web}
        imageUrl={card.image?.url}
        imageAlt={card.image?.alt}
        title={card.title}
        height="300px"
      />
    </div>
  );
};

export default CardHeader;
