import { TFunction } from 'i18next';

// Regular Expressions
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+\/?$/
export const twitterRegex = /^@[a-zA-Z0-9_]{1,15}$/
export const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
export const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
export const phoneRegex = /^\+?[0-9]{7,15}$/
export const zipCodeRegex = /^\d{5}(-\d{4})?$/
export const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/\S*)?$/
export const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
export const dateRegex = /^\d{4}-\d{2}-\d{2}$/

// Validation factories
export const createValidations = (t: TFunction) => ({
  // Required field factory
  required: (field?: string) => ({
    required: field ? t('validations:required', { field }) : t('validations:required'),
  }),

  // Pattern rule helpers
  email: {
    pattern: {
      value: emailRegex,
      message: t('validations:email'),
    },
  },

  username: {
    pattern: {
      value: usernameRegex,
      message: t('validations:username'),
    },
  },

  password: {
    pattern: {
      value: passwordRegex,
      message: t('validations:password'),
    },
  },

  strongPassword: {
    pattern: {
      value: strongPasswordRegex,
      message: t('validations:strongPassword'),
    },
  },

  phone: {
    pattern: {
      value: phoneRegex,
      message: t('validations:phone'),
    },
  },

  zipCode: {
    pattern: {
      value: zipCodeRegex,
      message: t('validations:zipCode'),
    },
  },

  url: {
    pattern: {
      value: urlRegex,
      message: t('validations:url'),
    },
  },

  hexColor: {
    pattern: {
      value: hexColorRegex,
      message: t('validations:hexColor'),
    },
  },

  date: {
    pattern: {
      value: dateRegex,
      message: t('validations:date'),
    },
  },

  linkedin: {
    pattern: {
      value: linkedinRegex,
      message: t('validations:linkedin'),
    },
  },

  twitter: {
    pattern: {
      value: twitterRegex,
      message: t('validations:twitter'),
    },
  },

  // Min/Max validation factories
  minLength: (length: number) => ({
    minLength: {
      value: length,
      message: t('validations:minLength', { length }),
    },
  }),

  maxLength: (length: number) => ({
    maxLength: {
      value: length,
      message: t('validations:maxLength', { length }),
    },
  }),

  minValue: (min: number,) => ({
    min: {
      value: min,
      message: t('validations:minValue', { min }),
    },
  }),

  maxValue: (max: number) => ({
    max: {
      value: max,
      message: t('validations:maxValue', { max }),
    },
  }),

  minValueOrEmpty: (min: number) => ({
    validate: (value: string) =>
      value === "" || Number(value) >= min || t('validations:minValue', { min }),
  }),
  
})