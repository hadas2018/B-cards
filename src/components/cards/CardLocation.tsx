import { FunctionComponent } from "react";
import { Card } from "../../interfaces/cards/Cards";

interface CardLocationProps {
  card: Card;
}

const CardLocation: FunctionComponent<CardLocationProps> = ({ card }) => {

  const getDirectionsLink = () => {
    const address = `${card.address.street} ${card.address.houseNumber}, ${card.address.city}, ${card.address.country}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
  };

  return (
    <div className="card shadow-lg rounded-3 mb-4 overflow-hidden">
      <div className="card-header py-3">
        <h4 className="card-title mb-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 256 256"
            className="me-2 text-primary"
          >
            <path
              d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"
              fill="currentColor"
            />
          </svg>
          business location
        </h4>
      </div>

      {/* מפת Google מוטמעת */}
      <div style= {{ position: "relative", height: "300px", width: "100%" }}>
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            `${card.address.street} ${card.address.houseNumber}, ${card.address.city}, ${card.address.country}`
          )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="business location"
        ></iframe>
      </div>

      <div className="card-footer bg-light py-3">
        <a
          href={getDirectionsLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-100"
        >
          <svg width="20" height="20" viewBox="0 0 256 256" className="me-2">
            <path
              d="M229.66,218.34l-50.67-50.66a88.09,88.09,0,1,0-11.32,11.31l50.66,50.67a8,8,0,0,0,11.33-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
              fill="currentColor"
            />
          </svg>
          Directions
        </a>
      </div>
    </div>
  );
};

export default CardLocation;
