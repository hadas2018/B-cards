import { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import {
  fetchAllUsers,
  fetchAllCards,
  updateUserRole,
  deleteUser,
  deleteCard,
  updateUser,
  updateCard,
} from "../../services/adminService";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";

// Types
import { useAuth } from "../context/AuthContext";
import CardsTable from "./CardsTable";
import UsersTable from "./UsersTable";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";
import { User } from "../../interfaces/users/User";
import { Card } from "../../interfaces/cards/Cards";
import CardEditModal from "../modal/CardEditModal";
import UserEditModal from "../modal/UserEditModal";

// import { Card, User } from "../../interfaces/types";

const AdminPage = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState<"users" | "cards">("users");

  // Auth context
  const { isLoggedIn, user } = useAuth();

  // Modal states עבור עריכת משתמש וכרטיס
  const [showUserEditModal, setShowUserEditModal] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [showCardEditModal, setShowCardEditModal] = useState<boolean>(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);

  // פונקציית מחיקה שתועבר להוק
  const deleteHandler = async (id: string, type: "user" | "card" | "item") => {
    try {
      if (type === "user") {
        await deleteUser(id);
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else if (type === "card") {
        await deleteCard(id);
        setCards((prev) => prev.filter((card) => card._id !== id));
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      throw err; // העברת השגיאה הלאה להוק
    }
  };

  // שימוש בהוק המשודרג עם פונקציית המחיקה
  const { handleDeleteClick, deleteModalProps, deleteError } =
    useDeleteConfirmation(deleteHandler);

  // הוספת שגיאת מחיקה לשגיאות הכלליות
  useEffect(() => {
    if (deleteError) {
      setError(deleteError);
    }
  }, [deleteError]);

  // Fetch data on component mount with staggered loading
  useEffect(() => {
    const loadData = async () => {
      if (!isLoggedIn || !user?.isAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // תחילה טען משתמשים
        const usersData = await fetchAllUsers();
        setUsers(usersData);

        // אחר כך טען כרטיסים
        const cardsData = await fetchAllCards();
        setCards(cardsData);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, user]);

  // סינון נתונים לפי מושג החיפוש
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      setFilteredCards(cards);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();

    // סינון משתמשים
    const matchedUsers = users.filter(
      (user) =>
        user.name?.first?.toLowerCase().includes(searchTermLower) ||
        user.name?.last?.toLowerCase().includes(searchTermLower) ||
        user.email?.toLowerCase().includes(searchTermLower)
    );
    setFilteredUsers(matchedUsers);

    // סינון כרטיסים
    const matchedCards = cards.filter(
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
    setFilteredCards(matchedCards);
  }, [searchTerm, users, cards]);

  // Users Handlers
  const handleToggleRole = async (
    userId: string,
    role: "admin" | "business"
  ) => {
    try {
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      const updatedUser = {
        ...user,
        isAdmin: role === "admin" ? !user.isAdmin : user.isAdmin,
        isBusiness: role === "business" ? !user.isBusiness : user.isBusiness,
      };

      await updateUserRole(userId, updatedUser);

      // Update local state
      setUsers(users.map((u) => (u._id === userId ? updatedUser : u)));
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again.");
    }
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setShowUserEditModal(true);
  };

  const handleSaveUserEdit = async (editedUser: User) => {
    try {
      await updateUser(editedUser._id, editedUser);

      // Update local state
      setUsers(users.map((u) => (u._id === editedUser._id ? editedUser : u)));
      setShowUserEditModal(false);
      setUserToEdit(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    }
  };

  // Cards Handlers
  const handleEditCard = (card: Card) => {
    setCardToEdit(card);
    setShowCardEditModal(true);
  };

  const handleSaveCardEdit = async (editedCard: Card) => {
    try {
      await updateCard(editedCard._id, editedCard);

      // Update local state
      setCards(cards.map((c) => (c._id === editedCard._id ? editedCard : c)));
      setShowCardEditModal(false);
      setCardToEdit(null);
    } catch (err) {
      console.error("Error updating card:", err);
      setError("Failed to update card. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 py-5">
        <div className="spinner-border text-primary me-3" role="status">
          <span className="visually-hidden">Loading admin dashboard...</span>
        </div>
        <span>Loading admin dashboard...</span>
      </div>
    );
  }

  // Check admin permissions
  if (!user?.isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>
            You don't have permission to view this page. Only admin users can
            access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Client Relations/Content Management</h1>
        <p className="lead">
          Here you can View/Edit/Delete Cards & users, please click a record to
          view full details
        </p>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {/* הצגת מידע על החיפוש אם יש */}
      {searchTerm && (
        <div className="mb-4">
          {filteredUsers.length > 0 || filteredCards.length > 0 ? (
            <div className="alert alert-info">
              נמצאו {filteredUsers.length} משתמשים ו-{filteredCards.length}{" "}
              כרטיסים לחיפוש "{searchTerm}"
            </div>
          ) : (
            <div className="alert alert-warning">
              לא נמצאו תוצאות לחיפוש "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Tabs for switching between users and cards */}
      <ul className="nav nav-tabs mb-4 justify-content-center">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "cards" ? "active" : ""}`}
            onClick={() => setActiveTab("cards")}
          >
            Cards
          </button>
        </li>
      </ul>

      {/* Display either users or cards based on active tab */}
      <div className="mb-5">
        <h2 className="text-center mb-4">
          {activeTab === "users" ? "Users" : "Cards"} Management
        </h2>

        {activeTab === "users" ? (
          <UsersTable
            users={filteredUsers}
            onToggleRole={handleToggleRole}
            onEditUser={handleEditUser}
            onDeleteUser={(id) => handleDeleteClick(id, "user")}
          />
        ) : (
          <CardsTable
            cards={filteredCards}
            users={users}
            onEditCard={handleEditCard}
            onDeleteCard={(id) => handleDeleteClick(id, "card")}
          />
        )}
      </div>

      {/* Modals */}
      <DeleteConfirmationModal {...deleteModalProps} />

      <UserEditModal
        isOpen={showUserEditModal}
        user={userToEdit}
        onClose={() => setShowUserEditModal(false)}
        onSave={handleSaveUserEdit}
      />

      <CardEditModal
        isOpen={showCardEditModal}
        card={cardToEdit}
        onClose={() => setShowCardEditModal(false)}
        onSave={handleSaveCardEdit}
      />
    </div>
  );
};

export default AdminPage;
