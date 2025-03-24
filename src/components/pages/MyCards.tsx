import { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCards, deleteCard } from "../../services/cardsService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import Bcard from "../cards/Bcard";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";

interface MyCardsProps {}

const MyCards: FunctionComponent<MyCardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn } = useAuth();
  const { searchTerm } = useSearch();

  // The delete function that will be passed to the hook
  const deleteHandler = async (id: string, type: "card" | "user" | "item") => {
    try {
      if (type === "card") {
        await deleteCard(id);
        setCards((prev) => prev.filter((card) => card._id !== id));
        sucessMassage("Card deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting card:", err);
      errorMessage("An error occurred while deleting the card");
      throw err; // Pass the error to the hook for handling
    }
  };

  // Using the enhanced hook
  const { handleDeleteClick, deleteModalProps } =
    useDeleteConfirmation(deleteHandler);

  useEffect(() => {
    // Make sure the user is logged in
    if (!isLoggedIn || !user) {
      errorMessage("You must be logged in to view your cards");
      return;
    }

    // Load the user's cards
    loadCards();
  }, [isLoggedIn, user]);

  // Filter cards by search term
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

  const loadCards = () => {
    setLoading(true);
    getMyCards()
      .then((res) => {
        setCards(res.data);
      })
      .catch((err) => {
        console.error("Error loading cards:", err);
        errorMessage("An error occurred while loading cards");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="text-center my-5">
        <h2>Not Logged In</h2>
        <p>You must be logged in to view your cards</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>You have no cards</h2>
        {(user.isBusiness || user.isAdmin) && (
          <div className="mt-3">
            <p>Want to create a new business card?</p>
            <Link to="/new-card" className="btn btn-primary">
              Create New Card
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Cards</h1>

      {/* Display message when filtering with no results */}
      {searchTerm && filteredCards.length === 0 && (
        <div className="alert alert-info">
          <h5>No results found for "{searchTerm}"</h5>
          <p className="mb-0">Try searching with different keywords or check the spelling</p>
        </div>
      )}

      {/* Display number of results when filtering with results */}
      {searchTerm && filteredCards.length > 0 && (
        <p className="alert alert-info mb-4">
          Found {filteredCards.length} results for "{searchTerm}"
        </p>
      )}

      <div className="row">
        {filteredCards.map((card) => (
          <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
            <Bcard
              card={card}
              isMyCard={true}
              onDelete={(id) => handleDeleteClick(id, "card")}
            />
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal {...deleteModalProps} />
    </div>
  );
};

export default MyCards;
