import { Card } from "../../interfaces/cards/Cards";
import { UnnormalizedCard } from "../../interfaces/cards/UnnormalizedCard";

// import { UnnormalizedCard } from "../../interfaces/cards/UnnormalizedCard";

export function normalizeCard(values: UnnormalizedCard): Card {
  return {
  
    title: values.title,
    subtitle: values.subtitle,
    description: values.description,
    phone: values.phone,
    email: values.email,
    web: values.web,
    image: {
      url: values.url,
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
  };
}


// export function NormalizeCard(values: UnnormalizedCard) {
//   return {
//     title: values.title,
//     subtitle: values.subtitle,
//     description: values.description,
//     phone: values.phone,
//     email: values.email,
//     web: values.web,
//     image: {
//       url: values.url,
//       alt: values.alt,
//     },
//     // Also include the flat properties for backward compatibility
//     imageUrl: values.url,  // Add this
//     imageAlt: values.alt,  // Add this
//     address: {
//       state: values.state,
//       country: values.country,
//       city: values.city,
//       street: values.street,
//       houseNumber: values.houseNumber,
//       zip: values.zip,
//     },
//     // Include other required properties of Card
//     userId: "", // This should be set elsewhere or passed in
//     createdAt: new Date().toISOString(), // This should be set elsewhere or passed in
//     // Any other missing properties mentioned in the error
//   };
// }