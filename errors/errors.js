class RouteError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "RouteError";
    this.code = code;
  }
}

class BadRequestError extends RouteError {
  constructor(message) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

class NotFoundError extends RouteError {
  constructor(message) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

module.exports = { RouteError, BadRequestError, NotFoundError };
