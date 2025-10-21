// Кастомні класи помилок для різних сценаріїв
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "DATABASE_ERROR", 500, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} не знайдено`, "NOT_FOUND", 404);
  }
}
