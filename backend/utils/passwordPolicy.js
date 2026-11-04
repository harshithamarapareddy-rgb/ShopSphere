const PASSWORD_MESSAGE =
  'Password must be more than 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.';

const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < 7) {
    return { valid: false, message: PASSWORD_MESSAGE };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return { valid: false, message: PASSWORD_MESSAGE };
  }

  return { valid: true, message: '' };
};

module.exports = { validatePassword, PASSWORD_MESSAGE };
