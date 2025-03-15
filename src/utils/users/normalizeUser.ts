import { unnormalizedUser } from "../../interfaces/users/UnnormalizedUser";
import { User } from "../../interfaces/users/User";

export function normalizeUser(values: unnormalizedUser): User {
  return {
    name: {
      first: values.first,
      middle: values.middle,
      last: values.last,
    },
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
