import validator from 'validator';

export function validateRegister({ username, mobile, email, password }) {
  const errors = [];

  if (!validator.isLength(username, { min: 3, max: 30 })) {
    errors.push("Username must be between 3 and 30 characters");
  }

  // Check if mobile is numeric and exactly 10 digits (Indian format)
  if (!validator.isMobilePhone(String(mobile), 'en-IN') || String(mobile).length !== 10) {
    errors.push("Invalid mobile number. It must be 10 digits (India)");
  }

  if (!validator.isEmail(email)) {
    errors.push("Invalid email address");
  }

  if (!validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })) {
    errors.push("Password must be strong (min 6 chars, include number, symbol, upper/lowercase)");
  }

  return errors.length ? { error: { details: [{ message: errors[0] }] } } : {};
}
