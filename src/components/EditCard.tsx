import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { Card } from "../../interfaces/cards/Cards";
import { FormikValues, useFormik } from "formik";
import * as yup from "yup";
import { Card } from "../interfaces/cards/Cards";
import { useAuth } from "./context/AuthContext";
import { errorMessage, sucessMassage } from "../services/feedbackService";
import { updateCard } from "../services/adminService";
import { getCardById } from "../services/cardsService";
// import { errorMessage, sucessMassage } from "../../services/feedbackService";
// import { getCardById, updateCard } from "../../services/cardsService";
// import { useAuth } from "../context/AuthContext";

interface EditCardProps {}

const EditCard: FunctionComponent<EditCardProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    // Security check - only logged in users can edit cards
    if (!isLoggedIn || !user) {
      errorMessage("עליך להתחבר כדי לערוך כרטיס");
      navigate("/login");
      return;
    }

    // Ensure the ID is available
    if (!id) {
      errorMessage("מזהה הכרטיס חסר");
      navigate("/");
      return;
    }

    getCardById(id)
      .then((res) => {
        const cardData = res.data;
        setCard(cardData);

        // Check if user has permission to edit this card
        if (cardData.user_id !== user._id && !user.isAdmin) {
          errorMessage("אין לך הרשאה לערוך כרטיס זה");
          navigate("/");
          return;
        }

        // Populate the form with card data
        formik.setValues({
          title: cardData.title || "",
          subtitle: cardData.subtitle || "",
          description: cardData.description || "",
          phone: cardData.phone || "",
          email: cardData.email || "",
          web: cardData.web || "",
          url: cardData.image?.url || "",
          alt: cardData.image?.alt || "",
          state: cardData.address?.state || "",
          country: cardData.address?.country || "",
          city: cardData.address?.city || "",
          street: cardData.address?.street || "",
          houseNumber: cardData.address?.houseNumber || "",
          zip: cardData.address?.zip || "",
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("שגיאה בטעינת נתוני הכרטיס:", err);
        errorMessage("שגיאה בטעינת נתוני הכרטיס");
        navigate("/");
      });
  }, [id, navigate, user, isLoggedIn]);

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      title: "",
      subtitle: "",
      description: "",
      phone: "",
      email: "",
      web: "",
      url: "",
      alt: "",
      state: "",
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
    },
    validationSchema: yup.object({
      title: yup.string().min(2).max(256).required("כותרת נדרשת"),
      subtitle: yup.string().min(2).max(256).required("תת כותרת נדרשת"),
      description: yup.string().min(2).max(1024).required("תיאור נדרש"),
      phone: yup.string().min(9).max(11).required("מספר טלפון נדרש"),
      email: yup.string().email("כתובת אימייל לא תקינה").min(5).required("אימייל נדרש"),
      web: yup.string().min(5).url("כתובת אתר לא תקינה"),
      url: yup.string().min(14).url("כתובת תמונה לא תקינה"),
      alt: yup.string().min(2).max(256),
      state: yup.string().min(2).max(256),
      country: yup.string().min(2).max(256).required("מדינה נדרשת"),
      city: yup.string().min(2).max(256).required("עיר נדרשת"),
      street: yup.string().min(2).max(256).required("רחוב נדרש"),
      houseNumber: yup.number().min(1).required("מספר בית נדרש"),
      zip: yup.number().min(1).required("מיקוד נדרש"),
    }),
    onSubmit: async (values) => {
      if (!id) return;

      try {
        setSubmitting(true);

        // Prepare the card data for update
        const cardForUpdate: Omit<Card, "_id"> = {
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          phone: values.phone,
          email: values.email,
          web: values.web,
          image: {
            url: values.url,
            alt: values.alt || "",
          },
          address: {
            state: values.state || "",
            country: values.country,
            city: values.city,
            street: values.street,
            houseNumber: values.houseNumber,
            zip: values.zip,
          }
          // Do NOT include likes, user_id or bizNumber as they are not allowed by the API
        };

        // Send update request
        const response = await updateCard(id, cardForUpdate);
        
        console.log("Card updated successfully:", response);
        sucessMassage("הכרטיס עודכן בהצלחה");
        
        // Return to card page or cards list
        navigate("/my-cards");
      } catch (err: any) {
        console.error("שגיאה בעדכון הכרטיס:", err);
        
        // Display error message
        if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMessage(err.response.data);
          } else {
            errorMessage(JSON.stringify(err.response.data));
          }
        } else {
          errorMessage("שגיאה בעדכון הכרטיס");
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
          <span className="visually-hidden">טוען נתונים...</span>
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
                <h2 className="mb-0">עריכת כרטיס עסק</h2>
              </div>
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  {/* Card Information */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">פרטי כרטיס</h4>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        כותרת*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                        required
                      />
                      {formik.touched.title && formik.errors.title && (
                        <div className="text-danger">{formik.errors.title}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="subtitle" className="form-label">
                        תת כותרת*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="subtitle"
                        name="subtitle"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.subtitle}
                        required
                      />
                      {formik.touched.subtitle && formik.errors.subtitle && (
                        <div className="text-danger">{formik.errors.subtitle}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        תיאור*
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows={3}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        required
                      />
                      {formik.touched.description && formik.errors.description && (
                        <div className="text-danger">{formik.errors.description}</div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">פרטי התקשרות</h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">
                          טלפון*
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.phone}
                          required
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <div className="text-danger">{formik.errors.phone}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">
                          אימייל*
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          required
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="text-danger">{formik.errors.email}</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 mt-3">
                      <label htmlFor="web" className="form-label">
                        אתר אינטרנט
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="web"
                        name="web"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.web}
                      />
                      {formik.touched.web && formik.errors.web && (
                        <div className="text-danger">{formik.errors.web}</div>
                      )}
                    </div>
                  </div>

                  {/* Image Information */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">תמונת כרטיס</h4>
                    <div className="mb-3">
                      <label htmlFor="url" className="form-label">
                        כתובת תמונה
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="url"
                        name="url"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.url}
                      />
                      {formik.touched.url && formik.errors.url && (
                        <div className="text-danger">{formik.errors.url}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="alt" className="form-label">
                        טקסט חלופי לתמונה
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="alt"
                        name="alt"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.alt}
                      />
                      {formik.touched.alt && formik.errors.alt && (
                        <div className="text-danger">{formik.errors.alt}</div>
                      )}
                    </div>

                    {formik.values.url && (
                      <div className="text-center mt-2 mb-3">
                        <p className="mb-2">תצוגה מקדימה:</p>
                        <img
                          src={formik.values.url}
                          alt={formik.values.alt || "תצוגה מקדימה של תמונת הכרטיס"}
                          className="rounded border"
                          style={{ maxHeight: "150px", maxWidth: "100%" }}
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x150?text=Image+not+found";
                            e.currentTarget.alt = "תמונה לא זמינה";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <h4 className="border-bottom pb-2">כתובת</h4>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label htmlFor="state" className="form-label">
                          מדינה
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          name="state"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.state}
                        />
                        {formik.touched.state && formik.errors.state && (
                          <div className="text-danger">{formik.errors.state}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="country" className="form-label">
                          ארץ*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          name="country"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.country}
                          required
                        />
                        {formik.touched.country && formik.errors.country && (
                          <div className="text-danger">{formik.errors.country}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="city" className="form-label">
                          עיר*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.city}
                          required
                        />
                        {formik.touched.city && formik.errors.city && (
                          <div className="text-danger">{formik.errors.city}</div>
                        )}
                      </div>
                    </div>

                    <div className="row g-3 mt-2">
                      <div className="col-md-6">
                        <label htmlFor="street" className="form-label">
                          רחוב*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="street"
                          name="street"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.street}
                          required
                        />
                        {formik.touched.street && formik.errors.street && (
                          <div className="text-danger">{formik.errors.street}</div>
                        )}
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="houseNumber" className="form-label">
                          מספר בית*
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="houseNumber"
                          name="houseNumber"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.houseNumber}
                          required
                        />
                        {formik.touched.houseNumber && formik.errors.houseNumber && (
                          <div className="text-danger">{formik.errors.houseNumber}</div>
                        )}
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="zip" className="form-label">
                          מיקוד*
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="zip"
                          name="zip"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.zip}
                          required
                        />
                        {formik.touched.zip && formik.errors.zip && (
                          <div className="text-danger">{formik.errors.zip}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-2 justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/my-cards")}
                    >
                      <i className="fas fa-arrow-right me-2"></i>
                      ביטול
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
                          שומר...
                        </>
                      ) : (
                        "שמור שינויים"
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

export default EditCard;