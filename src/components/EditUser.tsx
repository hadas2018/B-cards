import { FormikValues, useFormik } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../interfaces/users/User";
import { useAuth } from "./context/AuthContext";
import { errorMessage, sucessMassage } from "../services/feedbackService";
import { getUserById, updateUser } from "../services/userService";

interface EditUserProps {}

const EditUser: FunctionComponent<EditUserProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user: authUser, isLoggedIn, refreshUser } = useAuth();

  useEffect(() => {
    // Security check - only logged in users can edit profiles
    if (!isLoggedIn || !authUser) {
      errorMessage("You must be logged in to edit a profile");
      navigate("/login");
      return;
    }

    // Ensure the ID is available
    if (!id) {
      errorMessage("User ID is missing");
      navigate("/profile");
      return;
    }

    // Security check - users can only edit their own profile (unless admin)
    if (id !== authUser._id && !authUser.isAdmin) {
      errorMessage("You can only edit your own profile");
      navigate("/profile");
      return;
    }

    getUserById(id)
      .then((res) => {
        const userData = res.data;
        setUser(userData);
        
        // Populate the form fields with user data
        formik.setValues({
          first: userData.name?.first || "",
          middle: userData.name?.middle || "",
          last: userData.name?.last || "",
          phone: userData.phone || "",
          email: userData.email || "",
          password: "", // Don't populate password fields for security
          confirmPassword: "",
          image: userData.image?.url || "",
          alt: userData.image?.alt || "",
          state: userData.address?.state || "",
          country: userData.address?.country || "",
          city: userData.address?.city || "",
          street: userData.address?.street || "",
          houseNumber: userData.address?.houseNumber || "",
          zip: userData.address?.zip || "",
          isBusiness: userData.isBusiness || false,
        });
        
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Failed to fetch user data");
        navigate("/profile");
      });
  }, [id, navigate, authUser, isLoggedIn]);

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      first: "",
      middle: "",
      last: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
      alt: "",
      state: "",
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
      isBusiness: false,
    },
    validationSchema: yup.object({
      first: yup.string().min(2).max(256).required("First name is required"),
      middle: yup.string().min(2).max(256),
      last: yup.string().min(2).max(256).required("Last name is required"),
      phone: yup.string().min(9).max(11).required("Phone number is required"),
      email: yup.string().email("Invalid email address").min(5).required("Email is required"),
      password: yup
        .string()
        .min(7)
        .max(20)
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'
        )
        .test('is-empty-or-valid', 'Invalid password', function (value) {
          // Allow empty password (no update) or validate if provided
          return !value || this.isType(value);
        }),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .when('password', {
          is: (val: string) => val && val.length > 0,
          then: (schema) => schema.required('Confirm password is required when setting a new password'),
        }),
      image: yup.string().min(14, "Image URL must be at least 14 characters"),
      alt: yup.string().min(2).max(256),
      state: yup.string().min(2).max(256),
      country: yup.string().min(2).max(256).required("Country is required"),
      city: yup.string().min(2).max(256).required("City is required"),
      street: yup.string().min(2).max(256).required("Street is required"),
      houseNumber: yup.number().min(1).required("House number is required"),
      zip: yup.number().min(1).max(1000000).required("Zip code is required"),
      isBusiness: yup.boolean().required("Business status is required"),
    }),
    onSubmit: async (values) => {
      if (!id) return;
      
      try {
        setSubmitting(true);
        
        // Prepare a complete update object according to API requirements
        const updateData = {
          name: {
            first: values.first,
            middle: values.middle || "",
            last: values.last
          },
          phone: values.phone,
          // Don't include email as server doesn't allow updating it in this endpoint
          image: {
            url: values.image || "",
            alt: values.alt || ""
          },
          address: {
            state: values.state || "",
            country: values.country,
            city: values.city,
            street: values.street,
            houseNumber: values.houseNumber,
            zip: values.zip
          }
          // Removed isBusiness as it's not allowed to be updated this way
        };
        
        // Only add password if user entered a new one
        if (values.password) {
          updateData.password = values.password;
        }
        
        console.log("Sending update data:", updateData);
        
        // Send the update request
        const response = await updateUser(id, updateData);
        
        console.log("Update response:", response);
        sucessMassage(`Profile updated successfully`);
        
        // Refresh user data across the app
        refreshUser();
        
        // Return to profile page
        navigate("/profile");
      } catch (err: any) {
        console.error("Update error:", err);
        
        // Display error message from server if available
        if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMessage(err.response.data);
          } else {
            errorMessage(JSON.stringify(err.response.data));
          }
        } else {
          errorMessage("Failed to update user");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading user data...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0">Edit Profile</h2>
              </div>
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  {/* Personal Information */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">Personal Information</h4>
                    <div className="row g-3">
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="First Name"
                            name="first"
                            required
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.first}
                          />
                          <label htmlFor="firstName">First Name</label>
                          {formik.touched.first && formik.errors.first && (
                            <p className="text-danger">{formik.errors.first}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="middleName"
                            placeholder="Middle Name"
                            name="middle"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.middle}
                          />
                          <label htmlFor="middleName">Middle Name</label>
                          {formik.touched.middle && formik.errors.middle && (
                            <p className="text-danger">{formik.errors.middle}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Last Name"
                            name="last"
                            required
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.last}
                          />
                          <label htmlFor="lastName">Last Name</label>
                          {formik.touched.last && formik.errors.last && (
                            <p className="text-danger">{formik.errors.last}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="tel"
                            className="form-control"
                            id="tel"
                            placeholder="Phone"
                            name="phone"
                            required
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                          />
                          <label htmlFor="tel">Phone</label>
                          {formik.touched.phone && formik.errors.phone && (
                            <p className="text-danger">{formik.errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            required
                            disabled // Email can't be updated through this form
                          />
                          <label htmlFor="email">Email</label>
                          <small className="text-muted">Email cannot be changed through this form</small>
                          {formik.touched.email && formik.errors.email && (
                            <p className="text-danger">{formik.errors.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">Password</h4>
                    <div className="alert alert-info mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Leave password fields empty to keep your current password.
                    </div>
                    <div className="row g-2">
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="New Password"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                          />
                          <label htmlFor="password">New Password</label>
                          {formik.touched.password && formik.errors.password && (
                            <p className="text-danger">{formik.errors.password}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm New Password"
                            name="confirmPassword"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                          />
                          <label htmlFor="confirmPassword">Confirm New Password</label>
                          {formik.touched.confirmPassword &&
                            formik.errors.confirmPassword && (
                              <p className="text-danger">
                                {formik.errors.confirmPassword}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">Profile Image</h4>
                    <div className="row g-2">
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="url"
                            className="form-control"
                            id="image"
                            placeholder="Image URL"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.image}
                            name="image"
                          />
                          <label htmlFor="image">Profile Image URL</label>
                          {formik.touched.image && formik.errors.image && (
                            <p className="text-danger">{formik.errors.image}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="alt"
                            placeholder="Alternative Text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.alt}
                            name="alt"
                          />
                          <label htmlFor="alt">Alternative Text</label>
                          {formik.touched.alt && formik.errors.alt && (
                            <p className="text-danger">{formik.errors.alt}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {formik.values.image && (
                      <div className="text-center mt-2 mb-3">
                        <p className="mb-2">Preview:</p>
                        <img
                          src={formik.values.image}
                          alt={formik.values.alt || "Profile preview"}
                          className="rounded border"
                          style={{ maxHeight: "100px", maxWidth: "100%" }}
                          onError={(e) => {
                            e.currentTarget.src = "https://bcard-client.onrender.com/assets/user-BErsOE_C.png";
                            e.currentTarget.alt = "Invalid image URL";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">Address Information</h4>
                    <div className="row g-3">
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="state"
                            placeholder="State"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.state}
                            name="state"
                          />
                          <label htmlFor="state">State</label>
                          {formik.touched.state && formik.errors.state && (
                            <p className="text-danger">{formik.errors.state}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="country"
                            placeholder="Country"
                            name="country"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.country}
                            required
                          />
                          <label htmlFor="country">Country</label>
                          {formik.touched.country && formik.errors.country && (
                            <p className="text-danger">{formik.errors.country}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            placeholder="City"
                            name="city"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.city}
                            required
                          />
                          <label htmlFor="city">City</label>
                          {formik.touched.city && formik.errors.city && (
                            <p className="text-danger">{formik.errors.city}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="street"
                            placeholder="Street"
                            name="street"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.street}
                            required
                          />
                          <label htmlFor="street">Street</label>
                          {formik.touched.street && formik.errors.street && (
                            <p className="text-danger">{formik.errors.street}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-floating mb-3">
                          <input
                            type="number"
                            className="form-control"
                            id="houseNumber"
                            placeholder="House Number"
                            name="houseNumber"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.houseNumber}
                            required
                          />
                          <label htmlFor="houseNumber">House Number</label>
                          {formik.touched.houseNumber && formik.errors.houseNumber && (
                            <p className="text-danger">{formik.errors.houseNumber}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-floating mb-3">
                          <input
                            type="number"
                            className="form-control"
                            id="zip"
                            placeholder="Zip Code"
                            name="zip"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.zip}
                            required
                          />
                          <label htmlFor="zip">Zip Code</label>
                          {formik.touched.zip && formik.errors.zip && (
                            <p className="text-danger">{formik.errors.zip}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Type */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">Account Type</h4>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isBusiness"
                        name="isBusiness"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.isBusiness}
                        disabled // Business status can't be updated through this form
                      />
                      <label className="form-check-label" htmlFor="isBusiness">
                        Business Account
                      </label>
                      <small className="text-muted d-block">Business status cannot be changed through this form</small>
                      {formik.touched.isBusiness && formik.errors.isBusiness && (
                        <p className="text-danger">{formik.errors.isBusiness}</p>
                      )}
                    </div>
                    <div className="alert alert-light">
                      <i className="fas fa-info-circle me-2"></i>
                      Business accounts can create and manage business cards.
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-2 justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/profile")}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!formik.isValid || submitting}
                    >
                      <i className="fas fa-save me-2"></i>
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;