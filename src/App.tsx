import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { lazy } from "react";
import { Suspense } from "react";

const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const Header = lazy(() => import("./components/Header"));
const NewCard = lazy(() => import("./components/NewCard"));
const MyCards = lazy(() => import("./components/MyCards"));
const Cards = lazy(() => import("./components/cards/Cards"));
const FavoriteCards = lazy(() => import("./components/FavoriteCards"));
const CardDetails = lazy(() => import("./components/cards/CardDetails"));
import { AuthProvider } from "./components/context/AuthContext";
import Footer from "./components/Footer";
import About from "./components/context/About";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./components/context/ThemeContext";
import AdminPage from "./components/admin/AdminPage";
import { SearchProvider } from "./components/context/SearchContext";

function App() {
  return (
    <>
      <ThemeProvider>
        <ToastContainer />
        <AuthProvider>
          <SearchProvider>
            <Router>
              <ScrollToTop />
              <Suspense>
                <Header />
                <div className="container" style={{ paddingBottom: "80px" }}>
                  <Routes>
                    <Route path="/" element={<Cards />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/new-card" element={<NewCard />} />
                    <Route path="/my-cards" element={<MyCards />} />
                    <Route path="/favorite-cards" element={<FavoriteCards />} />
                    <Route path="/cards/:id" element={<CardDetails />} />
                    <Route path="/admin" element={<AdminPage />} />
                  </Routes>
                </div>
                <Footer />
              </Suspense>
            </Router>
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
