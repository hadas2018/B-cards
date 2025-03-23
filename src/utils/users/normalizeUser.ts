export const normalizeUser = (values: any) => {
  return {
    // הסרנו את ה-_id מכאן
    // createdAt רק אם הוא כבר קיים, לא צריך להוסיף בעדכון
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
};