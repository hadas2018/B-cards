import { FunctionComponent, useEffect, useState } from "react";
// import { getUserById } from "../../services/userService";
// import { User } from "../../interfaces/users/User";
// import { errorMessage } from "../../services/feedbackService";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../interfaces/users/User";
import { useAuth } from "./context/AuthContext";
import { errorMessage } from "../services/feedbackService";
import { getUserById } from "../services/userService";
// import { useAuth } from "../context/AuthContext";

interface ProfileProps {}

const Profile: FunctionComponent<ProfileProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: authUser, isLoggedIn } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn || !authUser) {
      errorMessage("You must be logged in to view your profile");
      navigate("/login");
      return;
    }

    // Use the ID from the auth context
    const userId = authUser._id;
    if (!userId) {
      errorMessage("User ID not found");
      navigate("/");
      return;
    }

    getUserById(userId)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Failed to fetch user data");
        navigate("/");
      });
  }, [navigate, authUser, isLoggedIn]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile data...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning text-center">
        <h4>User not found</h4>
        <p>We couldn't find your profile information.</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="m-0">Profile Information</h4>
            </div>
            <div className="text-center pt-4">
              <img
                src={user.image?.url || "https://bcard-client.onrender.com/assets/user-BErsOE_C.png"}
                className="rounded-circle shadow mb-3"
                alt={user.image?.alt || "Profile picture"}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
            <div className="card-body text-center">
              <h3 className="card-title">
                {user.name?.first} {user.name?.middle && user.name.middle + " "}{user.name?.last}
              </h3>
              <div className="my-3">
                {user.isAdmin && (
                  <span className="badge bg-info me-2">Admin</span>
                )}
                {user.isBusiness && (
                  <span className="badge bg-success me-2">Business</span>
                )}
              </div>
              <p className="card-text">
                <i className="fas fa-envelope me-2"></i> {user.email}
              </p>
              <p className="card-text">
                <i className="fas fa-phone me-2"></i> {user.phone}
              </p>
              
              <Link to={`/edit-user/${user._id}`} className="btn btn-primary w-100 mt-3">
                <i className="fas fa-user-edit me-2"></i> Edit Profile
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="m-0">Address Information</h4>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5 className="border-bottom pb-2 mb-3">Location</h5>
                  <p>
                    <strong><i className="fas fa-globe me-2"></i> Country:</strong> {user.address?.country}
                  </p>
                  {user.address?.state && (
                    <p>
                      <strong><i className="fas fa-map me-2"></i> State:</strong> {user.address.state}
                    </p>
                  )}
                  <p>
                    <strong><i className="fas fa-city me-2"></i> City:</strong> {user.address?.city}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5 className="border-bottom pb-2 mb-3">Street Address</h5>
                  <p>
                    <strong><i className="fas fa-road me-2"></i> Street:</strong> {user.address?.street}
                  </p>
                  <p>
                    <strong><i className="fas fa-home me-2"></i> House Number:</strong> {user.address?.houseNumber}
                  </p>
                  <p>
                    <strong><i className="fas fa-mailbox me-2"></i> Zip Code:</strong> {user.address?.zip}
                  </p>
                </div>
              </div>
              
              <div className="alert alert-info mt-3" role="alert">
                <i className="fas fa-info-circle me-2"></i>
                If you need to update your address information, please use the Edit Profile button.
              </div>
            </div>
          </div>
          
          {/* Account Information */}
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-primary text-white">
              <h4 className="m-0">Account Information</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong><i className="fas fa-id-card me-2"></i> User ID:</strong> 
                    <span className="text-muted ms-2" style={{ fontSize: "0.9rem" }}>{user._id}</span>
                  </p>
                  {user.createdAt && (
                    <p>
                      <strong><i className="fas fa-calendar me-2"></i> Member Since:</strong> 
                      <span className="ms-2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  {user.isBusiness && (
                    <div className="alert alert-success" role="alert">
                      <i className="fas fa-briefcase me-2"></i>
                      You have a Business account and can create business cards.
                    </div>
                  )}
                  {user.isAdmin && (
                    <div className="alert alert-info" role="alert">
                      <i className="fas fa-user-shield me-2"></i>
                      You have Admin privileges on this platform.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;