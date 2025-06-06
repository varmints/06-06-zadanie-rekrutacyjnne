export class AppError extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
  
      Object.setPrototypeOf(this, AppError.prototype);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
      super(message, 404);
      Object.setPrototypeOf(this, NotFoundError.prototype);
    }
  }
  
  export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
      super(message, 400);
      Object.setPrototypeOf(this, BadRequestError.prototype);
    }
  }