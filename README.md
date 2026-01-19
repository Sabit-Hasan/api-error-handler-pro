# 🚀 API Error Handler

> Comprehensive error handling for Node.js/Express with MongoDB, validation adapters, i18n, logging, rate-limiting, and GraphQL support.

[![npm version](https://img.shields.io/npm/v/api-error-handler-pro)](https://www.npmjs.com/package/api-error-handler-pro)
[![npm downloads](https://img.shields.io/npm/dm/api-error-handler-pro)](https://www.npmjs.com/package/api-error-handler-pro)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

## ✨ Features

- **🗄️ MongoDB Error Parser** - Auto-parse MongoDB errors (duplicates, validation, casts)
- **✅ Validation Adapters** - Support for Zod and Joi validation libraries
- **🌍 Error Localization** - Built-in i18n with EN, FR, ES (+ custom locales)
- **📝 Logging Adapters** - Winston, Pino, or Console logging
- **🚦 Rate Limiting** - HTTP 429 with configurable limits
- **📊 GraphQL Support** - Format errors for Apollo Server

## 📦 Installation

```bash
npm install api-error-handler-pro
```

**Optional dependencies:**
- `winston` or `pino` for advanced logging
- `zod` or `joi` for validation

## 🚀 Quick Start (30 seconds)

```typescript
import express from "express";
import { 
  errorMiddleware, 
  asyncHandler, 
  BadRequestError 
} from "api-error-handler-pro";

const app = express();

// Your routes
app.get("/users/:id", asyncHandler(async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError("ID is required");
  }
  res.json({ id: req.params.id });
}));

// Error middleware (must be last!)
app.use(errorMiddleware);

app.listen(3000);
```

**That's it!** Errors are now automatically caught and formatted.

### 📦 Module Support

This package supports both **ES Modules** and **CommonJS**:

**ES Modules (ESM)**
```typescript
import { BadRequestError, errorMiddleware } from "api-error-handler-pro";
```

**CommonJS**
```javascript
const { BadRequestError, errorMiddleware } = require("api-error-handler-pro");
```

Both work out of the box! Node.js automatically selects the correct format based on your import style.

## 📚 Common Use Cases

### HTTP Errors

```typescript
import {
  BadRequestError,      // 400
  UnauthorizedError,    // 401
  ForbiddenError,       // 403
  NotFoundError,        // 404
  ConflictError,        // 409
  InternalServerError,  // 500
  ValidationError,      // 422
  RateLimitError,       // 429
} from "api-error-handler-pro";

throw new NotFoundError("User not found", { userId: 123 });
throw new ConflictError("Email already exists");
throw new BadRequestError("Invalid input", { field: "email" });
```

**Response format:**
```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404,
  "details": { "userId": 123 }
}
```

### 🗄️ MongoDB Error Parser

Auto-convert MongoDB errors to standard HTTP errors:

```typescript
import { MongoDBErrorParser, asyncHandler, ConflictError } from "api-error-handler-pro";

app.post("/users", asyncHandler(async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    // Automatically converts:
    // - Duplicate key (11000) → 409 Conflict
    // - Validation errors → 422 Validation Error
    // - Cast errors → 400 Bad Request
    throw MongoDBErrorParser.toBaseError(error);
  }
}));
```

### ✅ Validation Errors (Zod / Joi)

Convert validation library errors to standardized format:

```typescript
import { z } from "zod";
import { ValidationErrorAdapter, asyncHandler } from "api-error-handler-pro";

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

app.post("/users", asyncHandler(async (req, res) => {
  try {
    const user = userSchema.parse(req.body);
    res.json(user);
  } catch (error) {
    throw ValidationErrorAdapter.toValidationError(error, "zod");
  }
}));
```

**Works with:**
- `zod` - Pass `"zod"` as second argument
- `joi` - Pass `"joi"` as second argument

### 🌍 Localization (i18n)

Multi-language error messages:

```typescript
import { i18n } from "api-error-handler-pro";

// Built-in: en, fr, es
i18n.setLocale("fr");
i18n.translate("NotFound"); // "Non trouvé"

// Add custom locale
i18n.addLocale("de", {
  NotFound: "Nicht gefunden",
  BadRequest: "Ungültige Anfrage",
});
```

### 📝 Logging

Centralized error logging with optional Winston/Pino support:

```typescript
import { loggingService } from "api-error-handler-pro";

// Console logging (default)
loggingService.error("Database error", { code: 500 });
loggingService.warn("High memory usage");
loggingService.info("User created", { userId: 123 });

// Use Winston
import winston from "winston";
import { WinstonAdapter } from "api-error-handler-pro";

const logger = winston.createLogger({ /* config */ });
loggingService.setLogger(new WinstonAdapter(logger));

// Or Pino
import pino from "pino";
import { PinoAdapter } from "api-error-handler-pro";

loggingService.setLogger(new PinoAdapter(pino()));
```

### 🚦 Rate Limiting

Protect your API with automatic rate limiting:

```typescript
import { createRateLimiter } from "api-error-handler-pro";

const limiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  keyGenerator: (req) => req.user?.id || req.ip, // Optional
});

app.use(limiter); // Returns 429 when exceeded

// Response headers:
// X-RateLimit-Limit: 100
// X-RateLimit-Remaining: 45
// X-RateLimit-Reset: 2026-01-19T12:30:00.000Z
```

### 📊 GraphQL Errors

Format errors for Apollo Server:

```typescript
import { GraphQLErrorAdapter } from "api-error-handler-pro";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => GraphQLErrorAdapter.handleApolloError(error),
});
```

**Output:**
```json
{
  "message": "Validation Error",
  "extensions": {
    "code": "GRAPHQL_VALIDATION_ERROR",
    "statusCode": 422,
    "fieldErrors": {
      "email": "Invalid format",
      "age": "Must be 18+"
    }
  }
}
```

## 📚 API Reference

### Error Classes

| Error | Status | Use Case |
|-------|--------|----------|
| `BadRequestError` | 400 | Invalid input/request |
| `UnauthorizedError` | 401 | Authentication failed |
| `ForbiddenError` | 403 | Access denied |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate/conflict |
| `InternalServerError` | 500 | Server error |
| `ValidationError` | 422 | Validation failed |
| `RateLimitError` | 429 | Too many requests |
| `GraphQLError` | - | GraphQL specific |

### Core Exports

```typescript
// Errors
import {
  BaseError,
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ValidationError,
  RateLimitError,
  GraphQLError,
} from "api-error-handler-pro";

// Parsers & Adapters
import {
  MongoDBErrorParser,
  ValidationErrorAdapter,
  GraphQLErrorAdapter,
} from "api-error-handler-pro";

// Localization & Logging
import {
  i18n,
  loggingService,
  WinstonAdapter,
  PinoAdapter,
} from "api-error-handler-pro";

// Middleware
import {
  errorMiddleware,
  createRateLimiter,
  asyncHandler,
} from "api-error-handler-pro";
```

## 🛠️ Development

```bash
# Build
npm run build

# Watch mode
npm run dev
```

## 💡 Tips

- Always use `asyncHandler()` to wrap async routes
- Place `errorMiddleware` **last** in your middleware chain
- Check the `details` field for additional error info
- Use `loggingService` for centralized error logging
- Test rate limiting with `X-RateLimit-*` headers

## 📄 License

ISC - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please open an issue or PR on GitHub.

---

**Made by Md.Sabit Hasan**
