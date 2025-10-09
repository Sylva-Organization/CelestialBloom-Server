import type { Request, Response, NextFunction } from "express";

// ============================================
// TIPOS
// ============================================
interface ValidationError {
  field: string;
  message: string;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

interface ValidationRule {
  required?: boolean;
  type?: "string" | "number" | "email" | "boolean";
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidNumber = (value: any): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value));
};

const sanitizeString = (str: string): string => {
  return str.trim();
};

// ============================================
// VALIDADOR PRINCIPAL
// ============================================

const validateField = (
  fieldName: string,
  value: any,
  rules: ValidationRule
): ValidationError | null => {
  // Si el campo no es requerido y está vacío/undefined, es válido
  if (!rules.required && (value === undefined || value === null || value === "")) {
    return null;
  }

  // Si es requerido y está vacío
  if (rules.required && (value === undefined || value === null || value === "")) {
    return { field: fieldName, message: `${fieldName} is required` };
  }

  // Validación de tipo
  if (rules.type === "string") {
    if (typeof value !== "string") {
      return { field: fieldName, message: `${fieldName} must be a string` };
    }

    const trimmedValue = sanitizeString(value);

    if (rules.min && trimmedValue.length < rules.min) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${rules.min} characters`,
      };
    }

    if (rules.max && trimmedValue.length > rules.max) {
      return {
        field: fieldName,
        message: `${fieldName} must be at most ${rules.max} characters`,
      };
    }

    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
      return { field: fieldName, message: `${fieldName} format is invalid` };
    }
  }

  if (rules.type === "number") {
    if (!isValidNumber(value)) {
      return { field: fieldName, message: `${fieldName} must be a valid number` };
    }

    const numValue = Number(value);

    if (rules.min !== undefined && numValue < rules.min) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${rules.min}`,
      };
    }

    if (rules.max !== undefined && numValue > rules.max) {
      return {
        field: fieldName,
        message: `${fieldName} must be at most ${rules.max}`,
      };
    }
  }

  if (rules.type === "email") {
    if (typeof value !== "string" || !isValidEmail(value)) {
      return { field: fieldName, message: `${fieldName} must be a valid email` };
    }
  }

  // Validación personalizada
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { field: fieldName, message: customError };
    }
  }

  return null;
};

const validate = (data: any, schema: ValidationSchema): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const [fieldName, rules] of Object.entries(schema)) {
    const value = data[fieldName];
    const error = validateField(fieldName, value, rules);

    if (error) {
      errors.push(error);
    }
  }

  return errors;
};

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

const getAllUsersSchema: ValidationSchema = {
  page: {
    required: false,
    type: "number",
    min: 1,
  },
  limit: {
    required: false,
    type: "number",
    min: 1,
    max: 100,
  },
  search: {
    required: false,
    type: "string",
    max: 100,
  },
};

const userIdSchema: ValidationSchema = {
  id: {
    required: true,
    type: "number",
    min: 1,
    custom: (value: any) => {
      const num = Number(value);
      if (!Number.isInteger(num)) {
        return "id must be an integer";
      }
      return null;
    },
  },
};

const updateUserSchema: ValidationSchema = {
  first_name: {
    required: false,
    type: "string",
    min: 2,
    max: 50,
    custom: (value: string) => {
      if (value && /\d/.test(value)) {
        return "first_name cannot contain numbers";
      }
      return null;
    },
  },
  last_name: {
    required: false,
    type: "string",
    min: 2,
    max: 50,
    custom: (value: string) => {
      if (value && /\d/.test(value)) {
        return "last_name cannot contain numbers";
      }
      return null;
    },
  },
  email: {
    required: false,
    type: "email",
    max: 100,
  },
  nick_name: {
    required: false,
    type: "string",
    min: 3,
    max: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
    custom: (value: string) => {
      if (value && /\s/.test(value)) {
        return "nick_name cannot contain spaces";
      }
      return null;
    },
  },
  password: {
    required: false,
    type: "string",
    min: 6,
    max: 100,
  },
};

// ============================================
// MIDDLEWARES DE VALIDACIÓN
// ============================================

export const validateGetAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validate(req.query, getAllUsersSchema);

  if (errors.length > 0) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors,
    });
    return;
  }

  next();
};

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validate(req.params, userIdSchema);

  if (errors.length > 0) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors,
    });
    return;
  }

  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Validar el ID del parámetro
  const paramErrors = validate(req.params, userIdSchema);

  if (paramErrors.length > 0) {
    res.status(400).json({
      message: "Validation failed",
      errors: paramErrors,
    });
    return;
  }

  // Validar el body
  const bodyErrors = validate(req.body, updateUserSchema);

  if (bodyErrors.length > 0) {
    res.status(400).json({
      message: "Validation failed",
      errors: bodyErrors,
    });
    return;
  }

  // Verificar que al menos un campo esté presente para actualizar
  const { first_name, last_name, email, nick_name, password } = req.body;
  const hasAtLeastOneField =
    first_name !== undefined ||
    last_name !== undefined ||
    email !== undefined ||
    nick_name !== undefined ||
    password !== undefined;

  if (!hasAtLeastOneField) {
    res.status(400).json({
      message: "At least one field is required to update",
    });
    return;
  }

  next();
};

export const validateDeleteUser = validateUserId;