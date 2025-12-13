# KrishiDirect AI Coding Instructions

## Project Overview
KrishiDirect is a farmer-to-consumer marketplace built with TypeScript full-stack:
- **Backend**: Express + Prisma ORM + PostgreSQL (port 5000)
- **Frontend**: Multiple React/Vite apps (`frontend/` and `web/`) - two different UI implementations
- **Database**: Prisma-managed PostgreSQL with User and Product models

## Critical Architecture Patterns

### Dual Frontend Structure
The project has **two separate React frontends**:
- `frontend/` - More complete implementation with Header/Footer, Marketplace, Dashboard pages
- `web/` - Simpler implementation with basic auth pages (SignIn/SignUp)

When working on UI features, clarify which frontend to modify. Both use Vite + TypeScript.

### Prisma Integration Pattern
Models use **dynamic Prisma imports** to avoid compilation errors if Prisma isn't generated:
```typescript
// Pattern in models and controllers
let prisma: any = null;
async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}
```
Always follow this pattern - never use static `import { PrismaClient }` at top level.

### Service-Model-Controller Layers
Backend follows strict layering:
1. **Controllers** ([backend/src/controllers/](backend/src/controllers/)) - Request/response handling, validation
2. **Services** ([backend/src/services/](backend/src/services/)) - Business logic, thin wrappers over models
3. **Models** ([backend/src/models/](backend/src/models/)) - Prisma queries with in-memory fallback

Example flow: `product.controller.ts` → `product.service.ts` → `product.model.ts` → Prisma

### Authentication Flow
- JWT tokens with 7-day expiry
- Middleware at [backend/src/middlewares/auth.middleware.ts](backend/src/middlewares/auth.middleware.ts) decodes token and sets `req.user`
- Express Request augmented via global type declaration:
```typescript
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; [key: string]: any };
    }
  }
}
```
Protected routes use `authMiddleware` before controller handlers.

## Development Workflows

### Database Migrations
**ALWAYS run migrations after schema changes:**
```bash
cd backend
npx prisma migrate dev --name descriptive_name
npx prisma generate  # Regenerate client types
```

### Starting Development Servers
```bash
# Backend (from backend/)
npm run dev  # Uses nodemon, watches src/**/*

# Frontend (from frontend/ or web/)
npm run dev  # Vite on port 3000
```

**Common issue**: Port 5000 conflicts. Kill existing process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux) or use Task Manager on Windows.

### Type Generation
- Backend types: `npx prisma generate` after schema changes
- Frontend types: Define in `src/types/index.d.ts`

## Project-Specific Conventions

### API Routes Pattern
All routes under `/api` prefix ([backend/src/routes/index.ts](backend/src/routes/index.ts)):
- `/api/auth/register` `/api/auth/login`
- `/api/products` (CRUD)

Controllers export **named functions** not default classes:
```typescript
// Correct pattern (product.controller.ts)
export async function getAllProducts(req: Request, res: Response) { ... }
export async function createProduct(req: Request, res: Response) { ... }
```

### Error Handling
- Controllers catch errors and return JSON with `{ message: string }`
- Global error middleware at [backend/src/middlewares/error.middleware.ts](backend/src/middlewares/error.middleware.ts)
- Never throw unhandled exceptions from controllers

### Prisma Schema Conventions
- IDs use `@default(cuid())` not auto-increment
- All models have `createdAt`/`updatedAt` timestamps
- Cascade deletes: `onDelete: Cascade` on foreign keys
- Default values: `@default("farmer")` for role, `@default("kg")` for unit

### Environment Variables
Required in `backend/.env`:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=secure_random_string
PORT=5000
NODE_ENV=development
```
Use [backend/.env.example](backend/.env.example) as template.

## Key Integration Points

### CORS Configuration
Backend allows all origins ([backend/src/app.ts](backend/src/app.ts#L14)): `app.use(cors())`. Adjust for production.

### Frontend API Client
Both frontends use Axios via `services/api.ts` - configure `VITE_API_URL` env var (defaults to `http://localhost:5000/api`).

### Docker Setup
[docker-compose.yml](docker-compose.yml) defines services but needs DATABASE_URL/JWT_SECRET updates. Not currently used in development.

## Testing & Debugging

### Seed Data Route
**Development only** - quick product creation:
```bash
curl http://localhost:5000/api/_seed
```
Creates test farmer and sample product. Remove before production.

### Common Issues
1. **Prisma client errors**: Run `npx prisma generate` in backend/
2. **Port conflicts**: Check terminal history for failed `npm run dev` (exit code 1)
3. **Type errors**: Ensure `@prisma/client` types match schema - regenerate after migrations
4. **Authentication 401**: Verify JWT_SECRET matches between registration and validation

## Files to Consult
- Schema changes: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)
- Route registration: [backend/src/routes/index.ts](backend/src/routes/index.ts)
- Auth logic: [backend/src/controllers/auth.controller.ts](backend/src/controllers/auth.controller.ts)
- Product CRUD: [backend/src/controllers/product.controller.ts](backend/src/controllers/product.controller.ts)
- Frontend structure: [frontend/src/App.tsx](frontend/src/App.tsx) vs [web/src/App.tsx](web/src/App.tsx)
