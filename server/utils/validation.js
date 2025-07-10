import validator from 'validator';

export function validateRegister({ username, mobile, email, password }) {
  const errors = [];

  if (!validator.isLength(username, { min: 3, max: 30 })) {
    errors.push("Username must be between 3 and 30 characters");
  }

  if (!validator.isMobilePhone(String(mobile), 'any')) {
    errors.push("Invalid mobile number");
  }

  if (!validator.isEmail(email)) {
    errors.push("Invalid email address");
  }

  if (!validator.isStrongPassword(password, { minLength: 6 })) {
    errors.push("Password must be strong (min 6 chars, include number, symbol, upper/lowercase)");
  }

  return errors.length ? { error: { details: [{ message: errors[0] }] } } : {};
}
