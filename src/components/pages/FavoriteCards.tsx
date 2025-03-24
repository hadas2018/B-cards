import { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFavoriteCards, deleteCard } from "../../services/cardsService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation"; // Import the hook
import Bcard from "../cards/Bcard";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal"; // Import modal component

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

  // The delete function that will be passed to the hook
  const deleteHandler = async (id: string, type: "card" | "user" | "item") => {
    try {
      if (type === "card") {
        // Check delete permissions
        const card = cards.find((c) => c._id === id);
        if (!card) throw new Error("Card not found");

        // Check if the user is the card owner or admin
        if (user && (user._id === card.user_id || user.isAdmin)) {
          await deleteCard(id);
          setCards((prev) => prev.filter((c) => c._id !== id));
          sucessMassage("Card deleted successfully");
        } else {
          errorMessage("You don't have permission to delete this card");
          throw new Error("No delete permissions");
        }
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
    if (!isLoggedIn) {
      errorMessage("You must be logged in to view favorite cards");
      navigate("/login");
      return;
    }

    loadFavoriteCards();
  }, [isLoggedIn, navigate]);

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

  const loadFavoriteCards = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const res = await getFavoriteCards(true);
      if (res.data) {
        setCards(res.data);
      }
    } catch (err) {
      console.error("Error loading favorite cards:", err);
      setError("An error occurred while loading favorite cards");
      errorMessage("An error occurred while loading favorite cards");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // When a user removes a like, the card should disappear from the list
  const handleLikeChange = () => {
    // Simply reload all favorite cards
    loadFavoriteCards(true);
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

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        <h4 className="alert-heading">Error Loading Data</h4>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-between">
          <button
            onClick={() => loadFavoriteCards(true)}
            className="btn btn-outline-danger"
          >
            Try Again
          </button>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>No Favorite Cards</h2>
        <p>You haven't marked any cards as favorites yet.</p>
        <p>You can mark cards as favorites by clicking the heart icon on cards.</p>
        <div className="mt-4">
          <Link to="/" className="btn btn-primary mx-2">
            Back to Home and Discover Cards
          </Link>
          <button
            onClick={() => loadFavoriteCards(true)}
            className="btn btn-outline-secondary mx-2"
          >
            Refresh List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Favorite Cards</h1>
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
                Refreshing...
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
                Refresh List
              </>
            )}
          </button>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Display message when filtering with no results */}
      {searchTerm && filteredCards.length === 0 && (
        <div className="alert alert-info">
          <h5>No results found for "{searchTerm}"</h5>
          <p className="mb-0">Try searching with different keywords or check the spelling</p>
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
          <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
            <Bcard
              card={card}
              // isMyCard={user && user._id === card.user_id}
              isMyCard={Boolean(user && user._id === card.user_id)}
              onLikeChange={handleLikeChange}
              onDelete={(id) => handleDeleteClick(id, "card")} // Using the function from the hook
              refreshCards={() => loadFavoriteCards(true)}
            />
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal {...deleteModalProps} />
    </div>
  );
};

export default FavoriteCards;
