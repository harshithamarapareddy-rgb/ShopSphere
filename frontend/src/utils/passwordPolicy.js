export const PASSWORD_MESSAGE =
  'Password must be more than 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.';

export const getPasswordChecks = (password = '') => [
  { label: 'More than 6 characters', met: password.length > 6 },
  { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
  { label: 'One lowercase letter', met: /[a-z]/.test(password) },
  { label: 'One number', met: /[0-9]/.test(password) },
  {
    label: 'One special character',
    met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
  },
];

export const isStrongPassword = (password = '') =>
  getPasswordChecks(password).every((check) => check.met);
