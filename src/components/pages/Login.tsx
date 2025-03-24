import { FormikValues, useFormik } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import * as yup from "yup";
import { loginUser } from "../../services/userService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
  let navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isLoggedIn } = useAuth(); // שימוש בפונקציית login מה-AuthContext
  
  // אם המשתמש כבר מחובר, נתב לדף הראשי
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().min(5).required(),
      password: yup
        .string()
        .min(7)
        .max(20)
        .required()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsLoggingIn(true);
      
      loginUser(values)
        .then((res) => {
          // הדפסת תשובת השרת כדי לבדוק את המבנה המדויק
          console.log("Login response:", res.data);
          
          // בדיקת המבנה הנכון של הטוקן
          let token;
          if (typeof res.data === 'string') {
            // אם התשובה היא מחרוזת, זה כנראה הטוקן עצמו
            token = res.data;
          } else if (res.data && res.data.token) {
            // אם התשובה היא אובייקט עם שדה token
            token = res.data.token;
          } else {
            // לא נמצא טוקן בתשובה - שגיאה
            throw new Error("Token not found in server response");
          }
          
          // שימוש בפונקציה login שמגיעה מ-AuthContext
          login(token);
          
          // הודעת הצלחה וניתוב
          sucessMassage(`${values.email} התחברת בהצלחה`);
          navigate("/");
        })
        .catch((err) => {
          console.error("Login error:", err);
          let errorMsg = "Login failed";
          
          if (err.response && err.response.data) {
            errorMsg = err.response.data;
          } else if (err.message) {
            errorMsg = err.message;
          }
          
          errorMessage(errorMsg);
        })
        .finally(() => {
          setIsLoggingIn(false);
        });
        
      resetForm();
    },
  });
  
  return (
    <>
      <div className="w-50 mx-auto py-3">
        <h1 className="display-1 text-center mb-4">Login</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="jhon@doe.com"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              required
            />
            <label htmlFor="email">Email</label>
            {formik.touched.email && formik.errors.email && (
              <p className="text-danger">{formik.errors.email}</p>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder=""
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              required
            />
            <label htmlFor="password">Password</label>
            {formik.touched.password && formik.errors.password && (
              <p className="text-danger">{formik.errors.password}</p>
            )}
          </div>
          <button
            disabled={!formik.dirty || !formik.isValid || isLoggingIn}
            type="submit"
            className="btn btn-primary mt-4"
          >
            {isLoggingIn ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
        
        <div className="mt-3 text-center">
          <p>Don't have an account? <a href="/register">Register here </a></p>
        </div>
      </div>
    </>
  );
};

export default Login;