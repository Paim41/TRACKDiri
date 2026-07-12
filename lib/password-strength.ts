export function validatePasswordStrength(password: string) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

export function isStrongPassword(password: string) {
  return Object.values(validatePasswordStrength(password)).every(Boolean);
}
