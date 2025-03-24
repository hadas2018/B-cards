import { FunctionComponent, useEffect, useState } from "react";
import {
  getAllCards,
  deleteCard,
  CARDS_UPDATED_EVENT,
} from "../../services/cardsService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import Bcard from "./Bcard";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";


interface CardsProps {}

const Cards: FunctionComponent<CardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { searchTerm } = useSearch();

  // Delete handler function to be passed to the hook
  const deleteHandler = async (id: string, type: "card" | "user" | "item") => {
    try {
      if (type === "card") {
        // Check permissions (optional, since Bcard should check this)
        const card = cards.find((c) => c._id === id);
        if (!card) throw new Error("Card not found");

        // Execute deletion
        await deleteCard(id);

        // Reload cards
        loadCards(true);
        sucessMassage("Card deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting card:", err);
      errorMessage("An error occurred while deleting the card");
      throw err;
    }
  };

  // Using the enhanced hook
  const { handleDeleteClick, deleteModalProps } =
    useDeleteConfirmation(deleteHandler);

  useEffect(() => {
    loadCards();

    // Listen for card update events
    const handleCardsUpdated = () => {
      console.log("Cards updated event received in Cards");
      loadCards(true);
    };

    window.addEventListener(CARDS_UPDATED_EVENT, handleCardsUpdated);

    // Clean up listener when component unmounts
    return () => {
      window.removeEventListener(CARDS_UPDATED_EVENT, handleCardsUpdated);
    };
  }, []);

  // Filter cards when search term changes
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

  const loadCards = async (silent: boolean = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getAllCards(silent);
      setCards(res.data || []);
      // We don't set filteredCards here, the useEffect will handle it
    } catch (err) {
      console.error("Error loading cards:", err);
      if (!silent) {
        errorMessage("An error occurred while loading the cards");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  if (cards.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>No cards to display</h2>
        <p>Try again later or create new cards</p>
        <button
          onClick={() => loadCards()}
          className="btn btn-outline-primary mt-3"
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh list"}
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h1>Business Cards</h1>
      </div>

      {/* Display message when filtering with no results */}
      {searchTerm && filteredCards.length === 0 && (
        <div className="text-center my-5">
          <h3>No results found for "{searchTerm}"</h3>
          <p>Try searching with different keywords or check your spelling</p>
        </div>
      )}

      {/* Display number of results when filtering with results */}
      {searchTerm && filteredCards.length > 0 && (
        <div className="alert alert-info mb-4">
          Found {filteredCards.length} results for "{searchTerm}"
        </div>
      )}

<div className="row">
  {filteredCards.map((card) => (
    <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={card._id}>
      <Bcard
        card={card}
        isMyCard={Boolean(user && user._id === card.user_id)}
        onDelete={(id) => handleDeleteClick(id, "card")}
        refreshCards={() => loadCards(true)}
      />
    </div>
  ))}
</div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal {...deleteModalProps} />
    </div>
  );
};

export default Cards;
