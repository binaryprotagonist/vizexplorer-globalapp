import { RegisterOptions } from "react-hook-form";

export const firstNameValidation: RegisterOptions = {
  validate: (value) => !!value.trim() || "First Name can't be blank",
  required: "First Name can't be blank"
};

export const lastNameValidation: RegisterOptions = {
  validate: (value) => !!value.trim() || "Last Name can't be blank",
  required: "Last Name can't be blank"
};

export const emailValidation: RegisterOptions = {
  validate: (value) => !!value.trim() || "Work Email can't be blank",
  required: "Work Email can't be blank",
  pattern: {
    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: "Invalid email address"
  }
};
