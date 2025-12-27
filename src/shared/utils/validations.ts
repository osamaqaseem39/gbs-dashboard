// Validation utilities for forms

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  url?: boolean;
  positive?: boolean;
  nonNegative?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (value: any, rules: ValidationRule, fieldName: string): string | null => {
  // Required check
  if (rules.required) {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
  }

  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `${fieldName} must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${fieldName} must be no more than ${rules.maxLength} characters`;
    }
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
    if (rules.url && !/^https?:\/\/.+/.test(value)) {
      return `${fieldName} must be a valid URL`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${fieldName} format is invalid`;
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return `${fieldName} must be at least ${rules.min}`;
    }
    if (rules.max !== undefined && value > rules.max) {
      return `${fieldName} must be no more than ${rules.max}`;
    }
    if (rules.positive && value <= 0) {
      return `${fieldName} must be greater than 0`;
    }
    if (rules.nonNegative && value < 0) {
      return `${fieldName} must be 0 or greater`;
    }
  }

  // Array validations
  if (Array.isArray(value)) {
    if (rules.min !== undefined && value.length < rules.min) {
      return `${fieldName} must have at least ${rules.min} item(s)`;
    }
    if (rules.max !== undefined && value.length > rules.max) {
      return `${fieldName} must have no more than ${rules.max} item(s)`;
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) return customError;
  }

  return null;
};

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const error = validateField(data[field], rules[field], field);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: { required: true, email: true },
  url: { url: true },
  positiveNumber: { required: true, positive: true },
  nonNegativeNumber: { required: true, nonNegative: true },
  slug: {
    required: true,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    minLength: 1,
    maxLength: 100,
  },
  sku: {
    required: true,
    pattern: /^[A-Z0-9-_]+$/,
    minLength: 1,
    maxLength: 50,
  },
  phone: {
    pattern: /^[\d\s\-\+\(\)]+$/,
    minLength: 10,
    maxLength: 20,
  },
  postalCode: {
    pattern: /^[A-Z0-9\s-]+$/,
    minLength: 4,
    maxLength: 10,
  },
};

