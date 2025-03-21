// import { unnormalizedUser } from "../../interfaces/users/UnnormalizedUser";
// import { User } from "../../interfaces/users/User";

// export function normalizeUser(values: unnormalizedUser): User {
//   return {




    export const normalizeUser = (values: any) => {
      return {
        _id: values._id || "", // אם אין _id, השתמש במחרוזת ריקה
        createdAt: values.createdAt || Date.now(), // אם אין createdAt, השתמש בזמן הנוכחי
        isAdmin: values.isAdmin || false, // אם אין isAdmin, השתמש בfalse
        name: {
          first: values.first,
          middle: values.middle,
          last: values.last,
        },
   
    // name: {
    //   first: values.first,
    //   middle: values.middle,
    //   last: values.last,
    // },
    phone: values.phone,
    email: values.email,
    password: values.password,
    image: {
      url: values.image,
      alt: values.alt,
    },
    address: {
      state: values.state,
      country: values.country,
      city: values.city,
      street: values.street,
      houseNumber: values.houseNumber,
      zip: values.zip,
    },
    isBusiness: values.isBusiness,
    
  };
}
