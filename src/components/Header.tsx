import { FunctionComponent, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useSearch } from "./context/SearchContext"; // ייבוא הקונטקסט החדש
import ThemeToggle from "./ThemeToggle";
import SearchInput from "./SearchInput";

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const { setSearchTerm, isSearching, setIsSearching } = useSearch(); // שימוש בקונטקסט החיפוש
  const [showTooltip, setShowTooltip] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // מצב חדש לתצוגת החיפוש במובייל
  const location = useLocation(); // לבדיקת המיקום הנוכחי

  // הפעלת החיפוש רק בדפים מסוימים 
  const isSearchablePage = () => {
    return ["/", "/my-cards", "/favorite-cards", "/admin"].includes(
      location.pathname
    );
  };

  // איפוס החיפוש בשינוי נתיב
  useEffect(() => {
    setSearchTerm("");
    setIsSearching(false);
    setShowSearch(false);
  }, [location.pathname, setSearchTerm, setIsSearching]);

  // Handle clicking outside to close the navbar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById("navbarNav");
      const toggler = document.querySelector(".navbar-toggler");

      if (
        navbar &&
        !navbar.contains(event.target as Node) &&
        toggler &&
        !toggler.contains(event.target as Node) &&
        navbarOpen
      ) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [navbarOpen]);

  // Function to display username in the correct format
  const getDisplayName = () => {
    if (!user) return "משתמש";

    if (user.name) {
      if (user.name.first && user.name.last) {
        return `${user.name.first} ${user.name.last}`;
      } else if (user.name.first) {
        return user.name.first;
      } else if (user.name.last) {
        return user.name.last;
      }
    }

    return user.email || user._id.substring(0, 8) || "משתמש";
  };

  // Check if user is business or admin
  const canCreateCard = () => {
    if (!user) return false;
    return user.isAdmin || user.isBusiness;
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  // טיפול בשינוי החיפוש
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(term.trim() !== "");
  };

  // טוגל תצוגת החיפוש במובייל
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // כשמציגים את החיפוש, סוגרים את התפריט
      setNavbarOpen(false);
    }
  };

  return (
    <>
      <nav className="navbar bg-secondary-subtle navbar-expand-lg mb-4 sticky-top border-bottom py-3 px-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Card Project
          </Link>

          <div className="d-flex align-items-center">
            {/* כפתור חיפוש במובייל */}
            {isSearchablePage() && (
              <button
                className="btn btn-outline-secondary me-2 d-lg-none"
                onClick={toggleSearch}
                aria-label={showSearch ? "סגור חיפוש" : "פתח חיפוש"}
              >
                <i
                  className={`fas ${showSearch ? "fa-times" : "fa-search"}`}
                ></i>
              </button>
            )}

            {/* Theme toggle on mobile */}
            <div className="d-lg-none me-2">
              <ThemeToggle />
            </div>

            {/* Hamburger button with animation */}
            <button
              className={`navbar-toggler ${navbarOpen ? "active" : ""}`}
              type="button"
              onClick={toggleNavbar}
              aria-controls="navbarNav"
              aria-expanded={navbarOpen ? "true" : "false"}
              aria-label="Toggle navigation"
            >
              <div className="hamburger-icon">
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
              </div>
            </button>
          </div>

          {/* תיבת החיפוש במובייל - מוצגת רק כשהכפתור נלחץ */}
          {showSearch && isSearchablePage() && (
            <div className="search-mobile-container w-100 mt-3 d-lg-none">
              <SearchInput onSearch={handleSearch} placeholder="חפש..." />
            </div>
          )}

          <div
            className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/About"
                  onClick={() => setNavbarOpen(false)}
                >
                  About
                </Link>
              </li>

              {/* Links shown only for logged-in users */}
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/my-cards"
                      onClick={() => setNavbarOpen(false)}
                    >
                      My-Cards
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/favorite-cards"
                      onClick={() => setNavbarOpen(false)}
                    >
                      Favorites
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center">
              {/* תיבת החיפוש בדסקטופ - מוצגת תמיד אם הדף תומך בחיפוש */}
              {isSearchablePage() && (
                <div
                  className="d-none d-lg-block me-3"
                  style={{ width: "250px" }}
                >
                  <SearchInput
                    onSearch={handleSearch}
                    placeholder="חפש כרטיסים..."
                  />
                </div>
              )}

              {/* Theme toggle on desktop */}
              <div className="d-none d-lg-block me-3">
                <ThemeToggle />
              </div>

              {isLoading ? (
                <div>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  טוען...
                </div>
              ) : isLoggedIn ? (
                <div className="d-flex align-items-center">
                  {user?.image?.url && (
                    // <Link className="nav-link" to="/my-cards" onClick={() => setNavbarOpen(false)}>
                    //   <img
                    //     src={user.image.url}
                    //     alt={user.image.alt || "User profile"}
                    //     className="rounded-circle me-2"
                    //     style={{ width: "30px", height: "30px" }}
                    //   />
                    // </Link>
                    <Link
                      className="nav-link"
                      to="/profile"
                      onClick={() => setNavbarOpen(false)}
                    >
                      <img
                        src={
                          // בדיקה אם URL התמונה מכיל "pixabay" או "avatar"
                          user?.image?.url &&
                          !user.image.url.includes("pixabay") &&
                          !user.image.url.includes("avatar")
                            ? user.image.url
                            : "https://bcard-client.onrender.com/assets/user-BErsOE_C.png" // התמונה החדשה שלך
                        }
                        alt={user?.image?.alt || "User profile"}
                        className="rounded-circle me-2"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Link>
                  )}
                  <span className="me-3">Hello {getDisplayName()}</span>
                  {user?.isAdmin && (
                    <span className="badge bg-info me-2">admin</span>
                  )}
                  {user?.isBusiness && (
                    <span className="badge bg-success me-2">business</span>
                  )}
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      logout();
                      setNavbarOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="btn btn-outline-primary"
                    onClick={() => setNavbarOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Floating button for card creation - shown only for authorized users */}
      {isLoggedIn && canCreateCard() && (
        <div className="position-relative">
          <Link
            to="/new-card"
            className="btn btn-primary rounded-circle position-fixed"
            style={{
              width: "56px",
              height: "56px",
              bottom: "100px",
              right: "24px",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="Create a new card"
          >
            +
          </Link>

          {/* Tooltip */}
          {showTooltip && (
            <div
              className="position-fixed bg-dark text-white py-2 px-2 rounded"
              style={{
                bottom: "88px",
                right: "24px",
                zIndex: 1000,
                fontSize: "14px",
                transition: "opacity 0.2s",
                opacity: showTooltip ? 1 : 0,
              }}
            >
              Create a new card
            </div>
          )}
        </div>
      )}

      {/* CSS for hamburger animation */}
      <style>{`
        .hamburger-icon {
          width: 30px;
          height: 24px;
          position: relative;
          transition: all 0.3s ease;
        }

        .hamburger-icon .line {
          display: block;
          height: 3px;
          width: 100%;
          border-radius: 3px;
          background-color: var(--bs-body-color);
          position: absolute;
          transition: all 0.3s ease;
        }

        .hamburger-icon .line:nth-child(1) {
          top: 0;
        }

        .hamburger-icon .line:nth-child(2) {
          top: 10px;
        }

        .hamburger-icon .line:nth-child(3) {
          top: 20px;
        }

        .navbar-toggler.active .hamburger-icon .line:nth-child(1) {
          transform: translateY(10px) rotate(45deg);
        }

        .navbar-toggler.active .hamburger-icon .line:nth-child(2) {
          opacity: 0;
        }

        .navbar-toggler.active .hamburger-icon .line:nth-child(3) {
          transform: translateY(-10px) rotate(-45deg);
        }

        .navbar-toggler:focus {
          box-shadow: none;
        }

        .search-mobile-container {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          padding: 10px;
          background-color: var(--bs-secondary-bg-subtle);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
      `}</style>
    </>
  );
};

export default Header;
