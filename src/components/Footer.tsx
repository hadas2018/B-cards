import { FunctionComponent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  // בדיקה אם הנתיב הנוכחי פעיל
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // הגדרת פריטי הניווט - דינמיים בהתאם להרשאות
  const getNavigationItems = () => {
    const items = [
      {
        path: "/about",
        icon: (
          <svg width="24" height="24" viewBox="0 0 256 256">
            <path
              d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"
              fill="currentColor"
            />
          </svg>
        ),
        label: "About",
        title: "About",
      },
    ];

    // פריטים רק למשתמשים מחוברים
    if (isLoggedIn) {
      items.push(
        {
          path: "/favorite-cards",
          icon: (
            <svg width="24" height="24" viewBox="0 0 256 256">
              <path
                d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"
                fill="currentColor"
              />
            </svg>
          ),
          label: "Favorites",
          title: "My favorite cards",
        },
        {
          path: "/my-cards",
          icon: (
            <svg width="24" height="24" viewBox="0 0 256 256">
              <path
                d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,64H216V96H40Zm176,128H40V112H216Z"
                fill="currentColor"
              />
            </svg>
          ),
          label: "My-Cards",
          title: "my-cards",
        }
      );

      // פריט ליצירת כרטיס חדש (זמין לכל המשתמשים המחוברים)
      items.push({
        path: "/new-card",
        icon: (
          <svg width="24" height="24" viewBox="0 0 256 256">
            <path
              d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
              fill="currentColor"
            />
          </svg>
        ),
        label: "New-Card",
        title: "Create a new card",
      });

      // פריטים רק למנהלים
      if (user && user.isAdmin) {
        items.push({
          path: "/admin",
          icon: (
            <svg width="24" height="24" viewBox="0 0 256 256">
              <path
                d="M232,80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V80A16,16,0,0,1,40,64H216A16,16,0,0,1,232,80ZM216,96H40V200H216ZM136,184a8,8,0,0,0,8-8V156.94l36.28,36.29a8,8,0,0,0,11.31-11.32L155.31,145.6l36.28-36.28a8,8,0,0,0-11.31-11.32L144,134.34V112a8,8,0,0,0-16,0v22.34L91.71,98.06a8,8,0,0,0-11.31,11.28L116.69,145.6,80.4,181.89a8,8,0,0,0,11.31,11.32L128,156.94V176A8,8,0,0,0,136,184Z"
                fill="currentColor"
              />
            </svg>
          ),
          label: "ניהול",
          title: "אזור ניהול",
        });
      }
    }

    return items;
  };

  const navItems = getNavigationItems();

  return (
    <footer className="footer-nav fixed-bottom bg-secondary-subtle border-top py-2" style={{
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      <div className="container">
        <div className="d-flex justify-content-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`footer-nav-item text-center ${
                isActive(item.path) ? "active" : ""
              }`}
              title={item.title}
            >
              <div className={`icon-wrapper ${isActive(item.path) ? "active" : ""}`} style={{
                margin: '0 auto',
                height: '40px',
                width: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s',
                backgroundColor: isActive(item.path) ? 'rgba(13, 110, 253, 0.1)' : 'transparent'
              }}>
                {item.icon}
              </div>
              <div className="footer-nav-label small" style={{ marginTop: '2px' }}>{item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;