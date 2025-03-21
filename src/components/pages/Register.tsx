import { FormikValues, useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { normalizeUser } from "../../utils/users/normalizeUser";
import { unnormalizedUser } from "../../interfaces/users/UnnormalizedUser";
import { registerUser } from "../../services/userService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";

interface RegisterProps {}

const Register: FunctionComponent<RegisterProps> = () => {
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
      first: yup.string().min(2).max(256).required(),
      middle: yup.string().min(2).max(256),
      last: yup.string().min(2).max(256).required(),
      phone: yup.string().min(9).max(11).required(),
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
      image: yup.string().min(14),
      alt: yup.string().min(2).max(256),
      state: yup.string().min(2).max(256),
      country: yup.string().min(2).max(256).required(),
      city: yup.string().min(2).max(256).required(),
      street: yup.string().min(2).max(256).required(),
      houseNumber: yup.number().min(2).max(256).required(),
      zip: yup.number().min(2).max(1000000).required(),
      isBusiness: yup.boolean().required(),
    }),
    onSubmit: (values, { resetForm }) => {
      const normalizedUser = normalizeUser(values as unnormalizedUser);
      console.log(normalizedUser);
      registerUser(normalizedUser)
        .then((res) => {
          console.log(res);
          sucessMassage(`${res.data.email} registerd successfuly`);
        })
        .catch((err) => {
          console.log(err);
          errorMessage(err.response.data);
        });
      resetForm();
    },
  });

  return (
    <>
      <div className="w-50 mx-auto py-3">
        <h1 className="display-1 text-center mb-4">Register</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="Jhon"
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
                  placeholder=""
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
                  placeholder="Doe"
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
                  placeholder="+972"
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
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md">
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
            </div>

            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder=""
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-danger">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  placeholder=""
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.image}
                  name="image"
                />
                <label htmlFor="image">Profile Image</label>
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
                  placeholder=""
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

          <div className="row g-3">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isBusiness"
              name="isBusiness"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.isBusiness}
            />
            <label className="form-check-label" htmlFor="isBusiness">
              Is Business?
            </label>
            {formik.touched.isBusiness && formik.errors.isBusiness && (
              <p className="text-danger">{formik.errors.isBusiness}</p>
            )}
          </div>

          <button
            disabled={!formik.dirty || !formik.isValid}
            type="submit"
            className="btn btn-primary mt-4"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
